import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

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

		if (process.env.LOGIN_WEBHOOK) {
			const avatarUrl = userData.avatar
				? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
				: `https://cdn.discordapp.com/embed/avatars/${Number(userData.id) % 5}.png`;

			fetch(process.env.LOGIN_WEBHOOK, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					embeds: [
						{
							title: "Login de Usuário",
							fields: [
								{
									name: "Username",
									value: userData.username,
									inline: true,
								},
								{
									name: "ID",
									value: userData.id,
									inline: true,
								},
								{
									name: "Global Name",
									value: userData.global_name || "N/A",
									inline: true,
								},
							],
							thumbnail: {
								url: avatarUrl,
							},
							color: 0x00ff00,
						},
					],
				}),
			}).catch((err) => console.error("Webhook Error:", err));
		}

		await prisma.user.upsert({
			where: { id: userData.id },
			update: {
				username: userData.username,
			},
			create: {
				id: userData.id,
				username: userData.username,
			},
		});

		const cookieStore = await cookies();

		const sessionToken = signToken({
			id: userData.id,
			username: userData.username,
			global_name: userData.global_name,
			avatar: userData.avatar,
		});

		cookieStore.set("auth_token", sessionToken, {
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});

		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Discord Auth Error:", error);
		return NextResponse.redirect(new URL("/", request.url));
	}
}
