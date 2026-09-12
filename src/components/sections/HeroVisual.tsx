"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HeroVisual({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-bg-raised"
      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <Image src="/hero.webp" alt={alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
