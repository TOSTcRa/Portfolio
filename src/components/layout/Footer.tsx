import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {t("rights")}, {new Date().getFullYear()}
        </p>
        <a href={site.repo} className="hover:text-fg" target="_blank" rel="noopener noreferrer">
          {t("source")}
        </a>
      </div>
    </footer>
  );
}
