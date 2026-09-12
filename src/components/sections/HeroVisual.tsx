"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { ParticleMorphLoader } from "@/components/hero/ParticleMorphLoader";

// Entrance (fade + settle from 1.04) is CSS (.hero-visual) so the image paints before hydration.
// The particle scene mounts over the image and the image fades out once the first frame renders.
export function HeroVisual({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);

  return (
    <div ref={ref} className="hero-visual relative aspect-[4/5] w-full overflow-hidden rounded-md bg-bg-raised">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <Image
          src="/hero.webp"
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ${live ? "opacity-0" : "opacity-100"}`}
        />
      </motion.div>
      <ParticleMorphLoader onReady={onReady} />
    </div>
  );
}
