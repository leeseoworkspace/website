"use client";

export function ShopSkeleton({ count = 12, itemsOnly = false }: { count?: number, itemsOnly?: boolean }) {
	const items = [...Array(count)].map((_, i) => (
		<div key={i} className="p-3 bg-background rounded-2xl shadow-xl border border-border flex flex-col items-center">
			<div className="md:w-55 md:min-h-84 w-40 min-h-62 bg-secondary rounded-3xl animate-pulse">
			</div>
			<div className="flex flex-col w-full mt-2 px-1 md:min-h-20 min-h-30">
				<div className="flex flex-col md:items-center w-full md:flex-row items-start gap-1">
					<div className="grow">
						<div className="md:w-20 w-16 h-5 bg-secondary rounded-full animate-pulse"></div>
					</div>
					<div className="w-19 h-4 bg-secondary rounded-full animate-pulse"></div>
				</div>
				<div className="flex md:items-center items-start flex-col w-full md:flex-row mt-1 gap-1 md:gap-0">
					<div className="md:grow">
						<div className="w-14 h-4 bg-secondary rounded-full animate-pulse"></div>
					</div>
					<div className="w-23 h-4 bg-secondary rounded-full animate-pulse"></div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row x w-full items-center h-full">
				<div className="md:min-w-[50%] min-w-[80%] bg-secondary rounded-full animate-pulse h-5"></div>
				<div className="flex w-full md:justify-end justify-center mt-3 md:mt-0">
					<div className="md:min-w-[80%] min-w-full bg-secondary rounded-xl animate-pulse h-11"></div>
				</div>
			</div>
		</div>
	));

	if (itemsOnly) return <>{items}</>;

	return (
		<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
			{items}
		</div>
	);
}
