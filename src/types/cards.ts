export type Rarity = "u1" | "u2" | "u3" | "u4" | "u5" | "u6";

export interface UserCardStructure {
	id: number;
	card_id: string;
	quantity: number;
	card: {
		short_id: string;
		rarity: string;
		idol: { name: string };
		group: { name: string };
		era: {
			name: string;
			droppable: boolean
		};
	};
}
