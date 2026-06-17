"use client";

import { useState, useEffect } from "react";
import NotificationCard from "@/components/notifications/card";
import { NotificationSkeleton } from "@/components/notifications/skeleton";
import type { Notification } from "@/types/notifications";
import Button from "../mixed/button";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useI18n } from "@/context/i18n-context";
import { motion } from "framer-motion";

export default function NotificationList({
	onTotalCount,
}: {
	onTotalCount?: (count: number) => void;
}) {
	const { t } = useI18n();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = async (p: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/notifications?page=${p}`);

			if (res.status === 429) {
				setError(t("notifications.rate_limit"));
				return;
			}

			if (!res.ok) throw new Error("Failed to fetch");

			const data = await res.json();
			setNotifications(data.notifications);
			setTotalPages(data.totalPages);
			if (onTotalCount) onTotalCount(data.totalCount || 0);
		} catch (error) {
			console.error(error);
			setError("Failed to fetch");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications(page);
	}, [page]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 min-h-100">
				{loading ? (
					<NotificationSkeleton />
				) : error ? (
					<p className="text-danger text-center py-10 italic">
						{error}
					</p>
				) : notifications.length === 0 ? (
					<p className="text-text/60 text-center py-10 italic">
						{t("notifications.empty")}
					</p>
				) : (
					notifications.map((notif, index) => (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: 0.1 + index * 0.1,
								duration: 0.5,
								type: "spring",
							}}
							key={notif.id}
						>
							<NotificationCard notif={notif} />
						</motion.div>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="fixed bottom-24 md:bottom-4 left-0 right-3 md:left-64 flex justify-center items-center gap-4 bg-background/20 rounded-xl backdrop-blur-lg p-4 z-20">
					<div>
						<Button
							label={t("buttons.previous")}
							type="button"
							onClick={() => setPage((p) => Math.max(p - 1, 1))}
							disabled={page <= 1}
							icon={<IconArrowLeft />}
						/>
					</div>

					<span className="md:text-lg">
						{t("notifications.page_info", {
							page,
							total: totalPages,
						})}
					</span>

					<div>
						<Button
							label={t("buttons.next")}
							type="button"
							iconDirection="right"
							onClick={() =>
								setPage((p) => Math.min(p + 1, totalPages))
							}
							disabled={page >= totalPages}
							icon={<IconArrowRight />}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
