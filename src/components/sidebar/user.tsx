"use client";
import { useAuth } from "@/context/auth-context";
import {
	IconBell,
	IconBrandDiscordFilled,
	IconLogout,
	IconMoon,
	IconSun,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Dropdown, Separator } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";
import { useTheme } from "@/context/theme-context";
import FlagBr from "../mixed/flags/pt-br";
import FlagEn from "../mixed/flags/en";
import { LoadingText } from "../mixed/loading-text";
import { useState } from "react";

export default function User() {
	const { user, loading: authLoading, logout } = useAuth();
	const { t, locale, setLocale } = useI18n();
	const { theme, toggleTheme } = useTheme();
	const [redirecting, setRedirecting] = useState(false);

	const handleLogin = () => {
		setRedirecting(true);
		window.location.href = "/api/discord/auth/login";
	};

	const toggleLocale = () => {
		setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
	};

	if (user) {
		const avatarUrl = user.avatar
			? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
			: `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`;

		return (
			<motion.div
				className="md:mb-8"
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.95 }}
			>
				<Dropdown>
					<Dropdown.Trigger className="w-full">
						<div className="flex items-center gap-3 p-2 px-3 rounded-2xl z-99 md:bg-background md:shadow-xl h-fit cursor-pointer">
							<Image
								src={avatarUrl}
								alt={user.username}
								width={42}
								height={42}
								className="rounded-full"
							/>
							<div className="hidden md:flex flex-col overflow-hidden">
								<span className="truncate">
									{user.global_name || user.username}
								</span>
							</div>
						</div>
					</Dropdown.Trigger>
					<Dropdown.Popover
						className="rounded-2xl p-1"
						placement="top"
					>
						<Dropdown.Menu>
							<Dropdown.Item
								className="transition-colors rounded-xl py-0 p-0"
								key="notifications"
							>
								<Link
									href="/notifications"
									className="flex items-center gap-2 px-2 py-2.5"
								>
									<IconBell size={20} />
									{t("nav.notifications")}
								</Link>
							</Dropdown.Item>
							<Dropdown.Item
								shouldCloseOnSelect={false}
								key="locale"
								className="transition-colors rounded-xl py-2.5"
								onPress={toggleLocale}
							>
								<div className="flex items-center gap-2">
									<span className="w-5 h-5">
										{locale !== "pt-BR" ? (
											<FlagBr />
										) : (
											<FlagEn />
										)}
									</span>
									<span>
										{locale !== "pt-BR"
											? "Português"
											: "English"}
									</span>
								</div>
							</Dropdown.Item>
							<Dropdown.Item
								shouldCloseOnSelect={false}
								key="theme"
								className="transition-colors rounded-xl py-2.5"
								onPress={toggleTheme}
							>
								<div className="flex items-center gap-2">
									{theme === "light" ? (
										<IconMoon size={20} />
									) : (
										<IconSun size={20} />
									)}
									<span>
										{theme === "light"
											? t("nav.theme.dark")
											: t("nav.theme.light")}
									</span>
								</div>
							</Dropdown.Item>
							<Separator className="my-0.5" />
							<Dropdown.Item
								key="logout"
								className="text-danger transition-colors rounded-xl py-2.5"
								onPress={logout}
							>
								<IconLogout size={20} />
								{t("nav.logout")}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</motion.div>
		);
	}

	return (
		<div className="flex flex-col gap-2 md:mb-8">
			<div className="flex gap-2 w-full">
				<motion.button
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.95 }}
					onClick={toggleLocale}
					className="disabled:cursor-default disabled:bg-secondary/80 md:bg-background text-text rounded-2xl h-14.5 px-4 w-full cursor-pointer transition-colors group flex items-center justify-start gap-2 z-60 md:shadow-xl"
				>
					<div className="flex items-center gap-2">
						<span className="w-5 h-5">
							{locale !== "pt-BR" ? <FlagBr /> : <FlagEn />}
						</span>
						<span className="hidden md:inline">
							{locale !== "pt-BR" ? "Português" : "English"}
						</span>
					</div>
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.95 }}
					onClick={toggleTheme}
					className="disabled:cursor-default disabled:bg-secondary/80 md:bg-background text-text rounded-2xl h-14.5 px-4 w-fit cursor-pointer transition-colors group flex items-center justify-center gap-2 z-60 md:shadow-xl"
				>
					{theme === "light" ? (
						<IconMoon size={20} />
					) : (
						<IconSun size={20} />
					)}
				</motion.button>
			</div>
			<motion.button
				whileHover={!redirecting ? { scale: 1.04 } : {}}
				whileTap={!redirecting ? { scale: 0.95 } : {}}
				onClick={handleLogin}
				disabled={redirecting}
				className="disabled:cursor-default disabled:bg-background/50 md:bg-background text-text rounded-2xl h-14.5 px-4 w-full cursor-pointer transition-colors group flex items-center justify-start gap-2 z-60 md:shadow-xl"
			>
				<div className="flex items-center justify-center">
					<IconBrandDiscordFilled />
				</div>
				<span className="hidden md:inline">
					{redirecting ? (
						<LoadingText text={t("nav.redirecting")} />
					) : (
						t("nav.login")
					)}
				</span>
			</motion.button>
		</div>
	);
}
