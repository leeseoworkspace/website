"use client";

import { useCallback } from "react";
import { useI18n } from "@/context/i18n";
import { motion } from "framer-motion";
import { UserCard } from "@/components/collection/card";
import type { UserCardStructure } from "@/types/cards";
import { useInfiniteList } from "@/hooks/useinfiniteList";

export default function CollectionPage() {
    const { t } = useI18n();

    const fetchPage = useCallback(async (pageNum: number) => {
        const res = await fetch(`/api/user/collection?page=${pageNum}`);
        const data = await res.json();
        return data.cards ?? [];
    }, []);

    const {
        items: cards,
        loading,
        lastElementRef: lastCardRef,
    } = useInfiniteList<UserCardStructure>({
        fetchPage,
        getId: (card) => card.id,
    });

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
                        >
                            <UserCard card={userCard} />
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