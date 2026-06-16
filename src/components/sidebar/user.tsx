"use client";
import { useAuth } from "@/context/auth-context";
import { IconBell, IconBrandDiscordFilled, IconLogout } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Dropdown, Separator } from "@heroui/react";
import Image from "next/image";

export default function User() {
	const { user, loading, logout } = useAuth();

	const handleLogin = () => {
		window.location.href = "/api/discord/auth/login";
	};

	if (loading) {
		return (
			<div className="flex items-center gap-3 m md:p-2 md:px-3 rounded-2xl z-99 md:bg-background md:shadow-xl h-14.5 md:mb-8 md:animation-pulse">
				<div
					className="rounded-full border h-10 min-w-10 animate-pulse md:bg-secondary bg-background animation-pulse"
				/>
				<div className="w-[50%] h-4 rounded-full bg-secondary animate-pulse"></div>
			</div>
		);
	}

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
								className="rounded-full border border-white/10"
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
								className="transition-colors rounded-xl py-2.5"
								key="notifications"
							>
								<IconBell size={20} />
								Notificações
							</Dropdown.Item>
							<Separator className="my-0.5" />
							<Dropdown.Item
								key="logout"
								className="text-danger transition-colors rounded-xl py-2.5"
								onPress={logout}
							>
								<IconLogout size={20} />
								Sair
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</motion.div>
		);
	}

	return (
		<div className="flex md:mb-8">
			<motion.button
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleLogin}
				className="disabled:cursor-default disabled:bg-secondary/80 md:bg-background text-text rounded-2xl h-14.5 px-4 w-full cursor-pointer transition-colors group flex items-center justify-center gap-2 z-60 md:shadow-xl"
			>
				<div className="[&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-5 md:[&>svg]:h-5 flex items-center justify-center">
					<IconBrandDiscordFilled />
				</div>
				<span className="hidden md:inline">Fazer Login</span>
			</motion.button>
		</div>
	);
}
