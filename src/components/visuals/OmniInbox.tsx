"use client";
import { motion } from "motion/react";
import { useLoop, EASE } from "./useLoop";

const CHANNELS = ["TG", "VB", "IG", "FB"];
const COLORS = ["#2aabee", "#7360f2", "#e1306c", "#1877f2"];
const CYCLE = 6;

// Messages from four channels travel into one inbox list on the right.
export function OmniInbox() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="1c-omnichannel-spec" className="relative h-full w-full overflow-hidden bg-bg p-5">
      <div className="absolute left-5 top-5 flex h-[calc(100%-2.5rem)] flex-col justify-around">
        {CHANNELS.map((c) => (
          <div key={c} className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-white shadow-[0_6px_16px_-4px_rgb(0_0_0/0.6)]" style={{ backgroundColor: COLORS[CHANNELS.indexOf(c)] }}>
            {c}
          </div>
        ))}
      </div>
      <div className="absolute right-5 top-5 flex h-[calc(100%-2.5rem)] w-[45%] flex-col gap-2 rounded-md border border-line bg-bg-raised p-3">
        <div className="mb-1 h-1.5 w-1/2 rounded bg-fg-muted/40" />
        {CHANNELS.map((c, i) => (
          <motion.div
            key={c}
            className="flex items-center gap-2 rounded-md border border-line px-2 py-1.5"
            variants={{
              play: { opacity: [0, 0, 1, 1, 0], x: [12, 12, 0, 0, 12], transition: { duration: CYCLE, times: [0, 0.2 + i * 0.12, 0.28 + i * 0.12, 0.9, 1], repeat: Infinity, ease: EASE } },
              end: { opacity: 1, x: 0 },
            }}
            animate={state}
            initial={{ opacity: 0, x: 12 }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <span className="font-mono text-[9px] text-fg">{c}</span>
            <span className="h-1 flex-1 rounded bg-fg-muted/40" />
            <span className="font-mono text-[8px] text-fg-muted">now</span>
          </motion.div>
        ))}
      </div>
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c}
          className="absolute left-14 h-5 w-14 rounded-full shadow-[0_0_16px_-2px_currentColor]"
          style={{ top: `${14 + i * 24}%`, backgroundColor: COLORS[i], color: COLORS[i] }}
          variants={{
            play: {
              x: [0, 0, 150, 150],
              y: [0, 0, (2 - i) * 22, (2 - i) * 22],
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1, 0.8, 0.5],
              transition: { duration: CYCLE, times: [0, 0.04 + i * 0.12, 0.26 + i * 0.12, 0.3 + i * 0.12], repeat: Infinity, ease: EASE },
            },
            end: { x: 150, opacity: 0 },
          }}
          animate={state}
          initial={{ opacity: 0 }}
        />
      ))}
    </div>
  );
}
