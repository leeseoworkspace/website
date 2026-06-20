"use client";
import type { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import type { CardSoldPayload } from "@/types/notifications";
import { useI18n } from "@/context/i18n";

function renderNotifLine(notif: Notification, t: (key: string, params?: Record<string, string | number>) => string) {
	if (notif.type === "card_sold") {
		const p = (
			typeof notif.payload === "string"
				? JSON.parse(notif.payload)
				: notif.payload
		) as CardSoldPayload;

		const buyer = p.buyer_username || t("notifications.someone");
		const cardInfo = `${p.idol_name || ""} (${p.group_name || ""}) ${p.card_short_id || ""}`;
		const total = (p.total || 0).toLocaleString();

		return (
			<div>
				{t("notifications.card_sold", { buyer, cardInfo, total })}
			</div>
		);
	}
	return <span>{notif.type}</span>;
}

export default function NotificationCard({ notif }: { notif: Notification }) {
	const { t, locale } = useI18n();

	const dateLocale = locale === "pt-BR" ? ptBR : enUS;

	return (
		<div className="rounded-2xl flex items-center relative">
			{!notif.read && (
				<div className="absolute bg-secondary rounded-full px-3 right-3 -top-2 z-50">
					<span className="text-sm">{t("notifications.new")}</span>
				</div>
			)}
			<motion.div
				whileHover={{ scale: 1.01 }}
				className={`bg-card shadow-lg flex-1 rounded-xl p-4 mr-3 overflow-hidden ${notif.read ? "" : "border-secondary border-2"}`}
			>
				{renderNotifLine(notif, t)}
				<span className=" text-sm text-text/60">
					{formatDistanceToNow(notif.createdAt, {
						addSuffix: true,
						locale: dateLocale,
					})}
				</span>
			</motion.div>
		</div>
	);
}
