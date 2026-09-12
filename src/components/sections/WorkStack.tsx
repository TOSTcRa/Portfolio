"use client";
import { useReducedMotion } from "motion/react";
import type { Case, Locale } from "@/content/schema";
import { CaseCard } from "./CaseCard";

type Props = { cases: Case[]; locale: Locale; eyebrow: string; title: string; openLabel: string };

export function WorkStack({ cases, locale, eyebrow, title, openLabel }: Props) {
  const reduce = useReducedMotion();
  const sticky = !reduce;
  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24">
      <div className="mb-12 flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</span>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <div data-stack={sticky ? "sticky" : "list"} className={sticky ? "flex flex-col gap-[20vh] pb-[20vh]" : "flex flex-col gap-6"}>
        {cases.map((c, i) => (
          <CaseCard key={c.slug} c={c} locale={locale} index={i} total={cases.length} openLabel={openLabel} sticky={sticky} />
        ))}
      </div>
    </section>
  );
}
