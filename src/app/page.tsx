"use client";

import { useI18n } from "@/context/i18n-context";

export default function Home() {
	const { t } = useI18n();

	return (
		<div className="p-8">
			<h1 className="text-4xl">{t("home.title")}</h1>
			<p className="text-text/60">{t("home.welcome")}</p>
		</div>
	);
}
