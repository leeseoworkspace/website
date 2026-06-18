import type { ShopListing } from "@prisma/client";

export type ShopListingWithCard = ShopListing & {
	listing_id: number;
	price: number;
	listed_at: Date;
	seller_id: string;
	seller_username: string;
	card_id: string;
	short_id: string;
	group_name: string;
	idol_name: string;
	era_name: string;
	rarity: string;
};
