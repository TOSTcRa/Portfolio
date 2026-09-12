"use client";
import { motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { useLoop, EASE } from "./useLoop";

const CYCLE = 6;

// An admin panel: the button presses, a new product tile grows into the grid, the avatar swaps color.
export function AdminPanel() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="client-portfolio-admin" className="flex h-full w-full overflow-hidden bg-bg">
      <div className="flex w-1/4 flex-col gap-3 border-r border-line bg-bg-raised p-4">
        <motion.div
          className="h-8 w-8 rounded-full"
          variants={{
            play: { backgroundColor: ["#52525b", "#52525b", "#34d399", "#34d399", "#52525b"], transition: { duration: CYCLE, times: [0, 0.6, 0.68, 0.95, 1], repeat: Infinity } },
            end: { backgroundColor: "#34d399" },
          }}
          animate={state}
          initial={{ backgroundColor: "#52525b" }}
        />
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1.5 rounded ${i === 0 ? "w-full bg-accent/60" : "w-2/3 bg-fg-muted/40"}`} />
        ))}
        <motion.div
          className="mt-auto flex h-7 items-center justify-center gap-1 rounded-md bg-accent font-mono text-[10px] text-accent-fg"
          variants={{
            play: { scale: [1, 1, 0.92, 1, 1], transition: { duration: CYCLE, times: [0, 0.2, 0.24, 0.28, 1], repeat: Infinity, ease: EASE } },
            end: { scale: 1 },
          }}
          animate={state}
        >
          <Plus size={12} weight="bold" /> Add
        </motion.div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 p-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col justify-end gap-1 rounded-md border border-line bg-bg-raised p-2">
            <div className="h-1/2 rounded-sm bg-line" />
            <div className="h-1 w-2/3 rounded bg-fg-muted/40" />
          </div>
        ))}
        <motion.div
          className="flex flex-col justify-end gap-1 rounded-md border border-accent bg-accent/10 p-2"
          variants={{
            play: { scale: [0, 0, 1.06, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0], transition: { duration: CYCLE, times: [0, 0.28, 0.4, 0.45, 0.95, 1], repeat: Infinity, ease: EASE } },
            end: { scale: 1, opacity: 1 },
          }}
          animate={state}
          initial={{ scale: 0, opacity: 0 }}
        >
          <div className="h-1/2 rounded-sm bg-accent/30" />
          <div className="h-1 w-2/3 rounded bg-accent" />
        </motion.div>
      </div>
    </div>
  );
}
