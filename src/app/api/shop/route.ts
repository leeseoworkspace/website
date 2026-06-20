import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCardUrl } from "@/lib/cards";
import { monitorMarket } from "@/lib/monitor";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseFloat(searchParams.get("page") || "1");
		const pageSize = 20;

		const idol = searchParams.get("idol") || undefined;
		const group = searchParams.get("group") || undefined;
		const seller = searchParams.get("seller") || undefined;
		const rarity = searchParams.get("rarity") || undefined;

		const minPriceStr = searchParams.get("minPrice");
		const maxPriceStr = searchParams.get("maxPrice");
		const minPrice = minPriceStr
			? parseInt(minPriceStr.replace(/\./g, ""), 10)
			: undefined;
		const maxPrice = maxPriceStr
			? parseInt(maxPriceStr.replace(/\./g, ""), 10)
			: undefined;

		const showMissingOnly = searchParams.get("showMissingOnly") === "true";

		const orderPrice = searchParams.get("orderPrice");
		const orderRarity = searchParams.get("orderRarity");
		const orderDate = searchParams.get("orderDate");

		const session = await getSession();
		const userId = session?.user?.id;

		const where: any = {};

		if (idol) {
			where.idol_name = {
				contains: idol,
				mode: "insensitive",
			};
		}

		if (group) {
			where.group_name = {
				contains: group,
				mode: "insensitive",
			};
		}

		if (seller) {
			where.OR = [
				{
					seller_username: {
						contains: seller,
						mode: "insensitive",
					},
				},
				{
					seller_id: {
						equals: seller,
					},
				},
			];
		}

		if (rarity) {
			where.rarity = {
				equals: rarity,
				mode: "insensitive",
			};
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {};
			if (minPrice !== undefined) {
				where.price.gte = minPrice;
			}
			if (maxPrice !== undefined) {
				where.price.lte = maxPrice;
			}
		}

		if (showMissingOnly && userId) {
			const owned = await prisma.userCard.findMany({
				where: {
					user_id: userId,
					quantity: {
						gt: 0,
					},
				},
				select: {
					card_id: true,
				},
			});
			const ownedCardIds = owned.map((o) => o.card_id);
			if (ownedCardIds.length > 0) {
				where.card_id = {
					notIn: ownedCardIds,
				};
			}
		}

		const orderBy: any[] = [];

		if (orderPrice === "asc" || orderPrice === "desc") {
			orderBy.push({ price: orderPrice });
		}

		if (orderRarity === "asc" || orderRarity === "desc") {
			orderBy.push({ rarity: orderRarity });
		}

		if (orderDate === "asc" || orderDate === "desc") {
			orderBy.push({ listed_at: orderDate });
		}

		if (orderBy.length === 0) {
			orderBy.push({ listed_at: "desc" });
		}

		const listings = await prisma.activeShopListings.findMany({
			where,
			orderBy,
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

export async function POST(request: Request) {
	try {
		const session = await getSession();

		if (!session?.user)
			return NextResponse.json(
				{ ok: false, reason: "unauthorized" },
				{ status: 401 },
			);

		const { listingId, quantity: buyQty } = await request.json();
		const buyerId = session.user.id;
		const buyerUsername = session.user.username;

		const result = await prisma.$transaction(async (tx) => {
			const listing = await tx.shopListing.findUnique({
				where: { id: listingId },
			});

			if (!listing || listing.status !== "active")
				return { ok: false, reason: "not_active" };

			if (listing.seller_id === buyerId)
				return { ok: false, reason: "own_listing" };

			if (listing.quantity < buyQty) {
				return {
					ok: false,
					reason: "not_enough_listing_qty",
					available: listing.quantity,
				};
			}

			const totalCost = listing.price * buyQty;

			const buyer = (await tx.user.findUnique({
				where: { id: buyerId },
				select: { cash: true },
			})) as { cash: number } | null;

			const buyerCash = Number(buyer?.cash ?? 0);

			if (buyerCash < totalCost) {
				return {
					ok: false,
					reason: "not_enough_cash",
					need: totalCost,
					have: buyerCash,
				};
			}

			const sellerUser = await tx.user.findUnique({
				where: { id: listing.seller_id },
				select: { id: true, username: true },
			});

			await tx.user.update({
				where: { id: buyerId },
				data: { cash: { decrement: totalCost } },
			});

			await tx.user.update({
				where: { id: listing.seller_id },
				data: { cash: { increment: totalCost } },
			});

			await tx.userCard.upsert({
				where: {
					user_id_card_id: {
						user_id: buyerId,
						card_id: listing.card_id,
					},
				},
				update: {
					quantity: { increment: buyQty },
					obtained_type: "bought",
				},
				create: {
					user_id: buyerId,
					card_id: listing.card_id,
					quantity: buyQty,
					obtained_type: "bought",
				},
			});

			const remaining = listing.quantity - buyQty;

			if (remaining === 0) {
				await tx.shopListing.update({
					where: { id: listingId },
					data: { status: "sold" },
				});
			} else {
				await tx.shopListing.update({
					where: { id: listingId },
					data: { quantity: remaining },
				});
			}

			const card = await tx.card.findUnique({
				where: { id: listing.card_id },
				include: {
					idol: true,
					group: true,
				},
			});

			await tx.notification.create({
				data: {
					userId: listing.seller_id,
					type: "card_sold",
					payload: JSON.stringify({
						listing_id: listing.id,
						card_short_id: card?.short_id ?? listing.card_id,
						idol_name: card?.idol?.name ?? "Unknown",
						group_name: card?.group?.name ?? "Unknown",
						quantity: buyQty,
						total: totalCost,
						buyer_username: buyerUsername,
					}),
				},
			});

			try {
				const dayKey = (() => {
					const now = new Date();
					const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
					return brt.toISOString().split("T")[0];
				})();

				const shopQuests = [
					"q_shop_buy",
					"q_shop_buyer_compulsive",
					"q_do_shop_buy_pro",
				];
				const questTargets: Record<string, number> = {
					q_shop_buy: 2,
					q_shop_buyer_compulsive: 10,
					q_do_shop_buy_pro: 12,
				};

				for (const qId of shopQuests) {
					const quest = await tx.$queryRawUnsafe<
						{ progress: number; completed: boolean }[]
					>(
						`SELECT progress, completed FROM user_daily_quests WHERE user_id = $1 AND quest_id = $2 AND day_key = $3 LIMIT 1`,
						buyerId,
						qId,
						dayKey,
					);

					if (quest && quest.length > 0 && !quest[0].completed) {
						const target = questTargets[qId];
						const newProgress = Math.min(
							Number(quest[0].progress) + buyQty,
							target,
						);
						const completed = newProgress >= target;

						await tx.$executeRawUnsafe(
							`UPDATE user_daily_quests SET progress = $1, completed = $2 WHERE user_id = $3 AND quest_id = $4 AND day_key = $5`,
							newProgress,
							completed,
							buyerId,
							qId,
							dayKey,
						);
					}
				}
			} catch (e) {
				console.error("Failed to update user daily quests:", e);
			}

			return {
				ok: true,
				listingId: listing.id,
				qtyBought: buyQty,
				totalCost,
				remaining,
				sellerId: listing.seller_id,
				sellerUsername: sellerUser?.username ?? "Unknown",
				cardId: listing.card_id,
				cardShortId: card?.short_id ?? listing.card_id,
				idolName: card?.idol?.name ?? "Unknown",
				groupName: card?.group?.name ?? "Unknown",
				cardRarity: card?.rarity ?? "common",
			};
		});

		if (!result.ok) {
			return NextResponse.json(result);
		}

		const successResult = result as {
			ok: true;
			listingId: number;
			qtyBought: number;
			totalCost: number;
			remaining: number;
			sellerId: string;
			sellerUsername: string;
			cardId: string;
			cardShortId: string;
			idolName: string;
			groupName: string;
			cardRarity: string;
		};

		const monitorToken = process.env.MONITOR_TOKEN;
		if (monitorToken) {
			try {
				await monitorMarket({
					buyer: { id: buyerId, username: buyerUsername },
					seller: { id: successResult.sellerId, username: successResult.sellerUsername },
					item: {
						id: successResult.cardId,
						short_id: successResult.cardShortId,
						name: successResult.idolName,
						rarity: successResult.cardRarity,
						group: successResult.groupName,
					},
					price: successResult.totalCost,
					quantity: successResult.qtyBought,
				});
			} catch (e) {
				console.error("Failed to run market monitoring:", e);
			}
		}

		return NextResponse.json({
			ok: true,
			listingId: successResult.listingId,
			qtyBought: successResult.qtyBought,
			totalCost: successResult.totalCost,
			remaining: successResult.remaining,
		});
	} catch (error) {
		console.error("Purchase Error:", error);

		return NextResponse.json(
			{ ok: false, reason: "internal_error" },
			{ status: 500 },
		);
	}
}
