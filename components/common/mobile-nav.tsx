"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { createPortal } from "react-dom";

import { useLockBody } from "@/hooks/use-lock-body";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

interface MobileNavProps {
  items: NavItem[];
  onClose: () => void;
  children?: React.ReactNode;
}

export function MobileNav({ items, onClose, children }: MobileNavProps) {
  useLockBody();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Full-screen backdrop overlay */}
      <div
        className="fixed inset-0 top-20 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer menu sheet */}
      <div
        className="fixed inset-x-0 top-20 z-50 border-b border-border bg-background p-6 shadow-2xl animate-in slide-in-from-top-2 fade-in-0 duration-200 md:hidden"
      >
        <nav className="grid gap-1.5" aria-label="Mobile Navigation">
          {items.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3 text-base font-medium transition-colors duration-150 ease-out",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <span>{item.title}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
        {children ? (
          <div className="mt-4 pt-4 border-t border-border">{children}</div>
        ) : null}
      </div>
    </>,
    document.body
  );
}
