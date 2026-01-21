import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../database/client";
import solver from "javascript-lp-solver";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { budget, periodDays = 30 } = body;

        if (!budget || typeof budget !== 'number' || budget <= 0) {
            return new NextResponse("Invalid budget provided", { status: 400 });
        }
        
        console.log(`[ADVISOR] Budget: ₦${budget}, Period: ${periodDays} days`);

        // 1. Fetch Products
        const products = await prisma.product.findMany({
            where: { userId: user.id }
        });

        if (products.length === 0) {
            return NextResponse.json({
                recommendations: [],
                summary: { totalCost: 0, totalExpectedProfit: 0, budgetUtilization: 0 }
            });
        }

        // 2. Fetch Sales History (Last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const recentSales = await prisma.saleItem.findMany({
            where: {
                sale: {
                    userId: user.id,
                    date: { gte: ninetyDaysAgo }
                }
            }
        });

        // 3. Calculate Stats & Demand ONCE
        const productStats = new Map<number, { totalSold: number }>();
        
        recentSales.forEach(item => {
            const current = productStats.get(item.productId) || { totalSold: 0 };
            current.totalSold += item.quantity;
            productStats.set(item.productId, current);
        });

        // 4. Build enriched product data with demand forecasts
        const enrichedProducts = products.map(p => {
            const stats = productStats.get(p.id) || { totalSold: 0 };
            
            // Calculate how long product has existed (max 90 days for velocity calc)
            const daysInBusiness = Math.max(
                1, 
                Math.ceil((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24))
            );
            const activeDays = Math.min(daysInBusiness, 90);
            
            // Calculate velocity
            let dailyVelocity = stats.totalSold / activeDays;
            
            // For new products with no sales, assume minimal baseline demand
            if (stats.totalSold === 0) {
                dailyVelocity = 0.3; // Conservative: sells 1 unit every ~3 days
            }
            
            // Forecast demand for the period
            let forecastedDemand = Math.ceil(dailyVelocity * periodDays);
            
            // Apply intelligent minimum shelf level based on product price
            const minShelfLevel = p.costPrice > 20000 ? 2 :  // Expensive items
                                  p.costPrice > 5000 ? 5 :    // Mid-range
                                  8;                           // Low-cost items
            
            forecastedDemand = Math.max(forecastedDemand, minShelfLevel);
            
            // Calculate how much we need to restock
            // Restock up to forecasted demand level (don't overstock beyond forecast)
            const restockNeeded = Math.max(0, forecastedDemand - p.stock);
            
            const profitPerUnit = p.sellingPrice - p.costPrice;
            
            return {
                ...p,
                dailyVelocity,
                forecastedDemand,
                restockNeeded,
                profitPerUnit,
                roi: profitPerUnit / p.costPrice // For sorting/debugging
            };
        });

        // 5. Filter products we can actually afford and need to restock
        const viableProducts = enrichedProducts.filter(p => 
            p.costPrice <= budget && 
            p.restockNeeded > 0 &&
            p.profitPerUnit > 0 // Don't stock loss-making items
        );

        console.log(`[ADVISOR] ${viableProducts.length}/${products.length} products viable for optimization`);

        if (viableProducts.length === 0) {
            return NextResponse.json({
                recommendations: [],
                summary: { 
                    totalCost: 0, 
                    totalExpectedProfit: 0, 
                    budgetUtilization: 0,
                    message: "No products need restocking or all exceed budget"
                }
            });
        }

        // 6. Build LP Model
        const variables: Record<string, any> = {};
        const constraints: Record<string, any> = { budget: { max: budget } };
        const ints: Record<string, number> = {};

        viableProducts.forEach(p => {
            const varName = `product_${p.id}`; // Use ID instead of name to avoid duplicates
            
            variables[varName] = {
                productId: p.id,
                profit: p.profitPerUnit,
                budget: p.costPrice,
                [varName]: 1 // Self-constraint for max bound
            };
            
            // Max units = restock needed (don't exceed forecasted demand)
            constraints[varName] = { max: p.restockNeeded };
            
            // Ensure integer quantities
            ints[varName] = 1;
        });

        const model = {
            optimize: "profit",
            opType: "max" as const,
            constraints,
            variables,
            ints: ints as Record<string, 1>
        };

        console.log("[ADVISOR] Solving optimization model...");

        const result = solver.Solve(model) as any;

        if (!result.feasible) {
            return NextResponse.json({
                recommendations: [],
                summary: { 
                    totalCost: 0, 
                    totalExpectedProfit: 0, 
                    budgetUtilization: 0,
                    message: "No feasible solution found with current budget"
                }
            });
        }

        // 7. Format Results
        const recommendations = [];
        let totalCost = 0;
        let totalExpectedProfit = 0;

        for (const [varName, quantity] of Object.entries(result)) {
            if (["feasible", "result", "bounded"].includes(varName)) continue;
            
            const productId = parseInt(varName.replace("product_", ""));
            const product = enrichedProducts.find(p => p.id === productId);
            
            if (product && typeof quantity === 'number' && quantity > 0) {
                const cost = product.costPrice * quantity;
                const profit = product.profitPerUnit * quantity;
                
                recommendations.push({
                    productId: product.id,
                    name: product.name,
                    quantity,
                    cost,
                    profit,
                    currentStock: product.stock,
                    forecastedDemand: product.forecastedDemand
                });
                
                totalCost += cost;
                totalExpectedProfit += profit;
            }
        }

        console.log(`[ADVISOR] ${recommendations.length} recommendations, ₦${totalCost} cost, ₦${totalExpectedProfit} profit`);

        return NextResponse.json({
            recommendations: recommendations.sort((a, b) => b.profit - a.profit),
            summary: {
                totalCost,
                totalExpectedProfit,
                budgetUtilization: ((totalCost / budget) * 100),
                productsAnalyzed: products.length,
                productsRecommended: recommendations.length
            }
        });

    } catch (error: any) {
        console.error("[ADVISOR_OPTIMIZE]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
