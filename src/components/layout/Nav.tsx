import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { NavClient } from "./NavClient";

export async function Nav() {
  const t = await getTranslations("nav");
  const items = [
    { href: "/#work", label: t("work") },
    { href: "/#reviews", label: t("reviews") },
    { href: "/#contact", label: t("contact") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight" title={t("home")}>
          {site.handle}
        </Link>
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 text-sm text-fg-muted sm:flex">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-fg">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <NavClient />
        </div>
      </nav>
    </header>
  );
}
