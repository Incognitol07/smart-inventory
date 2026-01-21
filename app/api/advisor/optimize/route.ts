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

        if (!budget || typeof budget !== 'number') {
            return new NextResponse("Invalid budget provided", { status: 400 });
        }
        
        console.log(`[ADVISOR] Starting optimization. Budget: ₦${budget}, Period: ${periodDays} days`);

        // 1. Fetch Products
        const products = await prisma.product.findMany({
            where: { userId: user.id }
        });
        console.log(`[ADVISOR] Found ${products.length} products associated with user.`);

        // 2. Fetch Sales History (Last 90 days for velocity calculation)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const recentSales = await prisma.saleItem.findMany({
            where: {
                sale: {
                    userId: user.id,
                    date: {
                        gte: ninetyDaysAgo
                    }
                }
            }
        });
        console.log(`[ADVISOR] Analyzed ${recentSales.length} sales records from the last 90 days.`);

        // 3. Calculate Velocity & Demand Forecast
        const productStats = new Map<number, { totalSold: number }>();
        
        recentSales.forEach(item => {
            const current = productStats.get(item.productId) || { totalSold: 0 };
            current.totalSold += item.quantity;
            productStats.set(item.productId, current);
        });

        const variables: Record<string, any> = {};

        console.log("[ADVISOR] Calculating demand forecasts and building variables...");

        products.forEach(p => {
            const stats = productStats.get(p.id) || { totalSold: 0 };
            // Simple velocity: Total Sold / 90 days (or simple daily avg)
            // If totalSold is 0, we can give it a small minimum demand if we want to encourage trying new stock, 
            // OR strictly stick to data. Let's stick to data but allow a minimum of 1 if stock is 0? 
            // Let's stick to data for "Optimization".
            
            const dailyVelocity = stats.totalSold / 90;
            const forecastedDemand = Math.max(Math.ceil(dailyVelocity * periodDays), 1); // Ensure at least 1 if it has sold before? or just raw. 
            // Let's say if no sales history, demand is 0? Or maybe we assume new products need stock.
            // For now: ceil(velocity * period). If 0 sales, 0 demand.
            
            // Only consider restocking if we can afford at least one
            if (p.costPrice <= budget) {
                 variables[p.name] = {
                     id: p.id,
                     profit: (p.sellingPrice - p.costPrice),
                     cost: p.costPrice,
                     // Constraints
                     budget: p.costPrice, 
                     [p.name]: 1 // For max bound
                 };
            }
        });
        console.log(`[ADVISOR] Considered ${Object.keys(variables).length} products for optimization (affordable & valid).`);

        // 4. Build LP Model
        // We want to Maximize Profit
        const model = {
            optimize: "profit",
            opType: "max" as const,
            constraints: {
                budget: { max: budget },
                ...Object.fromEntries(
                    products.map(p => {
                         const stats = productStats.get(p.id) || { totalSold: 0 };
                         const dailyVelocity = stats.totalSold / 90;

                         // ENHANCEMENT: Enforce a "Minimum Shelf Level" (Safety Stock)
                         // Even if sales are low, successful retail requires a full-looking shelf.
                         // We ensure at least 10 units are demanded to keep shelves stocked.
                         const MIN_SHELF_LEVEL = 10;
                         let demand = Math.ceil(dailyVelocity * periodDays);
                         
                         // If calculated demand is low, boost it to the minimum shelf level
                         demand = Math.max(demand, MIN_SHELF_LEVEL);

                         const restockLimit = Math.max(0, demand - p.stock);
                         
                         return [p.name, { max: restockLimit }];
                    })
                )
            },
            variables: variables,
            ints: products.reduce((acc, p) => ({ ...acc, [p.name]: 1 }), {})
        };

        console.log("[ADVISOR] Solving Linear Programming model...");

        const result = solver.Solve(model) as any;
        console.log(`[ADVISOR] Solver Result Status: ${result.feasible ? 'Feasible' : 'Infeasible'}, Result: ${result.result}`);

        // Format result
        const recommendations = [];
        let totalCost = 0;
        let totalExpectedProfit = 0;

        for (const [key, value] of Object.entries(result)) {
            if (key === "feasible" || key === "result" || key === "bounded") continue;
            
            const product = products.find(p => p.name === key);
            if (product) {
                recommendations.push({
                    productId: product.id,
                    name: product.name,
                    quantity: value,
                    cost: product.costPrice * (value as number),
                    profit: (product.sellingPrice - product.costPrice) * (value as number)
                });
                totalCost += product.costPrice * (value as number);
                totalExpectedProfit += (product.sellingPrice - product.costPrice) * (value as number);
            }
        }

        console.log(`[ADVISOR] Generated ${recommendations.length} recommendations. Total Cost: ₦${totalCost}, Expected Profit: ₦${totalExpectedProfit}`);

        return NextResponse.json({
            recommendations: recommendations.sort((a,b) => b.profit - a.profit),
            summary: {
                totalCost,
                totalExpectedProfit,
                budgetUtilization: (totalCost / budget) * 100
            }
        });

    } catch (error: any) {
        console.log("[ADVISOR_OPTIMIZE]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
