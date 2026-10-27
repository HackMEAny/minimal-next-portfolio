"use client";

import { motion } from "framer-motion";
import { Norican } from "next/font/google";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

interface MainNavProps {
  items?: NavItem[];
}

const norican = Norican({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export function MainNav({ items }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Link href="/" className="flex items-center space-x-2">
          <span className={cn(norican.className, "text-2xl text-foreground hover:opacity-85 transition-opacity")}>
            {siteConfig.authorName}
          </span>
        </Link>
      </motion.div>

      {items?.length ? (
        <nav className="hidden gap-6 md:flex items-center">
          {items.map((item, index) => {
            const isActive = item.href.startsWith(`/${segment}`);
            return (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
