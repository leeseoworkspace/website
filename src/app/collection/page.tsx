"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useI18n } from "@/context/i18n";
import { getCardUrl } from "@/lib/cards";
import Image from "next/image";
import { motion } from "framer-motion";

interface UserCard {
    id: number;
    card_id: string;
    quantity: number;
    card: {
        short_id: string;
        rarity: string;
        idol: { name: string };
        group: { name: string };
    };
}

export default function CollectionPage() {
    const { t } = useI18n();
    const [cards, setCards] = useState<UserCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchCollection = useCallback(async (pageNum: number) => {
        try {
            const res = await fetch(`/api/user/collection?page=${pageNum}`);
            const data = await res.json();

            if (data.cards) {
                setCards(prev => pageNum === 1 ? data.cards : [...prev, ...data.cards]);
                setHasMore(data.cards.length === 30);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCollection(1);
    }, [fetchCollection]);

    const lastCardRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => {
                    const next = prev + 1;
                    fetchCollection(next);
                    return next;
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchCollection]);

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8 pb-32">
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold">{t("collection.title")}</h1>
                <p className="text-text/60">{t("collection.description")}</p>
            </div>

            {cards.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50 italic">
                    {t("collection.empty")}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
                    {cards.map((userCard, index) => (
                        <motion.div
                            key={userCard.id}
                            ref={index === cards.length - 1 ? lastCardRef : null}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index % 10) * 0.05 }}
                            className="bg-background border border-border rounded-2xl p-2 flex flex-col gap-2 shadow-sm"
                        >
                            <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-secondary transition-colors">
                                <Image
                                    src={getCardUrl(userCard.card_id)}
                                    alt={userCard.card.idol.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 200px"
                                    className="object-cover"
                                />
                                {userCard.quantity > 1 && (
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full border border-white/20">
                                        x{userCard.quantity}
                                    </div>
                                )}
                            </div>
                            <div className="px-1 py-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium truncate text-sm md:text-base">{userCard.card.idol.name}</span>
                                    <span className="text-[10px] md:text-xs text-text/50">{userCard.card.short_id}</span>
                                </div>
                                <div className="text-[10px] md:text-xs text-text/60 truncate">
                                    {userCard.card.group.name}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-2/3 bg-secondary animate-pulse rounded-2xl" />
                    ))}
                </div>
            )}
        </div>
    );
}
