"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";

interface OptionProps {
	title: string;
	icon: ReactNode;
	href: string;
	link?: boolean;
	isActive?: boolean;
}

export default function Option({
	title,
	icon,
	link,
	href,
}: Readonly<OptionProps>) {
	if (link)
		return (
			<a
				target="_blank"
				rel="noreferrer"
				href={href}
				className="relative flex gap-2 cursor-pointer transition rounded-xl p-2 px-3 group md:w-39"
			>
				<div className="flex gap-2 items-center">
					{icon}
					<div className="relative hidden md:inline">
						{title}
						<span className="absolute bottom-0 left-0 w-0 h-px bg-background transition-all duration-300 group-hover:w-full" />
					</div>
				</div>
				<IconArrowUpRight
					className="mt-1 group-hover:mt-0 group-hover:ml-1 transition-all hidden md:inline"
					size={15}
				/>
			</a>
		);

	return (
		<Link
			href={href}
			className={`relative flex gap-2 cursor-pointer transition rounded-xl p-2.5 px-3 z-10 text-lg`}
		>
			<motion.div
				className="flex flex-row gap-2 items-center"
				transition={{ type: "spring", stiffness: 500, damping: 30 }}
			>
				<div className="[&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-5 md:[&>svg]:h-5">
					{icon}
				</div>
				<span className="md:text-lg">
					{title}
				</span>
			</motion.div>
		</Link>
	);
}
