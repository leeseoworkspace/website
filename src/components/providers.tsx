"use client";

import { HeroUIProvider } from "@heroui/system";
import { I18nProvider, type Locale } from "@/context/i18n";
import { type Theme, ThemeProvider } from "@/context/theme";
import type { ReactNode } from "react";

export function Providers({
	children,
	locale,
	theme,
}: {
	children: ReactNode;
	locale: Locale;
	theme: Theme;
}) {
	return (
		<HeroUIProvider>
			<ThemeProvider initialTheme={theme}>
				<I18nProvider initialLocale={locale}>{children}</I18nProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
