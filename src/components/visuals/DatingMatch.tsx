"use client";
import { motion } from "motion/react";
import { Heart } from "@phosphor-icons/react";
import { useLoop, EASE } from "./useLoop";

const CYCLE = 6;

// Profile cards swipe; the two that remain slide together and a heart pulses between them.
export function DatingMatch() {
  const { ref, state } = useLoop();
  const card = "absolute top-1/2 h-36 w-24 -translate-y-1/2 rounded-md border border-line bg-bg-raised p-2";
  return (
    <div ref={ref} data-visual="dating-platforms-frontend" className="relative h-full w-full overflow-hidden bg-[radial-gradient(70%_60%_at_50%_50%,color-mix(in_oklab,var(--color-accent)_10%,transparent),transparent_70%)]">
      <motion.div
        className={`${card} left-1/2 -translate-x-1/2`}
        variants={{
          play: { x: ["-50%", "-50%", "160%", "160%", "-50%"], rotate: [0, 0, 25, 25, 0], opacity: [1, 1, 0, 0, 1], transition: { duration: CYCLE, times: [0, 0.15, 0.32, 0.98, 1], repeat: Infinity, ease: EASE } },
          end: { x: "160%", opacity: 0 },
        }}
        animate={state}
        initial={{ x: "-50%" }}
      >
        <div className="h-16 rounded-sm bg-gradient-to-br from-amber-300/70 to-rose-800/50" />
        <div className="mt-2 h-1.5 w-2/3 rounded bg-fg-muted/50" />
        <div className="mt-1 h-1 w-1/3 rounded bg-fg-muted/30" />
      </motion.div>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className={card}
          style={{ left: "50%" }}
          variants={{
            play: {
              x: ["-50%", "-50%", i ? "8%" : "-108%", i ? "8%" : "-108%", "-50%"],
              scale: [0.92, 0.92, 1, 1, 0.92],
              transition: { duration: CYCLE, times: [0, 0.35, 0.55, 0.9, 1], repeat: Infinity, ease: EASE },
            },
            end: { x: i ? "8%" : "-108%", scale: 1 },
          }}
          animate={state}
          initial={{ x: "-50%", scale: 0.92 }}
        >
          <div className={`h-16 rounded-sm bg-gradient-to-br ${i ? "from-emerald-300/70 to-teal-900/50" : "from-sky-300/70 to-indigo-900/50"}`} />
          <div className="mt-2 h-1.5 w-2/3 rounded bg-fg-muted/50" />
          <div className="mt-1 h-1 w-1/3 rounded bg-fg-muted/30" />
        </motion.div>
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400 drop-shadow-[0_0_18px_rgb(251_113_133/0.8)]"
        variants={{
          play: { scale: [0, 0, 1.2, 1, 1.2, 1, 0], transition: { duration: CYCLE, times: [0, 0.55, 0.62, 0.7, 0.78, 0.88, 0.95], repeat: Infinity, ease: EASE } },
          end: { scale: 1 },
        }}
        animate={state}
        initial={{ scale: 0 }}
      >
        <Heart size={32} weight="fill" />
      </motion.div>
    </div>
  );
}
