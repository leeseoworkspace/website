"use client";

import { HeroUIProvider } from "@heroui/system";
import { I18nProvider } from "@/context/i18n-context";
import { ThemeProvider } from "@/context/theme-context";
import type { ReactNode } from "react";

export function Providers({
	children,
	locale,
	theme,
}: {
	children: ReactNode;
	locale: any;
	theme: any;
}) {
	return (
		<HeroUIProvider>
			<ThemeProvider initialTheme={theme}>
				<I18nProvider initialLocale={locale}>{children}</I18nProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
