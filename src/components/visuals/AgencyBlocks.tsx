"use client";
import { motion } from "motion/react";
import { useLoop, EASE } from "./useLoop";

// A page layout assembles block by block from random offsets, holds, then scatters again.
const BLOCKS = [
  { area: "1 / 1 / 2 / 7", from: { x: -80, y: -40 } },
  { area: "2 / 1 / 4 / 5", from: { x: -120, y: 60 } },
  { area: "2 / 5 / 3 / 7", from: { x: 120, y: -60 } },
  { area: "3 / 5 / 4 / 7", from: { x: 140, y: 40 } },
  { area: "4 / 1 / 5 / 3", from: { x: -60, y: 120 } },
  { area: "4 / 3 / 5 / 5", from: { x: 0, y: 140 } },
  { area: "4 / 5 / 5 / 7", from: { x: 80, y: 120 } },
  { area: "5 / 1 / 6 / 7", from: { x: 0, y: 90 } },
];
const CYCLE = 6;

export function AgencyBlocks() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="agency-site-improvements" className="h-full w-full overflow-hidden bg-bg p-5">
      <div className="grid h-full grid-cols-6 grid-rows-5 gap-2">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={b.area}
            style={{ gridArea: b.area }}
            className={`rounded-md border border-line shadow-[0_10px_24px_-14px_rgb(0_0_0/0.8)] ${i === 1 ? "bg-gradient-to-br from-accent/40 to-accent/5" : i === 0 ? "bg-gradient-to-r from-bg-raised to-bg" : "bg-bg-raised"}`}
            variants={{
              play: {
                x: [b.from.x, 0, 0, b.from.x],
                y: [b.from.y, 0, 0, b.from.y],
                opacity: [0, 1, 1, 0],
                rotate: [i % 2 ? 6 : -6, 0, 0, i % 2 ? -6 : 6],
                transition: { duration: CYCLE, times: [0, 0.2, 0.85, 1], delay: i * 0.12, ease: EASE, repeat: Infinity },
              },
              end: { x: 0, y: 0, opacity: 1, rotate: 0 },
            }}
            animate={state}
            initial={{ x: b.from.x, y: b.from.y, opacity: 0 }}
          >
            {i === 0 && (
              <div className="flex h-full items-center justify-between px-3">
                <span className="h-2 w-10 rounded bg-accent" />
                <span className="flex gap-2">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-6 rounded bg-fg-muted/50" />)}</span>
              </div>
            )}
            {i === 1 && (
              <div className="flex h-full flex-col justify-center gap-2 p-4">
                <span className="h-3 w-3/4 rounded bg-fg/80" />
                <span className="h-3 w-1/2 rounded bg-fg/60" />
                <span className="mt-1 h-1.5 w-2/3 rounded bg-fg-muted/50" />
                <span className="mt-2 h-5 w-16 rounded bg-accent" />
              </div>
            )}
            {i > 1 && i < 7 && (
              <div className="flex h-full flex-col justify-end gap-1 p-2">
                <span className={`h-1/2 w-full rounded-sm bg-gradient-to-br ${["from-sky-400/50 to-sky-900/30", "from-amber-300/50 to-amber-900/30", "from-rose-400/50 to-rose-900/30", "from-violet-400/50 to-violet-900/30", "from-teal-300/50 to-teal-900/30"][i - 2]}`} />
                <span className="h-1 w-2/3 rounded bg-fg-muted/50" />
              </div>
            )}
            {i === 7 && <div className="flex h-full items-center gap-3 px-3">{[0, 1, 2, 3].map((k) => <span key={k} className="h-1.5 w-8 rounded bg-fg-muted/40" />)}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
