import { getCardUrl } from "@/lib/cards";
import Image from "next/image";
import { useState } from "react";
import type { UserCardStructure } from "@/types/cards";

interface Props {
    card: UserCardStructure;
}

export const UserCard = ({ card }: Props) => {
    return (
        <div className="p-3 bg-card xscustom:w-full rounded-2xl shadow-xl border border-border flex flex-col items-center h-full hover:scale-103 transition-transform">
            <CardImage src={getCardUrl(card.card_id)} alt={`Card ${card.card_id}`} />
            <div className="flex flex-col w-full mt-2 px-1 md:min-h-22 min-h-30">
                <div className="flex items-start w-full md:flex-row flex-col md:items-center">
                    <span className="text-xl grow flex">{card.card.idol.name}</span>
                    <span className="text-xs md:text-base">{card.card.short_id}</span>
                </div>
                <div className="flex md:items-center items-start flex-col w-full md:flex-row">
                    <span className="grow flex text-text/90">{card.card.group.name}</span>
                    <span className="text-text/75 text-sm md:text-xs truncate max-w-37.5">{card.card.era.name}</span>
                </div>
            </div>
        </div>
    );
};

export function CardImage({ src, alt, modal }: { src: string; alt: string; modal?: boolean }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative ${modal ? "w-28 h-44 md:w-45 md:h-70" : "md:w-54 md:min-h-84 w-40 min-h-62"} overflow-hidden rounded-2xl ${(isLoading || hasError) ? "bg-secondary" : ""}`}>
            {isLoading && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-secondary" />
            )}

            {!hasError && (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 192px"
                    className={`object-cover duration-300 select-none ${isLoading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
}