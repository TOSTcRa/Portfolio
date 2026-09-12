import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { HeroHeadline } from "./HeroHeadline";
import { HeroVisual } from "./HeroVisual";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-16 lg:grid-cols-12 lg:pt-24">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <HeroHeadline lines={[t("headline1"), t("headline2")]} />
        <p className="max-w-[60ch] text-base leading-relaxed text-fg-muted sm:text-lg">{t("sub")}</p>
        <div className="flex flex-wrap gap-3">
          <MagneticLink href={site.telegram} external className={buttonClasses("primary")}>
            {t("ctaTelegram")}
          </MagneticLink>
          <a href="#work" className={buttonClasses("secondary")}>
            {t("ctaWork")}
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <HeroVisual alt={t("visualAlt")} />
      </div>
    </section>
  );
}
