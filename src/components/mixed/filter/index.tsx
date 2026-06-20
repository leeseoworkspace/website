"use client";

import { useI18n } from "@/context/i18n";
import { IconCheck } from "@tabler/icons-react";
import FilterInput from "./input";
import FilterSelect from "./select";
import type { SubmitEvent } from "react";
import { motion } from "framer-motion";
import Button from "../button";

interface ShopFiltersProps {
	idol: string;
	setIdol: (val: string) => void;
	group: string;
	setGroup: (val: string) => void;
	seller: string;
	setSeller: (val: string) => void;
	rarity: string;
	setRarity: (val: string) => void;
	minPrice: string;
	setMinPrice: (val: string) => void;
	maxPrice: string;
	setMaxPrice: (val: string) => void;
	orderPrice: string;
	setOrderPrice: (val: string) => void;
	orderRarity: string;
	setOrderRarity: (val: string) => void;
	orderDate: string;
	setOrderDate: (val: string) => void;
	showMissingOnly: boolean;
	setShowMissingOnly: (val: boolean) => void;
	onSubmit: (e: SubmitEvent) => void;
	mobile?: boolean;
}

export default function ShopFilters({
	idol,
	setIdol,
	group,
	setGroup,
	seller,
	setSeller,
	rarity,
	setRarity,
	minPrice,
	setMinPrice,
	maxPrice,
	setMaxPrice,
	orderPrice,
	setOrderPrice,
	orderRarity,
	setOrderRarity,
	orderDate,
	setOrderDate,
	showMissingOnly,
	setShowMissingOnly,
	onSubmit,
	mobile,
}: ShopFiltersProps) {
	const { t } = useI18n();

	const rarityOptions = [
		{ value: "u1", label: t("shop.rarities.common") },
		{ value: "u2", label: t("shop.rarities.uncommon") },
		{ value: "u3", label: t("shop.rarities.rare") },
		{ value: "u4", label: t("shop.rarities.super_rare") },
		{ value: "u5", label: t("shop.rarities.epic") },
		{ value: "u6", label: t("shop.rarities.legendary") },
	];

	const priceOrderOptions = [
		{ value: "asc", label: t("shop.orders.price_asc") },
		{ value: "desc", label: t("shop.orders.price_desc") },
	];

	const rarityOrderOptions = [
		{ value: "asc", label: t("shop.orders.rarity_asc") },
		{ value: "desc", label: t("shop.orders.rarity_desc") },
	];

	const dateOrderOptions = [
		{ value: "desc", label: t("shop.orders.date_desc") },
		{ value: "asc", label: t("shop.orders.date_asc") },
	];

	return (
		<form
			autoComplete="off"
			onSubmit={onSubmit}
			className={`rounded-2xl flex flex-col gap-5 text-text bg-card ${mobile ? "px-0 md:px-2" : "shadow-xl p-7"}`}
		>
			<div className="flex flex-col gap-4">
				<h2 className="text-3xl mb-1">
					{t("shop.filters")}
				</h2>
			</div>

			<div className={`flex flex-col gap-6] overflow-x-hidden overflow-y-auto sidebar-scroll ${mobile ? "max-h-[40vh]" : "max-h-[62vh]"}`}>
				<div className="flex flex-col gap-4 mr-2 ml-2">
					<div className="flex gap-4">
						<FilterInput
							label={t("shop.filter_idol")}
							id="filter-idol"
							value={idol}
							onChange={setIdol}
							placeholder="Leeseo"
							className="flex-1"
						/>
						<FilterInput
							label={t("shop.filter_group")}
							id="filter-group"
							value={group}
							onChange={setGroup}
							placeholder="IVE"
							className="flex-1"
						/>
					</div>

					<div className="flex flex-col">
						<FilterInput
							label={t("shop.filter_seller")}
							id="filter-seller"
							value={seller}
							onChange={(e) => setSeller(e)}
							placeholder={t("shop.filter_seller_placeholder")}
							className="flex-1"
						/>
					</div>

					<FilterSelect
						label={t("shop.filter_rarity")}
						value={rarity}
						placeholder={t("shop.filter_rarity_placeholder")}
						options={rarityOptions}
						onChange={setRarity}
					/>

					<div className="flex gap-4">
						<FilterInput
							label={t("shop.filter_min_price")}
							id="filter-min-price"
							value={minPrice}
							onChange={setMinPrice}
							placeholder="200"
							className="flex-1"
						/>
						<FilterInput
							label={t("shop.filter_max_price")}
							id="filter-max-price"
							value={maxPrice}
							onChange={setMaxPrice}
							placeholder="100.000"
							className="flex-1"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 mt-6 ml-2 mr-2 mb-4">
					<h2 className="text-3xl text-text mb-1">
						{t("shop.filter_order")}
					</h2>

					<FilterSelect
						label={t("shop.filter_order_price")}
						value={orderPrice}
						placeholder={t("shop.filter_order_price_placeholder")}
						options={priceOrderOptions}
						onChange={setOrderPrice}
					/>

					<FilterSelect
						label={t("shop.filter_order_rarity")}
						value={orderRarity}
						placeholder={t("shop.filter_order_rarity_placeholder")}
						options={rarityOrderOptions}
						onChange={setOrderRarity}
					/>

					<FilterSelect
						label={t("shop.filter_order_date")}
						value={orderDate}
						placeholder={t("shop.filter_order_date_placeholder")}
						options={dateOrderOptions}
						onChange={setOrderDate}
					/>
				</div>
			</div>

			<motion.button
				type="button"
				onClick={() => setShowMissingOnly(!showMissingOnly)}
				whileTap={{ scale: 0.95 }}
				className="flex items-center gap-3.5 mt-2 cursor-pointer select-none text-left w-full transition-all"
			>
				<div className="w-9 h-9 shrink-0 rounded-xl bg-background border border-border/80 shadow-lg flex items-center justify-center text-text transition-all">
					<IconCheck size={20} className={`stroke-3 transition-all ${showMissingOnly ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
				</div>
				<span className="text-text text-base select-none">
					{t("shop.filter_show_missing")}
				</span>
			</motion.button>

			<Button
				label={t("shop.filter_search")}
				type="submit"
			/>
		</form>
	);
}