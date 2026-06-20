import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_TOKEN!;

export interface Session {
	user: {
		id: string;
		username: string;
		avatar: string | null;
	};
}

export function signToken(payload: object) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch {
		return null;
	}
}

export async function getSession(): Promise<Session | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;

	if (!token) return null;

	const verified = verifyToken(token) as Session["user"] | null;

	if (!verified) return null;

	return {
		user: {
			id: verified.id,
			username: verified.username,
			avatar: verified.avatar || null,
		},
	};
}
