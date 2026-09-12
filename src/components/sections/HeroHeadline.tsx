"use client";
import { motion, useReducedMotion } from "motion/react";

// Storytelling: the two headline lines rise out of a clip mask one after the other.
export function HeroHeadline({ lines }: { lines: [string, string] }) {
  const reduce = useReducedMotion();
  return (
    <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[2.5rem] xl:text-[3.25rem]">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-1">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
