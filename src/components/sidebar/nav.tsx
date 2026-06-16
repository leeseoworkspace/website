"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useMemo } from "react";
import Option from "./option";
import { IconBuildingStore, IconCards } from "@tabler/icons-react";

export default function Nav() {
	const pathname = usePathname();

	const routes = useMemo(
		() => [
			{ href: "/", title: "Loja", icon: <IconBuildingStore size={20} /> },
			{
				href: "/collection",
				title: "Coleção",
				icon: <IconCards size={20} />,
			},
		],
		[],
	);

	const refs = useRef<(HTMLDivElement | null)[]>([]);
	const [pillStyle, setPillStyle] = useState<{
		top: number;
		left: number;
		height: number;
		width: number;
	} | null>(null);

	useEffect(() => {
		const updatePill = () => {
			const index = routes.findIndex((r) => r.href === pathname);
			const el = refs.current[index];
			if (el) {
				setPillStyle({
					top: el.offsetTop,
					left: el.offsetLeft,
					height: el.offsetHeight,
					width: el.offsetWidth,
				});
			}
		};

		updatePill();
		window.addEventListener("resize", updatePill);
		return () => window.removeEventListener("resize", updatePill);
	}, [pathname, routes]);

	return (
		<div className="relative flex flex-row md:flex-col gap-2 md:gap-1 grow items-center md:items-stretch justify-start md:justify-start">
			{pillStyle && (
				<motion.div
					layoutId="nav-pill"
					className="absolute bg-background rounded-2xl z-0"
					style={{ 
						top: pillStyle.top,
						left: pillStyle.left,
						height: pillStyle.height,
						width: pillStyle.width,
					}}
					initial={{
						opacity: 0,
						scale: 0.95,
					}}
					animate={{
						opacity: 1,
						scale: 1,
					}}
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 30,
					}}
				/>
			)}
			{routes.map((route, i) => (
				<motion.div
					key={route.href}
					className="z-10"
					ref={(el) => {
						refs.current[i] = el;
					}}
					whileHover={{ scale: route.href === pathname ? 1 : 1.04 }}
					whileTap={{ scale: route.href === pathname ? 1 : 0.95 }}
				>
					<Option
						href={route.href}
						title={route.title}
						icon={route.icon}
						isActive={pathname === route.href}
					/>
				</motion.div>
			))}
		</div>
	);
}
