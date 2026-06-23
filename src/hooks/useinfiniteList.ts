"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseInfiniteListOptions<T> {
	fetchPage: (pageNum: number) => Promise<T[]>;
	getId: (item: T) => string | number;
	pageSize?: number;
}

export function useInfiniteList<T>({
	fetchPage,
	getId,
	pageSize,
}: UseInfiniteListOptions<T>) {
	const [items, setItems] = useState<T[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);

	const loadedPages = useRef(new Set<number>());
	const fetchingPages = useRef(new Set<number>());
	const observer = useRef<IntersectionObserver | null>(null);

	const load = useCallback(
		async (pageNum: number) => {
			if (
				loadedPages.current.has(pageNum) ||
				fetchingPages.current.has(pageNum)
			)
				return;

			fetchingPages.current.add(pageNum);

			setLoading(true);
			try {
				const data = await fetchPage(pageNum);

				if (data.length === 0) {
					setHasMore(false);
				} else {
					loadedPages.current.add(pageNum);

					setItems((prev) => {
						const existingIds = new Set(prev.map(getId));
						const newItems = data.filter(
							(item) => !existingIds.has(getId(item)),
						);
						return [...prev, ...newItems];
					});

					if (pageSize !== undefined && data.length < pageSize) {
						setHasMore(false);
					}
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
				fetchingPages.current.delete(pageNum);
			}
		},
		[fetchPage, getId, pageSize],
	);

	useEffect(() => {
		load(page);
	}, [page, load]);

	const lastElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prev) => prev + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, hasMore],
	);

	const reset = useCallback(() => {
		setItems([]);
		setHasMore(true);

		loadedPages.current.clear();
		fetchingPages.current.clear();

		if (page === 1) {
			load(1);
		} else {
			setPage(1);
		}
	}, [page, load]);

	return { items, setItems, loading, hasMore, page, lastElementRef, reset };
}
