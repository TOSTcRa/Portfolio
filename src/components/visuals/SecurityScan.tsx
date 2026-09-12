"use client";
import { motion } from "motion/react";
import { LockKey } from "@phosphor-icons/react";
import { useLoop, EASE } from "./useLoop";

const COLS = 6;
const ROWS = 4;
const INFECTED = new Set([2, 7, 11, 16, 21]);
const CYCLE = 6;

// A scan line sweeps across a grid of files; infected red blocks turn emerald as it passes.
export function SecurityScan() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="site-security-cleanup" className="relative h-full w-full overflow-hidden bg-bg p-5">
      <div className="grid h-full gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const col = i % COLS;
          const bad = INFECTED.has(i);
          const t = 0.15 + (col / COLS) * 0.55; // when the scan line reaches this column
          return (
            <motion.div
              key={i}
              className="rounded-md border border-line"
              variants={{
                play: {
                  backgroundColor: bad ? ["#f8717166", "#f8717166", "#34d39966", "#34d39966", "#f8717166"] : ["#141417", "#141417", "#34d39933", "#141417", "#141417"],
                  transition: { duration: CYCLE, times: [0, t, t + 0.05, 0.9, 1], repeat: Infinity, ease: "linear" },
                },
                end: { backgroundColor: bad ? "#34d39966" : "#141417" },
              }}
              animate={state}
              initial={{ backgroundColor: bad ? "#f8717166" : "#141417" }}
            />
          );
        })}
      </div>
      <motion.div
        className="absolute bottom-0 top-0 w-px bg-accent shadow-[0_0_24px_4px_var(--color-accent)]"
        variants={{
          play: { left: ["4%", "4%", "96%", "96%", "4%"], opacity: [0, 1, 1, 0, 0], transition: { duration: CYCLE, times: [0, 0.15, 0.7, 0.75, 1], repeat: Infinity, ease: "linear" } },
          end: { left: "96%", opacity: 0 },
        }}
        animate={state}
        initial={{ left: "4%", opacity: 0 }}
      />
      <motion.div
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg"
        variants={{
          play: { scale: [0, 0, 1, 1, 0], transition: { duration: CYCLE, times: [0, 0.72, 0.8, 0.95, 1], repeat: Infinity, ease: EASE } },
          end: { scale: 1 },
        }}
        animate={state}
        initial={{ scale: 0 }}
      >
        <LockKey size={20} weight="fill" />
      </motion.div>
    </div>
  );
}
