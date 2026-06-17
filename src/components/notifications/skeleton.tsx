"use client";

const PRESET_WIDTHS = [
	"40%",
	"36%",
	"45%",
	"46%",
	"43%",
	"38%",
	"44%",
	"35%",
	"40%",
	"52%",
];

export function NotificationSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			{[...Array(10)].map((_, i) => (
				<div
					key={i}
					className="p-4 rounded-xl shadow-lg bg-card h-26 md:h-20.5 flex flex-col gap-2 justify-center"
				>
					<div className="flex gap-2 flex-col">
						<div
							className="h-4 bg-secondary rounded-full animate-pulse hidden md:inline"
							style={{
								width: PRESET_WIDTHS[i % PRESET_WIDTHS.length],
							}}
						/>
						<div
							className="h-4 bg-secondary rounded-full animate-pulse md:hidden"
							style={{
								width: "100%",
							}}
						/>
						<div
							className="h-4 bg-secondary rounded-full animate-pulse md:hidden"
							style={{
								width: PRESET_WIDTHS[i % PRESET_WIDTHS.length],
							}}
						/>
						<div className="h-2 bg-secondary w-20 rounded-full animate-pulse" />
					</div>
				</div>
			))}
		</div>
	);
}
