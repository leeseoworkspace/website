"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

interface User {
	id: string;
	username: string;
	global_name?: string;
	avatar?: string;
	cash: number;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
	children,
	initialUser,
}: {
	children: ReactNode;
	initialUser: User | null;
}) {
	const [user, setUser] = useState<User | null>(initialUser);
	const [loading, setLoading] = useState(true);

	const refreshUser = async () => {
		try {
			const res = await fetch("/api/user");
			if (res.ok) {
				const data = await res.json();
				setUser((prev) => (prev ? { ...prev, ...data } : data));
			}
		} catch (error) {
			console.error("Failed to refresh user:", error);
		}
	};

	useEffect(() => {
		if (initialUser) {
			setUser(initialUser);
			refreshUser();
		}
		setLoading(false);
	}, [initialUser]);

	const logout = () => {
		setUser(null);

		window.location.href = "/api/discord/auth/logout";
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
