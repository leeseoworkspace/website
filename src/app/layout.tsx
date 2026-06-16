import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/auth-context";
import { Providers } from "@/components/providers";
import Header from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
	title: "Leeseo Bot",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;
	const initialUser = session ? JSON.parse(session) : null;

	return (
		<html lang="en" className={`h-full antialiased`}>
			<body className="min-h-full font-lilita text-text bg-background">
				<Providers>
					<AuthProvider initialUser={initialUser}>
						<Header />
						<main className="md:pl-64 pl-24 pt-4 min-h-screen">
							{children}
						</main>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}

