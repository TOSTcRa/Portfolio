"use client";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sun, Moon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function storedTheme(): Theme {
  try {
    const s = localStorage.getItem("theme");
    if (s === "light" || s === "dark") return s;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// The html[data-theme] attribute is the source of truth (set by ThemeScript before paint).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function NavClient() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "uk" ? "en" : "uk";
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  // Client-side navigation between locales re-renders <html> and drops the attribute the
  // inline script set. Put it back before paint so the theme never flips on a language switch.
  useLayoutEffect(() => {
    if (!document.documentElement.hasAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", storedTheme());
    }
  }, [pathname, locale]);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale={other}
        aria-label={t("locale")}
        className="rounded-md px-2 py-1 font-mono text-xs uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        {other}
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label={t("theme")}
        className="rounded-md p-2 text-fg-muted hover:bg-bg-raised hover:text-fg"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}
