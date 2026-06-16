import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/auth-context";
import { Providers } from "@/components/providers";
import Sidebar from "@/components/sidebar";
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
		<html lang="en" className={`h-full antialiased`} suppressHydrationWarning>
			<body className="min-h-full font-lilita text-text bg-background">
				<Providers>
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

