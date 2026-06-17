"use client";

import { useState, useEffect } from "react";

export function LoadingText({ text }: { text: string }) {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<span className="inline-flex min-w-[1.5em]">
			{text}
			{dots}
		</span>
	);
}
