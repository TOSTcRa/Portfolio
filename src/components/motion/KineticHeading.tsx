"use client";
import { motion, useReducedMotion } from "motion/react";

type Props = { text: string; className?: string; id?: string };

// Section headings assemble character by character on first view (storytelling: the section "arrives").
export function KineticHeading({ text, className, id }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  let index = 0;
  return (
    <motion.h2
      id={id}
      className={className}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, c) => {
            const i = index++;
            return (
              <span key={c} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  aria-hidden
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.6, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
          {w < words.length - 1 && <span aria-hidden>&nbsp;</span>}
        </span>
      ))}
    </motion.h2>
  );
}
