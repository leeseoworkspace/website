"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ptBR from "../locales/pt-BR.json";
import enUS from "../locales/en-US.json";

export type Locale = "pt-BR" | "en-US";

interface I18nContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, any> = {
	"pt-BR": ptBR,
	"en-US": enUS,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
	children,
	initialLocale,
}: {
	children: React.ReactNode;
	initialLocale: Locale;
}) {
	const [locale, setLocaleState] = useState<Locale>(initialLocale);

	React.useEffect(() => {
		if (!document.cookie.includes("locale=")) {
			document.cookie = `locale=${initialLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
		}
	}, [initialLocale]);

	const setLocale = useCallback(
		(newLocale: Locale) => {
			if (newLocale === locale) return;

			setLocaleState(newLocale);
			document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
		},
		[locale],
	);

	const t = useCallback(
		(key: string, params?: Record<string, string | number>) => {
			const keys = key.split(".");
			let value = translations[locale];

			for (const k of keys) {
				if (value && typeof value === "object" && k in value) {
					value = value[k];
				} else {
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
		},
		[locale],
	);

	return (
		<I18nContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (context === undefined) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}
