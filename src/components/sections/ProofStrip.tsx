import { getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { site } from "@/lib/site";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

export async function ProofStrip() {
  const t = await getTranslations("proof");
  const p = getProfile();
  const items = [
    { value: p.completed, label: t("completed") },
    { value: p.successRate, suffix: "%", label: t("successRate") },
    { value: p.averageGrade, decimals: 2, label: t("averageGrade") },
    { value: p.positiveReviews, label: t("positiveReviews") },
  ];
  return (
    <section className="border-y border-line bg-bg-raised">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col gap-1">
            <CountUp value={i.value} decimals={i.decimals} suffix={i.suffix} className="font-mono text-3xl font-medium tabular-nums sm:text-4xl" />
            <span className="text-sm text-fg-muted">{i.label}</span>
          </div>
        ))}
        <a
          href={site.freelancehunt}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 text-xs text-fg-muted underline underline-offset-4 hover:text-fg lg:col-span-4"
        >
          {t("source")}
        </a>
      </Reveal>
    </section>
  );
}
