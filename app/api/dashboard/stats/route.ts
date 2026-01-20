import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../database/client";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // 1. Get Summary Stats (Total Revenue, Total Profit)
        // We can aggregate from Sales table
        const salesAgg = await prisma.sale.aggregate({
            where: { userId: user.id },
            _sum: {
                totalAmount: true,
                totalProfit: true,
            },
            _count: {
                id: true // Total transactions
            }
        });

        // 2. Get Low Stock Items
        // Enable "Items Running Low" based on reorderPoint
        const allProducts = await prisma.product.findMany({
            where: { userId: user.id },
            select: { id: true, name: true, stock: true, reorderPoint: true }
        });

        // Explicitly type parameter
        const realLowStockCount = allProducts.filter((p: { stock: number; reorderPoint: number; }) => p.stock <= p.reorderPoint).length;
        // Explicitly type accumulator and current value
        const itemsOnShelves = allProducts.reduce((acc: number, curr: { stock: number }) => acc + curr.stock, 0);


        // 3. Top Selling Items (Simple aggregation via SaleItems)
        const topSelling = await prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    userId: user.id
                }
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 3
        });

        // Hydrate product names for top selling
        // Explicitly type item
        const topProducts = await Promise.all(topSelling.map(async (item: { productId: number; _sum: { quantity: number | null } }) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });
            return {
                name: product?.name || "Unknown",
                count: item._sum.quantity || 0
            };
        }));


        return NextResponse.json({
            moneyIn: salesAgg._sum.totalAmount || 0,
            profit: salesAgg._sum.totalProfit || 0,
            transactions: salesAgg._count.id || 0,
            lowStockItems: realLowStockCount,
            itemsOnShelves: itemsOnShelves,
            topProducts: topProducts
        });

    } catch (error) {
        console.log("[DASHBOARD_STATS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
