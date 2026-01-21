import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../database/client";

export async function GET(req: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    // 2. Fetch Notifications from DB
    // Generation now happens in api/sales via 'smart-alerts.ts' service

    const dbNotifications = await prisma.notification.findMany({
        where: {
            userId: user.id,
            status: "active"
        },
        orderBy: {
            priority: 'asc' // Adjusted via sort below
        }
    });

    // Custom sort: urgent (0), high (1), medium (2)
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2 };
    dbNotifications.sort((a, b) => 
      (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2) - 
      (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2)
    );

    // Map to frontend format
    const response = dbNotifications.map(n => ({
        id: n.id,
        title: n.title,
        description: n.description,
        priority: n.priority,
        action: n.action,
        type: n.type,
        status: n.status,
        createdAt: n.createdAt
    }));

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Smart Notification Fetch Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
