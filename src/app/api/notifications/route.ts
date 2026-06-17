import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const PAGE_SIZE = 10;
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 60 * 1000;

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function cleanupRateLimit() {
	const now = Date.now();
	for (const [identifier, data] of rateLimitMap.entries()) {
		if (now - data.lastReset > RATE_LIMIT_WINDOW) {
			rateLimitMap.delete(identifier);
		}
	}
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const page = Number(searchParams.get("page")) || 1;

	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;

	let identifier: string;
	let session: any = null;

	if (sessionCookie) {
		session = verifyToken(sessionCookie);
		identifier = session
			? session.id
			: request.headers.get("x-forwarded-for") || "anonymous";
	} else {
		identifier = request.headers.get("x-forwarded-for") || "anonymous";
	}

	cleanupRateLimit();

	const now = Date.now();
	const userLimit = rateLimitMap.get(identifier) || {
		count: 0,
		lastReset: now,
	};

	if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
		userLimit.count = 0;
		userLimit.lastReset = now;
	}

	if (userLimit.count >= RATE_LIMIT) {
		return NextResponse.json(
			{ error: "Too many requests" },
			{ status: 429 },
		);
	}

	userLimit.count++;
	rateLimitMap.set(identifier, userLimit);

	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const userId = session.id;

	try {
		const [notifications, total] = await Promise.all([
			prisma.notification.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
			}),

			prisma.notification.count({ where: { userId } }),
		]);

		const totalPages = Math.ceil(total / PAGE_SIZE);

		return NextResponse.json({
			notifications,
			totalPages,
			totalCount: total,
		});
	} catch (error) {
		console.error("Notifications Fetch Error:", error);

		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 },
		);
	}
}
