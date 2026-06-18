"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ShopSkeleton } from "@/components/shop/skeleton";
import type { ShopListingWithCard } from "@/types/shop";
import { ShopCard } from "@/components/shop/card";

export default function ShopPage() {
    const [listings, setListings] = useState<ShopListingWithCard[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const loadedPages = useRef(new Set<number>());
    const fetchingPages = useRef(new Set<number>());
    const observer = useRef<IntersectionObserver | null>(null);

    const lastListingElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchListings = async (pageNum: number) => {
        if (loadedPages.current.has(pageNum) || fetchingPages.current.has(pageNum)) return;

        fetchingPages.current.add(pageNum);
        setLoading(true);
        try {
            const res = await fetch(`/api/shop?page=${pageNum}`);
            const data = await res.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                loadedPages.current.add(pageNum);
                setListings(prev => {
                    const existingIds = new Set(prev.map(l => l.listing_id));
                    const newItems = data.filter((item: ShopListingWithCard) => !existingIds.has(item.listing_id));
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

    return (
        <div className="xl:p-4">
            <h1 className="text-2xl font-bold mb-4">Shop</h1>
            <div className="grid grid-cols-2 xl:grid-cols-4 md:gap-4 gap-2 grid-auto-rows-fr mr-3">
                {listings.map((listing: ShopListingWithCard, index: number) => (
                    <ShopCard key={`${listing.listing_id}-${index}`} listing={listing} index={index} lastListingElementRef={lastListingElementRef} listings={listings} />
                ))}
                {loading && <ShopSkeleton itemsOnly count={listings.length === 0 ? 12 : 4} />}
            </div>
        </div>
    );
}
