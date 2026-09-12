"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { CaseCardData } from "@/content";
import { CaseVisual } from "@/components/visuals/CaseVisual";
import { TiltSpotlight } from "@/components/motion/TiltSpotlight";

type Props = { c: CaseCardData; index: number; total: number; openLabel: string; sticky: boolean };

// Sticky-stack: each card pins at top-24 and, as the next card slides over it,
// shrinks to 0.94 and dims. State transition: the reader sees "this one is done, next one".
export function CaseCard({ c, index, total, openLabel, sticky }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.5]);

  const inner = (
    <TiltSpotlight className="h-full">
    <article className="grid h-full grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col justify-between gap-6 lg:col-span-6">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-fg-muted">
            {c.clientType}, {c.year}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.title}</h3>
          <p className="max-w-[55ch] text-fg-muted">{c.summary}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {c.stack.map((s) => (
              <li key={s} className="rounded-md border border-line px-2 py-1 font-mono text-xs text-fg-muted">
                {s}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1 text-sm text-accent">
            {openLabel} <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line shadow-[0_20px_50px_-20px_rgb(0_0_0/0.7)] lg:col-span-6">
        {c.cover ? (
          <Image src={c.cover.src} alt={c.cover.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <CaseVisual slug={c.slug} index={index} />
        )}
      </div>
    </article>
    </TiltSpotlight>
  );

  if (!sticky) {
    return (
      <Link href={`/work/${c.slug}`} className="block">
        {inner}
      </Link>
    );
  }

  return (
    <div ref={ref} className="sticky top-24" style={{ zIndex: index + 1 }}>
      <motion.div style={{ scale, opacity, transformOrigin: "center top" }}>
        <Link href={`/work/${c.slug}`} className="block">
          {inner}
        </Link>
      </motion.div>
    </div>
  );
}
