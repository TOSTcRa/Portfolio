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
            className={`rounded-md border border-line ${i === 1 ? "bg-accent/20" : "bg-bg-raised"}`}
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
          />
        ))}
      </div>
    </div>
  );
}
