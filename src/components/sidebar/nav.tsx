"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useState, useLayoutEffect, useEffect, useMemo } from "react";
import Option from "./option";
import { IconBuildingStore, IconCards } from "@tabler/icons-react";
import { useI18n } from "@/context/i18n";

export default function Nav() {
	const pathname = usePathname();
	const { t } = useI18n();

	const routes = useMemo(
		() => [
			{
				href: "/shop",
				title: t("nav.shop"),
				icon: <IconBuildingStore size={20} />,
			},
			{
				href: "/collection",
				title: t("nav.collection"),
				icon: <IconCards size={20} />,
			},
		],
		[t],
	);

	const refs = useRef<(HTMLDivElement | null)[]>([]);
	const [pillStyle, setPillStyle] = useState<{
		top: number;
		left: number;
		height: number;
		width: number;
	} | null>(null);

	// controla se a pill já apareceu pelo menos uma vez
	const hasAppearedRef = useRef(false);

	useLayoutEffect(() => {
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

	// depois que a pill apareceu pela primeira vez, marca como "já apareceu"
	useEffect(() => {
		if (pillStyle) {
			hasAppearedRef.current = true;
		}
	}, [pillStyle]);

	return (
		<div className="relative flex flex-row md:flex-col gap-2 md:gap-1 grow items-center md:items-stretch justify-start md:justify-start text-defaulttext">
			{pillStyle && (
				<motion.div
					className="absolute bg-defaultbackground rounded-2xl z-0 shadow-lg"
					initial={
						hasAppearedRef.current
							? false
							: { opacity: 0, scale: 0.95 }
					}
					animate={{
						top: pillStyle.top,
						left: pillStyle.left,
						height: pillStyle.height,
						width: pillStyle.width,
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