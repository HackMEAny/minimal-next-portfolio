"use client";

import React, { useCallback, useState } from "react";

interface BlogArticleWrapperProps {
  children: React.ReactNode;
}

export function BlogArticleWrapper({ children }: BlogArticleWrapperProps) {
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>("[data-copy-code='true']");
    if (!btn) return;

    e.preventDefault();

    const wrapper = btn.closest(".code-block-wrapper");
    const code =
      wrapper?.querySelector("pre > code")?.textContent ??
      wrapper?.querySelector("pre")?.textContent ??
      "";

    if (!code) return;

    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    if (success) {
      btn.classList.add("copied");
      setLiveAnnouncement("Code copied to clipboard");

      const existingTimeout = btn.getAttribute("data-timeout-id");
      if (existingTimeout) {
        window.clearTimeout(Number(existingTimeout));
      }

      const timeoutId = window.setTimeout(() => {
        btn.classList.remove("copied");
        btn.removeAttribute("data-timeout-id");
      }, 2000);

      btn.setAttribute("data-timeout-id", String(timeoutId));
    } else {
      setLiveAnnouncement("Failed to copy code to clipboard");
    }
  }, []);

  return (
    <div onClick={handleClick} className="relative w-full">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveAnnouncement}
      </div>
      {children}
    </div>
  );
}
