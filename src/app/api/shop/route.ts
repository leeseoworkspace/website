import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseFloat(searchParams.get("page") || "1");
		const pageSize = 20;

		const listings = await prisma.shopListing.findMany({
			orderBy: {
				listed_at: "desc",
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
		});

		return NextResponse.json(listings);
	} catch (error) {
		console.error("API Error in /api/shop:", error);

		return NextResponse.json(
			{ error: "Failed to fetch listings", details: String(error) },
			{ status: 500 },
		);
	}
}
