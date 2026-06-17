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
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => void;
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

	useEffect(() => {
		if (initialUser) {
			setUser(initialUser);
		}
		setLoading(false);
	}, [initialUser]);

	const logout = () => {
		setUser(null);

		window.location.href = "/api/discord/auth/logout";
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
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
