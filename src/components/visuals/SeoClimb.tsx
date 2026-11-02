"use client";
import { motion } from "motion/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useLoop, EASE } from "./useLoop";

const ROWS = 5;
const ROW_H = 30;
const CYCLE = 6;

// A search results page: the store's row climbs from the bottom to the top spot, the others step down.
export function SeoClimb() {
  const { ref, state } = useLoop();
  const climb = ROWS - 1;
  return (
    <div ref={ref} data-visual="auto-parts-shop-seo" className="relative flex h-full w-full flex-col gap-3 overflow-hidden bg-bg p-5">
      <div className="flex items-center gap-2 rounded-full border border-line bg-bg-raised px-3 py-1.5 text-fg-muted">
        <MagnifyingGlass size={12} />
        <span className="font-mono text-[10px]">auto parts</span>
      </div>
      <div className="relative flex-1">
        {Array.from({ length: ROWS }, (_, i) => {
          const ours = i === climb;
          const target = ours ? 0 : i + 1;
          return (
            <motion.div
              key={i}
              className={`absolute left-0 right-0 flex items-center gap-2 rounded-md border px-2 ${ours ? "border-accent bg-accent/10" : "border-line bg-bg-raised"}`}
              style={{ height: ROW_H - 6 }}
              variants={{
                play: {
                  y: [i * ROW_H, i * ROW_H, target * ROW_H, target * ROW_H, i * ROW_H],
                  transition: { duration: CYCLE, times: [0, 0.25, 0.6, 0.92, 1], repeat: Infinity, ease: EASE },
                },
                end: { y: target * ROW_H },
              }}
              animate={state}
              initial={{ y: i * ROW_H }}
            >
              <span className={`font-mono text-[9px] ${ours ? "text-accent" : "text-fg-muted"}`}>{ours ? "shop" : "site"}</span>
              <span className={`h-1 flex-1 rounded ${ours ? "bg-accent/60" : "bg-fg-muted/40"}`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
