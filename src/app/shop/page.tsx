"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ShopSkeleton } from "@/components/shop/skeleton";
import type { ShopListingWithCard } from "@/types/shop";
import { ShopCard } from "@/components/shop/card";
import { useI18n } from "@/context/i18n";
import { IconFilter, IconX } from "@tabler/icons-react";
import ShopFilters from "@/components/mixed/filter";
import { Button, Modal } from "@heroui/react";

export default function ShopPage() {
	const { t } = useI18n();
	const [listings, setListings] = useState<ShopListingWithCard[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const loadedPages = useRef(new Set<number>());
	const fetchingPages = useRef(new Set<number>());
	const observer = useRef<IntersectionObserver | null>(null);

	const [idol, setIdol] = useState("");
	const [group, setGroup] = useState("");
	const [seller, setSeller] = useState("");
	const [rarity, setRarity] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [orderPrice, setOrderPrice] = useState("");
	const [orderRarity, setOrderRarity] = useState("");
	const [orderDate, setOrderDate] = useState("");
	const [showMissingOnly, setShowMissingOnly] = useState(false);
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const lastListingElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, hasMore],
	);

	const fetchListings = async (pageNum: number) => {
		if (
			loadedPages.current.has(pageNum) ||
			fetchingPages.current.has(pageNum)
		)
			return;

		fetchingPages.current.add(pageNum);
		setLoading(true);
		try {
			const params = new URLSearchParams();
			params.append("page", String(pageNum));

			if (idol) params.append("idol", idol);
			if (group) params.append("group", group);
			if (rarity) params.append("rarity", rarity);

			if (seller) params.append("seller", seller);

			if (minPrice) params.append("minPrice", minPrice);
			if (maxPrice) params.append("maxPrice", maxPrice);
			if (showMissingOnly) params.append("showMissingOnly", "true");

			if (orderPrice) params.append("orderPrice", orderPrice);
			if (orderRarity) params.append("orderRarity", orderRarity);
			if (orderDate) params.append("orderDate", orderDate);

			const res = await fetch(`/api/shop?${params.toString()}`);
			const data = await res.json();

			if (data.length === 0) {
				setHasMore(false);
			} else {
				loadedPages.current.add(pageNum);
				setListings((prev) => {
					const existingIds = new Set(prev.map((l) => l.listing_id));
					const newItems = data.filter(
						(item: ShopListingWithCard) =>
							!existingIds.has(item.listing_id),
					);
					return [...prev, ...newItems];
				});
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
			fetchingPages.current.delete(pageNum);
		}
	};

	useEffect(() => {
		fetchListings(page);
	}, [page]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setListings([]);
		setHasMore(true);
		loadedPages.current.clear();
		fetchingPages.current.clear();
		if (page === 1) {
			fetchListings(1);
		} else {
			setPage(1);
		}
	};

	return (
		<div className="xl:p-4 lg:pt-0">
			<div className="mdcustomi:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border p-4 flex justify-between items-center h-16 shadow-sm">
				<span className="text-xl font-bold text-text md:ml-55 ml-0">
					{t("shop.title")}
				</span>
				<Modal>
					<Button
						className="hover:scale-105 w-fit transition-transform shadow-lg disabled:cursor-not-allowed bg-defaultsecondary text-defaulttext rounded-lg p-2 px-3 text-sm cursor-pointer"
					>
						<IconFilter size={18} />
						{t("shop.filters")}
					</Button>

					<Modal.Backdrop className="mdcustomi:hidden">
						<Modal.Container className="mt-0">
							<Modal.Dialog className="max-w-150 bg-card">
								{({ close }) => (
									<>
										<Modal.CloseTrigger className="bg-text/5 dark:bg-text/1 size-10 text-text hover:scale-108 transition-transform shadow-lg" />
										<Modal.Body className="py-6 mt-0 pt-0 overflow-y-hidden pb-0 mb-0 overflow-x-hidden">
											<ShopFilters
												mobile
												idol={idol}
												setIdol={setIdol}
												group={group}
												setGroup={setGroup}
												seller={seller}
												setSeller={setSeller}
												rarity={rarity}
												setRarity={setRarity}
												minPrice={minPrice}
												setMinPrice={setMinPrice}
												maxPrice={maxPrice}
												setMaxPrice={setMaxPrice}
												orderPrice={orderPrice}
												setOrderPrice={setOrderPrice}
												orderRarity={orderRarity}
												setOrderRarity={setOrderRarity}
												orderDate={orderDate}
												setOrderDate={setOrderDate}
												showMissingOnly={showMissingOnly}
												setShowMissingOnly={setShowMissingOnly}
												onSubmit={(e) => {
													handleSearch(e);
													setIsMobileFiltersOpen(false);
													close();
												}}
											/>
										</Modal.Body>
									</>
								)}
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			</div>

			<h1 className="text-3xl font-bold mb-6 text-text mdcustom:invisible">
				{t("shop.title")}
			</h1>

			<div className="flex flex-col lg:flex-row gap-6 items-start">
				<div className="flex-1 w-full flex justify-center">
					<div className="grid grid-cols-2 xscustom:flex xscustom:flex-col xscustom:w-full xscustom:grid-cols-1 2xl:grid-cols-4 lgcustom:grid-cols-5 smcustom:grid-cols-2 xlcustom:grid-cols-3 xl:gap-4 gap-2 mr-3 max-w-325">
						{listings.map(
							(listing: ShopListingWithCard, index: number) => (
								<ShopCard
									key={`${listing.listing_id}-${index}`}
									listing={listing}
									index={index}
									lastListingElementRef={
										lastListingElementRef
									}
									listings={listings}
									onPurchaseSuccess={(remaining) => {
										if (remaining < 1) {
											setListings((prev) =>
												prev.filter(
													(l) =>
														l.listing_id !==
														listing.listing_id,
												),
											);
										} else {
											setListings((prev) =>
												prev.map((l) =>
													l.listing_id ===
													listing.listing_id
														? {
																...l,
																quantity: remaining,
															}
														: l,
												),
											);
										}
									}}
								/>
							),
						)}
						{loading && (
							<ShopSkeleton
								itemsOnly
								count={listings.length === 0 ? 12 : 4}
							/>
						)}
						{!loading && listings.length === 0 && (
							<div className="col-span-full text-center py-10 text-text/60">
								{t("shop.empty")}
							</div>
						)}
					</div>
				</div>
				<div className="mdcustom:hidden w-full lg:w-100 shrink-0 select-none sticky top-0 self-start">
					<div className="h-6"></div>
					<ShopFilters
						idol={idol}
						setIdol={setIdol}
						group={group}
						setGroup={setGroup}
						seller={seller}
						setSeller={setSeller}
						rarity={rarity}
						setRarity={setRarity}
						minPrice={minPrice}
						setMinPrice={setMinPrice}
						maxPrice={maxPrice}
						setMaxPrice={setMaxPrice}
						orderPrice={orderPrice}
						setOrderPrice={setOrderPrice}
						orderRarity={orderRarity}
						setOrderRarity={setOrderRarity}
						orderDate={orderDate}
						setOrderDate={setOrderDate}
						showMissingOnly={showMissingOnly}
						setShowMissingOnly={setShowMissingOnly}
						onSubmit={handleSearch}
					/>
				</div>
			</div>

			{isMobileFiltersOpen && (
				<div className="fixed inset-0 z-50 lg:hidden flex justify-center items-center p-4">
					<button
						type="button"
						aria-label="Close filters overlay"
						className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none cursor-pointer"
						onClick={() => setIsMobileFiltersOpen(false)}
					/>
					<div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto z-10 shadow-2xl rounded-[2.5rem]">
						<button
							type="button"
							onClick={() => setIsMobileFiltersOpen(false)}
							className="absolute top-6 right-6 p-2 text-text/50 hover:text-text cursor-pointer hover:bg-defaultsecondary/20 rounded-full transition-colors z-20"
						>
							<IconX size={22} />
						</button>
						<ShopFilters
							idol={idol}
							setIdol={setIdol}
							group={group}
							setGroup={setGroup}
							seller={seller}
							setSeller={setSeller}
							rarity={rarity}
							setRarity={setRarity}
							minPrice={minPrice}
							setMinPrice={setMinPrice}
							maxPrice={maxPrice}
							setMaxPrice={setMaxPrice}
							orderPrice={orderPrice}
							setOrderPrice={setOrderPrice}
							orderRarity={orderRarity}
							setOrderRarity={setOrderRarity}
							orderDate={orderDate}
							setOrderDate={setOrderDate}
							showMissingOnly={showMissingOnly}
							setShowMissingOnly={setShowMissingOnly}
							onSubmit={(e) => {
								handleSearch(e);
								setIsMobileFiltersOpen(false);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
