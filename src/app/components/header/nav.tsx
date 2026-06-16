"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useMemo } from "react";
import Option from "./option";
import { IconBuildingStore, IconCards } from "@tabler/icons-react";

export default function Nav() {
    const pathname = usePathname();

    const routes = useMemo(
        () => [
            { href: "/", title: "Loja", icon: <IconBuildingStore size={20} /> },
            {
                href: "/collection",
                title: "Coleção",
                icon: <IconCards size={20} />,
            },
        ],
        [],
    );

    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const [pillStyle, setPillStyle] = useState<{
        top: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        const index = routes.findIndex((r) => r.href === pathname);
        const el = refs.current[index];
        if (el) setPillStyle({ top: el.offsetTop, height: el.offsetHeight });
    }, [pathname, routes]);

    return (
        <div className="relative flex flex-col gap-2 md:gap-1">
            {pillStyle && (
                <motion.div
                    className="absolute left-0 right-0 bg-background rounded-2xl z-0"
                    style={{ transformOrigin: "50% 50%" }}
                    animate={{
                        top: pillStyle.top,
                        height: pillStyle.height,
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: 0.45,
                    }}
                />
            )}
            {routes.map((route, i) => (
                <div
                    key={route.href}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                >
                    <Option
                        href={route.href}
                        title={route.title}
                        icon={route.icon}
                        isActive={pathname === route.href}
                    />
                </div>
            ))}
        </div>
    );
}
