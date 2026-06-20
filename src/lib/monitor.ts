import { Rarity } from "@/types/cards";
import { getCardUrl, getRarityLabel } from "./cards";
import { MONITORING_CHANNEL_IDS } from "./consts";
import { prisma } from "./prisma";
import ptBR from "../locales/pt-BR.json";
import enUS from "../locales/en-US.json";

export type Locale = "pt-BR" | "en-US";

const translations: Record<Locale, any> = {
	"pt-BR": ptBR,
	"en-US": enUS,
};

function translate(locale: Locale, key: string, params?: Record<string, string | number>) {
	const keys = key.split(".");
	let value = translations[locale] || translations["pt-BR"];

	for (const k of keys) {
		if (value && typeof value === "object" && k in value) {
			value = value[k];
		} else {
			let fallbackValue = translations["pt-BR"];
			for (const fallbackK of keys) {
				if (fallbackValue && typeof fallbackValue === "object" && fallbackK in fallbackValue) {
					fallbackValue = fallbackValue[fallbackK];
				} else {
					fallbackValue = null;
					break;
				}
			}
			if (typeof fallbackValue === "string") {
				value = fallbackValue;
				break;
			}
			return key;
		}
	}

	if (typeof value !== "string") return key;

	if (params) {
		Object.entries(params).forEach(([param, paramValue]) => {
			value = (value as string).replace(
				`{{${param}}}`,
				String(paramValue),
			);
		});
	}

	return value;
}

interface MonitorMarketData {
	buyer: { id: string; username: string };
	seller: { id: string; username: string };
	item: {
		id: string;
		short_id: string;
		name: string;
		rarity: string;
		group: string;
	};
	price: number;
	quantity: number;
	guild?: { id: string; name: string };
}

export async function monitorMarket(data: MonitorMarketData) {
	const monitorToken = process.env.MONITOR_TOKEN;
	const channelId = MONITORING_CHANNEL_IDS.market;

	if (!monitorToken) return;

	const img = getCardUrl(data.item.id);

	if (channelId) {
		const fields: { name: string; value: string; inline?: boolean }[] = [
			{
				name: "Comprador",
				value: `${data.buyer.username} (\`${data.buyer.id}\`)`,
				inline: true,
			},
			{
				name: "Vendedor",
				value: `${data.seller.username} (\`${data.seller.id}\`)`,
				inline: true,
			},
			{
				name: "Item",
				value: `**${data.item.name}**\nID: \`${data.item.short_id}\` (\`${data.item.id}\`)\nGrupo: ${data.item.group}\nRaridade: ${getRarityLabel(data.item.rarity as Rarity, data.item.id)}`,
				inline: false,
			},
			{
				name: "Transação",
				value: `${data.quantity}x por **${data.price.toLocaleString("pt-BR")} Mangos**`,
				inline: true,
			},
		];

		if (data.guild) {
			fields.push({
				name: "Servidor",
				value: `${data.guild.name} (\`${data.guild.id}\`)`,
				inline: true,
			});
		}

		try {
			const res = await fetch(
				`https://discord.com/api/v10/channels/${channelId}/messages`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${monitorToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						embeds: [
							{
								title: "Monitoramento: Compra no Mercado",
								color: 0xffcc00,
								fields,
								...(img ? { thumbnail: { url: img } } : {}),
								timestamp: new Date().toISOString(),
							},
						],
					}),
				},
			);

			if (!res.ok) {
				console.error(
					"[Monitor Market] Erro ao enviar log:",
					res.status,
					await res.text(),
				);
			}
		} catch (error) {
			console.error("[Monitor Market] Erro ao enviar log:", error);
		}
	}

	try {
		const sellerUser = await prisma.user.findUnique({
			where: { id: data.seller.id },
			select: { locale: true },
		});

		const userLocale: Locale = (sellerUser?.locale === "en-US" || sellerUser?.locale === "pt-BR")
			? sellerUser.locale
			: "pt-BR";

		const formattedPrice = data.price.toLocaleString(userLocale);

		const title = translate(userLocale, "shop.soldTitle");
		const description = translate(userLocale, "shop.soldDescription", {
			cardShortId: data.item.short_id,
			idolName: data.item.name,
			groupName: data.item.group,
			buyer: data.buyer.username,
			buyerId: data.buyer.id,
			quantity: data.quantity,
			total: formattedPrice,
		});

		const createDmRes = await fetch(
			"https://discord.com/api/v10/users/@me/channels",
			{
				method: "POST",
				headers: {
					Authorization: `Bot ${monitorToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipient_id: data.seller.id,
				}),
			},
		);

		if (createDmRes.ok) {
			const dmChannel = await createDmRes.json();
			if (dmChannel?.id) {
				const dmSendRes = await fetch(
					`https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
					{
						method: "POST",
						headers: {
							Authorization: `Bot ${monitorToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							embeds: [
								{
									title,
									description,
									color: 16761795,
									image: img ? { url: img } : undefined,
									timestamp: new Date().toISOString(),
								},
							],
						}),
					},
				);

				if (!dmSendRes.ok) {
					console.error(
						`[Monitor Market] Erro ao enviar DM para o vendedor ${data.seller.id}:`,
						dmSendRes.status,
						await dmSendRes.text(),
					);
				}
			}
		}
	} catch (error) {
		console.error("[Monitor Market] Erro ao enviar DM para o vendedor:", error);
	}
}