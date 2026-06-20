import { Rarity } from "@/types/cards";

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

const normalizeRarity = (rarity: string): Rarity | null => {
	const base = rarity.trim().split("-")[0] ?? "";
	const match = base.match(/^(?:u)?0*([1-6])$/i);
	if (!match) return null;
	return `u${match[1]}` as Rarity;
};

export const getRarityLabel = (rarity: Rarity, id: string) => {
	const canonical = normalizeRarity(String(rarity)) ?? "u1";
	const count = Number(canonical.replace("u", ""));

	const labels: Record<Rarity, string> = {
		u1: "U1 - Comum",
		u2: "U2 - Incomum",
		u3: "U3 - Raro",
		u4: "U4 - Épico",
		u5: "U5 - Lendário",
		u6: "U6 - Especial",
	};

	const ERA = id.split("-")[1].toUpperCase();

	if (ERA === "VALENTINEDAY") {
		return `<:RED:1509050490112180344> <:RED:1509050490112180344> <:RED:1509050490112180344> <:RED:1509050490112180344> <:RED:1509050490112180344> ${labels.u5}`;
	}

	if (ERA === "FESTAJUNINA") {
		return `<:RED:1509050490112180344> <:UCHIIKAWA:1501297059037184010> <:RED:1509050490112180344> <:UCHIIKAWA:1501297059037184010> <:RED:1509050490112180344> ${labels.u5}`;
	}

	if (rarity === "u6") {
		if (ERA.startsWith("BOOSTER"))
			return `${ERANGE_RARITY.BOOSTER.repeat(count)} ${labels[canonical]}`;

		return `${ERANGE_RARITY[ERA as keyof typeof ERANGE_RARITY].repeat(count)} ${labels[canonical]}`;
	}

	return `${ERANGE_RARITY.STANDARD.repeat(count)} ${labels[canonical]}`;
};

export const ERANGE_RARITY = {
	STANDARD: "<:STANDARD:1496251247081291875>",
	BOOSTER: "<:BOOSTER:1501297094785372190>",
	UCHIIKAWA: "<:UCHIIKAWA:1501297059037184010>",
	MCHIIKAWA: "<:MCHIIKAWA:1501297033749856289>",
	CCHIIKAWA: "<:STANDARD:1496251247081291875>",
	HCHIIKAWA: "<:HCHIIKAWA:1501296997527982130>",
	ARIRANGWORLDTOUR: "<:RED:1509050490112180344>",
	THISISFORWORLDTOUR: "<:BLUE:1509287801860915512>",
	SYNKWORLDTOUR: "<:LIME:1509288621692424364>",
	DOMINATEWORLDTOUR: "<:RED:1509050490112180344>",
	SHOWWHATIAMWORLDTOUR: "<:GRAY:1509628035018522675>",
	BLOODSAGAWORLDTOUR: "<:RED:1509050490112180344>",
	DEADLINEWORLDTOUR: "<:PINK:1510314162251890708>",
	ACTTOMORROWWORLDTOUR: "<:BLUECLARO:1510322627669917957>",
	GRANDCLUBICARUSWORLDTOUR: "<:SAGEGREEN:1511033935763869767>",
	PUREFLOWWORLDTOUR: "<:BLUECLARO:1510322627669917957>",
	FESTAJUNINA: "<:UCHIIKAWA:1501297059037184010>",
	VALENTINESDAY: "<:RED:1509050490112180344>",
};
