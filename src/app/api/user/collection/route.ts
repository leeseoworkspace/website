import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseFloat(searchParams.get("page") || "1");
        const pageSize = 30;

        const userCards = await prisma.userCard.findMany({
            where: {
                user_id: session.user.id,
                quantity: { gt: 0 }
            },
            include: {
                card: {
                    include: {
                        idol: true,
                        group: true,
                        era: true
                    }
                }
            },
            orderBy: {
                obtained_at: "desc"
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        const total = await prisma.userCard.count({
            where: {
                user_id: session.user.id,
                quantity: { gt: 0 }
            }
        });

        return NextResponse.json({
            cards: userCards,
            total,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error("Collection Fetch Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch collection" },
            { status: 500 }
        );
    }
}
