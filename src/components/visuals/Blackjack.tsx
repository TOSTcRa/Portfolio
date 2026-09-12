"use client";
import { motion } from "motion/react";
import { useLoop, EASE } from "./useLoop";

const CARDS = [
  { x: -150, r: -8, face: "A" },
  { x: -50, r: -3, face: "K" },
  { x: 50, r: 3, face: "7" },
  { x: 150, r: 8, face: "10" },
];
const CYCLE = 6;

// Cards fly out of the deck one by one and flip face up; two chips drop onto the table.
export function Blackjack() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="blackjack-nextjs" className="relative h-full w-full overflow-hidden bg-bg">
      <div className="absolute right-6 top-6 h-20 w-14 rounded-md border border-line bg-bg-raised" />
      <div className="absolute right-7 top-7 h-20 w-14 rounded-md border border-line bg-bg-raised" />
      {CARDS.map((c, i) => (
        <motion.div
          key={c.face}
          className="absolute left-1/2 top-1/2 flex h-24 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-bg-raised font-mono text-lg text-fg [backface-visibility:hidden] [transform-style:preserve-3d]"
          variants={{
            play: {
              x: [220, c.x, c.x, c.x, 220],
              y: [-140, 0, 0, 0, -140],
              rotate: [0, c.r, c.r, c.r, 0],
              rotateY: [180, 180, 0, 0, 180],
              opacity: [0, 1, 1, 1, 0],
              transition: { duration: CYCLE, times: [0, 0.15, 0.3, 0.85, 1], delay: i * 0.25, ease: EASE, repeat: Infinity },
            },
            end: { x: c.x, y: 0, rotate: c.r, rotateY: 0, opacity: 1 },
          }}
          animate={state}
          initial={{ x: 220, y: -140, opacity: 0, rotateY: 180 }}
        >
          <span className="text-accent">{c.face}</span>
        </motion.div>
      ))}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-6 h-8 w-8 rounded-full border-4 border-dashed border-accent/70 bg-bg-raised"
          style={{ left: `${36 + i * 8}%` }}
          variants={{
            play: { y: [-120, 0, 0, -120], opacity: [0, 1, 1, 0], transition: { duration: CYCLE, times: [0.35, 0.5, 0.85, 1], delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1], repeat: Infinity } },
            end: { y: 0, opacity: 1 },
          }}
          animate={state}
          initial={{ y: -120, opacity: 0 }}
        />
      ))}
    </div>
  );
}
