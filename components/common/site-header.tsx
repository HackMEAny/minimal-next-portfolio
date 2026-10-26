"use client";

import { usePathname } from "next/navigation";

import { MainNav } from "@/components/common/main-nav";
import { ModeToggle } from "@/components/common/mode-toggle";
import { routesConfig } from "@/config/routes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blogs");

  return (
    <header
      className={cn(
        "z-50 bg-background",
        isBlog
          ? "sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "container"
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center justify-between py-6",
          isBlog && "container"
        )}
      >
        <MainNav items={routesConfig.mainNav}>
          <div className="flex items-center gap-3">
            {/* <GitHubStarBadge className="w-full justify-center" /> */}
            <ModeToggle />
          </div>
        </MainNav>
        <nav className="flex items-center gap-5">
          {/* <GitHubStarBadge /> */}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
