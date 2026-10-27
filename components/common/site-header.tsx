"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/common/icons";
import { MainNav } from "@/components/common/main-nav";
import { MobileNav } from "@/components/common/mobile-nav";
import { ModeToggle } from "@/components/common/mode-toggle";
import { routesConfig } from "@/config/routes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blogs");
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

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
        <MainNav items={routesConfig.mainNav} />

        <div className="flex items-center gap-2 sm:gap-3">
          <ModeToggle />

          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted transition-colors md:hidden active:scale-95"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? (
              <Icons.close className="w-5 h-5" />
            ) : (
              <Icons.menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <MobileNav
          items={routesConfig.mainNav}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </header>
  );
}
