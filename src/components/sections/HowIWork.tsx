import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { KineticHeading } from "@/components/motion/KineticHeading";

export async function HowIWork() {
  const t = await getTranslations("process");
  return (
    <section className="cv-auto border-t border-line">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24">
        <KineticHeading text={t("title")} className="text-3xl font-semibold tracking-tight sm:text-4xl" />
        <p className="max-w-[65ch] text-lg leading-relaxed text-fg-muted">{t("body")}</p>
      </Reveal>
    </section>
  );
}
