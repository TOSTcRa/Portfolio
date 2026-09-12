import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { HeroHeadline } from "./HeroHeadline";
import { HeroVisual } from "./HeroVisual";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-end overflow-hidden">
      <HeroVisual />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-24 lg:pb-24">
        <div className="flex max-w-5xl flex-col gap-8">
          <HeroHeadline lines={[t("headline1"), t("headline2")]} />
          <p className="max-w-[46ch] text-lg leading-relaxed text-fg-muted lg:text-xl">{t("sub")}</p>
          <div className="flex flex-wrap gap-3">
            <MagneticLink href={site.telegram} external className={buttonClasses("primary")}>
              {t("ctaTelegram")}
            </MagneticLink>
            <a href="#work" className={buttonClasses("secondary")}>
              {t("ctaWork")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
