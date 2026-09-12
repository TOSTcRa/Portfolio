"use client";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

// Shared gate for case visuals: play only in view, static end frame under reduced motion.
export function useLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const playing = inView && !reduce;
  return { ref, playing, state: playing ? "play" : "end" } as const;
}

export const EASE = [0.16, 1, 0.3, 1] as const;
