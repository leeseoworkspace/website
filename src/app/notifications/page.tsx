"use client";

import NotificationList from "@/components/notifications/list";
import { useI18n } from "@/context/i18n-context";
import { useState } from "react";

export default function NotificationsPage() {
	const { t } = useI18n();
	const [totalCount, setTotalCount] = useState<number>(0);

	return (
		<div className="flex flex-col gap-2 p-2 pb-32">
			<h1 className="text-4xl">{t("notifications.title")}</h1>
			<p className="text-text/70 mb-2">
				{t("notifications.description", { count: totalCount })}
			</p>
			<NotificationList onTotalCount={setTotalCount} />
		</div>
	);
}
