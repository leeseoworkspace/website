"use client";

import { useI18n } from "@/context/i18n-context";

export default function CollectionPage() {
	const { t } = useI18n();

	return (
		<div className="flex flex-col gap-4 p-8">
			<h1 className="text-4xl">{t("collection.title")}</h1>
			<p className="text-text/60">{t("collection.description")}</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div key={i} className="h-40 bg-secondary rounded-3xl" />
				))}
			</div>
		</div>
	);
}
