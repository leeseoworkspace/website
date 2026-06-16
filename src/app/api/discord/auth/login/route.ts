import { NextResponse } from "next/server";

export async function GET() {
	const clientId = process.env.DISCORD_CLIENT_ID;
	const redirectUri = process.env.DISCORD_REDIRECT_URI;

	if (!clientId || !redirectUri) {
		return NextResponse.json(
			{ error: "Discord configuration is missing." },
			{ status: 500 },
		);
	}

	const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
		redirectUri,
	)}&scope=identify`;

	return NextResponse.redirect(url);
}
