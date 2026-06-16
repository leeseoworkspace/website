import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	try {
		const tokenResponse = await fetch(
			"https://discord.com/api/oauth2/token",
			{
				method: "POST",
				body: new URLSearchParams({
					client_id: process.env.DISCORD_CLIENT_ID!,
					client_secret: process.env.DISCORD_CLIENT_SECRET!,
					grant_type: "authorization_code",
					code,
					redirect_uri: process.env.DISCORD_REDIRECT_URI!,
				}),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			console.error("Discord Token Error:", tokenData);

			return NextResponse.redirect(new URL("/", request.url));
		}

		const userResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		});

		const userData = await userResponse.json();

		const cookieStore = await cookies();

		cookieStore.set(
			"session",
			JSON.stringify({
				id: userData.id,
				username: userData.username,
				global_name: userData.global_name,
				avatar: userData.avatar,
			}),
			{
				maxAge: 60 * 60 * 24 * 7,
				path: "/",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
			},
		);

		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Discord Auth Error:", error);
		return NextResponse.redirect(new URL("/", request.url));
	}
}
