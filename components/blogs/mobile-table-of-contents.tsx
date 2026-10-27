"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Icons } from "@/components/common/icons";
import { useLockBody } from "@/hooks/use-lock-body";
import { TocItem } from "@/lib/blogs";
import { cn } from "@/lib/utils";

interface MobileTableOfContentsProps {
  toc: TocItem[];
}

export function MobileTableOfContents({ toc }: MobileTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let currentId = "";
      for (const el of headingElements) {
        if (el.offsetTop <= scrollPos) {
          currentId = el.id;
        } else {
          break;
        }
      }
      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc, activeId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!toc || toc.length === 0) return null;

  const activeIndex = toc.findIndex((item) => item.id === activeId);
  const activeItem = activeIndex !== -1 ? toc[activeIndex] : toc[0];

  return (
    <>
      {/* Sticky Mobile Sub-Navbar: Always accessible below SiteHeader without obscuring text */}
      <div className="sticky top-20 z-30 lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 mb-8 border-y border-border/50 bg-background/95 backdrop-blur-md shadow-sm flex items-center justify-between text-xs transition-colors">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-left truncate flex-1 mr-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-expanded={isOpen}
          aria-label="Open Table of Contents"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
            On this page:
          </span>
          <span className="font-medium text-foreground/90 truncate group-hover:text-primary transition-colors">
            {activeItem?.text}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground text-[11px] font-medium transition-colors active:scale-95 border border-border/40"
        >
          <span>
            {activeIndex !== -1 ? `${activeIndex + 1}/${toc.length}` : `${toc.length}`}
          </span>
          <Icons.chevronRight className="w-3 h-3 rotate-90 text-muted-foreground" />
        </button>
      </div>

      {/* Bottom Sheet Drawer for Full Outline */}
      {isOpen && mounted && (
        <MobileTocDrawer
          toc={toc}
          activeId={activeId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface MobileTocDrawerProps {
  toc: TocItem[];
  activeId: string;
  onClose: () => void;
}

function MobileTocDrawer({ toc, activeId, onClose }: MobileTocDrawerProps) {
  useLockBody();

  const handleLinkClick = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return createPortal(
    <>
      {/* Full-screen backdrop */}
      <div
        className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal */}
      <div
        className="fixed inset-x-0 bottom-0 z-[99999] max-h-[75vh] flex flex-col rounded-t-2xl border-t border-border bg-background p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Table of Contents"
      >
        {/* Pull Indicator Pill */}
        <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30 mx-auto mb-3" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/60">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Table of Contents
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {toc.length} sections in this article
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
            aria-label="Close"
          >
            <Icons.close className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Links List */}
        <div className="overflow-y-auto flex-1 pr-1 py-1">
          <ul className="space-y-1">
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.id)}
                    className={cn(
                      "w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors duration-150 ease-out active:scale-[0.98]",
                      item.level === 3 && "pl-6 text-muted-foreground",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground/85 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="line-clamp-1">{item.text}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 ml-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>,
    document.body
  );
}
