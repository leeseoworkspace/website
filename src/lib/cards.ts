export const getCardUrl = (input: string | any) => {
	if (!input) return "";

	let path = "";
	
	if (typeof input === "string") {
		path = input.replaceAll("-", "/").toLowerCase();
	} else if (typeof input === "object") {
		const { group_id, era_id, idol_id, rarity, id, card_id, short_id } =
			input;
		const actualId = id || card_id;

		if (actualId) {
			path = actualId.replaceAll("-", "/").toLowerCase();
		} else if (group_id && era_id && idol_id && rarity) {
			const baseRarity = String(rarity).split("-")[0].toLowerCase();
			const sequence = (short_id || "").split("-").pop() || "01";

			const g = String(group_id).replace(/\s+/g, "").toLowerCase();
			const e = String(era_id).replace(/\s+/g, "").toLowerCase();
			const i = String(idol_id).replace(/\s+/g, "").toLowerCase();

			path = `${g}/${e}/${i}/${baseRarity}/${sequence}`;
		}
	}

	if (!path) return "";

	const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

	if (!publicUrl?.startsWith("http")) return "";

	return `${publicUrl}/cards/${encodeURI(path)}.webp`;
};
