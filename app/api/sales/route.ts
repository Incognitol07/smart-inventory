import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../database/client";
import { Prisma } from '../../../generated/prisma/client'
import { generateSmartAlerts } from "../../lib/services/smart-alerts";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Optional: Date filtering can be added here parsing URL search params

        const sales = await prisma.sale.findMany({
            where: {
                userId: user.id,
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.log("[SALES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return new NextResponse("No items in sale", { status: 400 });
        }

        let totalAmount = 0;
        let totalProfit = 0;
        
        type SaleItemData = {
           productId: number;
           quantity: number;
           priceAtSale: number;
           costAtSale: number;
        };
        
        const saleItemsData: SaleItemData[] = [];

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                if (product.userId !== user.id) {
                    throw new Error(`Unauthorized access to product ${item.productId}`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                const itemTotal = product.sellingPrice * item.quantity;
                const itemCost = product.costPrice * item.quantity;
                const itemProfit = itemTotal - itemCost;

                totalAmount += itemTotal;
                totalProfit += itemProfit;

                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: product.stock - item.quantity }
                });

                saleItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    priceAtSale: product.sellingPrice,
                    costAtSale: product.costPrice
                });
            }

            const sale = await tx.sale.create({
                data: {
                    userId: user.id,
                    totalAmount,
                    totalProfit,
                    items: {
                        create: saleItemsData
                    }
                },
                include: {
                    items: true
                }
            });

            return sale;
        });

        // Trigger async notification update (fire and forget)
        generateSmartAlerts(user.id).catch(err => console.error("Background Alert Gen Error:", err));

        return NextResponse.json(result);

    } catch (error: any) {
        console.log("[SALES_POST]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
