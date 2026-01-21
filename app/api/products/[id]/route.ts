import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../database/client";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, stock, cost, price, reorderPoint } = body;
        // params.id is a string, but our DB ID is Int (from schema.prisma: id Int @id @default(autoincrement()))
        // We need to parse it.
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const product = await prisma.product.update({
            where: {
                id: productId,
                // Ensure user owns this product
                user: {
                    email: session.user.email
                }
            },
            data: {
                name,
                stock: Number(stock),
                costPrice: Number(cost),
                sellingPrice: Number(price),
                reorderPoint: Number(reorderPoint),
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const product = await prisma.product.deleteMany({
            where: {
                id: productId,
                user: {
                    email: session.user.email
                }
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
