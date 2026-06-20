import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
	label: ReactNode;
	type: "button" | "submit";
	icon?: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	iconDirection?: "left" | "right";
	hideLabel?: boolean;
}

export default function Button({
	label,
	type,
	icon,
	onClick,
	disabled,
	iconDirection,
	hideLabel,
}: Props) {
	return (
		<motion.button
			whileHover={{ scale: disabled ? 1 : 1.04 }}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
			onClick={onClick}
			type={type}
			disabled={disabled}
			className="disabled:bg-secondary/50 disabled:text-text/50 shadow-xl disabled:cursor-not-allowed bg-secondary text-defaulttext rounded-2xl p-3 px-4 w-full cursor-pointer transition-colors group flex items-center justify-center gap-2 z-60"
		>
			{((icon && iconDirection === "left") ||
				(icon && !iconDirection)) && <div>{icon}</div>}
			{!hideLabel && <span>{label}</span>}
			{icon && iconDirection === "right" && <div>{icon}</div>}
		</motion.button>
	);
}
