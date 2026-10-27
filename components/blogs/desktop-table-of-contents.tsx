"use client";

import { useEffect, useState } from "react";

import { TocItem } from "@/lib/blogs";
import { cn } from "@/lib/utils";

interface DesktopTableOfContentsProps {
  toc: TocItem[];
}

export function DesktopTableOfContents({ toc }: DesktopTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const best = visibleEntries.reduce((prev, curr) =>
            Math.abs(curr.boundingClientRect.top - 100) <
            Math.abs(prev.boundingClientRect.top - 100)
              ? curr
              : prev
          );
          setActiveId(best.target.id);
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0, 0.5, 1],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
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

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toc]);

  // Gently auto-scroll TOC container to follow active section
  useEffect(() => {
    if (!activeId) return;
    const container = document.getElementById("table-of-contents");
    const activeLink = container?.querySelector(`a[href="#${activeId}"]`) as HTMLElement;
    if (container && activeLink) {
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elemTop = activeLink.offsetTop;
      const elemBottom = elemTop + activeLink.offsetHeight;

      if (elemTop < containerTop + 40 || elemBottom > containerBottom - 40) {
        container.scrollTo({
          top: elemTop - container.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  if (!toc || toc.length === 0) return null;

  return (
    <aside
      id="table-of-contents"
      className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto toc-scrollbar w-full pr-2 text-sm"
      aria-label="Table of contents"
    >
      <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <span>Table of Contents</span>
      </div>
      <nav>
        <ul className="space-y-1 border-l border-border">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1 text-xs transition-colors duration-150 ease-out line-clamp-2 border-l-2 -ml-[2px]",
                    item.level === 3 ? "pl-5 text-muted-foreground/80" : "pl-3",
                    isActive
                      ? "border-primary text-primary font-medium bg-primary/5 rounded-r"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
