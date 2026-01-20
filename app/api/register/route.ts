import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../database/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password, businessName } = body;

        if (!email || !name || !password || !businessName) {
            return new NextResponse("Missing Info", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                businessName,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.log(error, "REGISTRATION_ERROR");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
