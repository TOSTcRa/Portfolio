"use client";
import { motion } from "motion/react";
import { useLoop, EASE } from "./useLoop";

type CardSpec = { rank: string; suit: string; red: boolean; row: "dealer" | "player"; slot: number; at: number; faceDown?: boolean };
const CARDS: CardSpec[] = [
  { rank: "K", suit: "♠", red: false, row: "player", slot: 0, at: 0.08 },
  { rank: "7", suit: "♥", red: true, row: "dealer", slot: 0, at: 0.16 },
  { rank: "4", suit: "♦", red: true, row: "player", slot: 1, at: 0.24 },
  { rank: "?", suit: "", red: false, row: "dealer", slot: 1, at: 0.32, faceDown: true },
  { rank: "7", suit: "♣", red: false, row: "player", slot: 2, at: 0.5 },
];
const CYCLE = 7;

// A real table: dealer row on top, player row below. Cards deal from the shoe and flip,
// the player hits to 21, chips slide over. Loops.
export function Blackjack() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="blackjack-nextjs" className="relative h-full w-full overflow-hidden bg-[radial-gradient(80%_90%_at_50%_60%,#0f3d2e_0%,#071a13_70%,#050b09_100%)]">
      <div className="absolute inset-3 rounded-[40px] border border-white/10" />
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">Blackjack pays 3 to 2</div>
      <div className="absolute right-4 top-4 h-16 w-11 rounded-md bg-gradient-to-br from-zinc-200 to-zinc-400 shadow-md" />
      <div className="absolute right-5 top-5 h-16 w-11 rounded-md border border-zinc-500 bg-[repeating-linear-gradient(45deg,#1e3a5f_0_4px,#274b7a_4px_8px)] shadow-md" />
      {CARDS.map((c, i) => {
        const x = c.slot * 34 - 34;
        const y = c.row === "dealer" ? -52 : 40;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[68px] w-[48px] -translate-x-1/2 -translate-y-1/2 rounded-md shadow-[0_8px_20px_rgb(0_0_0/0.45)] [transform-style:preserve-3d]"
            variants={{
              play: {
                x: [180, x, x, x, 180],
                y: [-120, y, y, y, -120],
                rotate: [15, c.slot * 3 - 3, c.slot * 3 - 3, c.slot * 3 - 3, 15],
                rotateY: [180, 180, c.faceDown ? 180 : 0, c.faceDown ? 180 : 0, 180],
                opacity: [0, 1, 1, 1, 0],
                transition: { duration: CYCLE, times: [c.at, c.at + 0.07, c.at + 0.12, 0.9, 0.98], repeat: Infinity, ease: EASE },
              },
              end: { x, y, rotate: c.slot * 3 - 3, rotateY: c.faceDown ? 180 : 0, opacity: 1 },
            }}
            animate={state}
            initial={{ x: 180, y: -120, opacity: 0, rotateY: 180 }}
          >
            <div className={`absolute inset-0 flex flex-col justify-between rounded-md bg-gradient-to-br from-white to-zinc-200 p-1 font-mono text-[11px] font-semibold leading-none [backface-visibility:hidden] ${c.red ? "text-red-600" : "text-zinc-900"}`}>
              <span>{c.rank}<br />{c.suit}</span>
              <span className="self-end rotate-180">{c.rank}<br />{c.suit}</span>
            </div>
            <div className="absolute inset-0 rounded-md border border-zinc-300 bg-[repeating-linear-gradient(45deg,#1e3a5f_0_4px,#274b7a_4px_8px)] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
          </motion.div>
        );
      })}
      <motion.div
        className="absolute left-1/2 top-[76%] -translate-x-1/2 rounded-full bg-accent px-3 py-1 font-mono text-xs font-semibold text-accent-fg shadow-[0_0_24px_var(--color-accent)]"
        variants={{
          play: { scale: [0, 0, 1.15, 1, 1, 0], transition: { duration: CYCLE, times: [0, 0.6, 0.66, 0.7, 0.9, 0.95], repeat: Infinity, ease: EASE } },
          end: { scale: 1 },
        }}
        animate={state}
        initial={{ scale: 0 }}
      >
        21
      </motion.div>
      {[
        { c: "#dc2626", d: 0 },
        { c: "#2563eb", d: 0.06 },
        { c: "#34d399", d: 0.12 },
      ].map((chip, i) => (
        <motion.div
          key={i}
          className="absolute bottom-5 left-6 h-9 w-9 rounded-full border-[3px] border-dashed border-white/80 shadow-[0_6px_12px_rgb(0_0_0/0.5)]"
          style={{ backgroundColor: chip.c, marginLeft: i * 6, marginBottom: i * 4 }}
          variants={{
            play: { x: [0, 0, 120, 120, 0], transition: { duration: CYCLE, times: [0, 0.7 + chip.d, 0.8 + chip.d, 0.9, 0.98], repeat: Infinity, ease: EASE } },
            end: { x: 120 },
          }}
          animate={state}
          initial={{ x: 0 }}
        >
          <div className="absolute inset-[6px] rounded-full border border-white/40" />
        </motion.div>
      ))}
    </div>
  );
}
