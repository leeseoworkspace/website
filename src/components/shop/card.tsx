import { getCardUrl } from "@/lib/cards";
import type { ShopListingWithCard } from "@/types/shop";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { defaultHover } from "@/lib/animations";
import { useI18n } from "@/context/i18n-context";
import BuyModal from "./modal";

interface Props {
    listing: ShopListingWithCard;
    index: number;
    lastListingElementRef: (node: HTMLDivElement | null) => void;
    listings: ShopListingWithCard[];
}

export const ShopCard = ({ listing, index, lastListingElementRef, listings }: Props) => {
    const { locale } = useI18n();
    const formatter = new Intl.NumberFormat(locale);

    const content = (
        <div className="p-3 bg-background rounded-2xl shadow-xl border border-border flex flex-col items-center h-full">
            <CardImage src={getCardUrl(listing.card_id)} alt={`Card ${listing.card_id}`} />
            <div className="flex flex-col w-full mt-2 px-1 md:min-h-22 min-h-30">
                <div className="flex items-start w-full md:flex-row flex-col md:items-center">
                    <span className="text-xl grow flex">{listing.idol_name}</span>
                    <span className="text-xs md:text-base">{listing.short_id}</span>
                </div>
                <div className="flex md:items-center items-start flex-col w-full md:flex-row">
                    <span className="grow flex text-text/90">{listing.group_name}</span>
                    <span className="text-text/75 text-sm md:text-base truncate max-w-37.5">{listing.era_name}</span>
                </div>
            </div>
            <div className="flex-col md:flex-row flex w-full md:gap-0 gap-2 items-center h-full text-lg">
                <div className="min-w-[60%]">{formatter.format(listing.price)} Mangos</div>
                <BuyModal listing={listing} locale={locale} />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: (index % 12) * 0.05,
                duration: 0.5,
                type: "spring",
            }}
            {...defaultHover}
            ref={listings.length === index + 1 ? lastListingElementRef : undefined}
        >
            {content}
        </motion.div>
    );
}

function CardImage({ src, alt }: { src: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative md:w-54 md:min-h-84 w-40 min-h-62 overflow-hidden ${isLoading ? "bg-secondary" : ""}`}>
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-secondary rounded-3xl" />
            )}

            <Image
                src={imgSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className={`object-cover duration-300 select-none ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setImgSrc("/placeholder-card.png");
                    setIsLoading(false);
                }}
            />
        </div>
    );
}

