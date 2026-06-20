import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { AuthProvider } from "@/context/auth";
import { Providers } from "@/components/providers";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Leeseo Bot",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const headersList = await headers();

	const sessionToken = cookieStore.get("auth_token")?.value;
	const initialUser = sessionToken
		? (verifyToken(sessionToken) as any)
		: null;

	const acceptLanguage = headersList.get("accept-language") || "";
	const defaultLocale = acceptLanguage.startsWith("pt") ? "pt-BR" : "en-US";

	const locale =
		(cookieStore.get("locale")?.value as "pt-BR" | "en-US") ||
		defaultLocale;
	const theme =
		(cookieStore.get("theme")?.value as "light" | "dark") || "light";

	return (
		<html
			lang={locale === "pt-BR" ? "pt-BR" : "en"}
			className={`h-full antialiased ${theme === "dark" ? "dark" : ""}`}
			suppressHydrationWarning
		>
			<body
				className="min-h-full font-lilita text-text bg-background"
				suppressHydrationWarning
			>
				<Providers locale={locale} theme={theme}>
					<AuthProvider initialUser={initialUser}>
						<Sidebar />
						<main className="md:pl-64 px-4 md:px-0 pt-4 pb-32 md:pb-0 min-h-screen">
							{children}
						</main>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
