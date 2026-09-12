"use client";
import { motion } from "motion/react";
import { useLoop, EASE } from "./useLoop";

const CHANNELS = ["TG", "VB", "IG", "FB"];
const CYCLE = 6;

// Messages from four channels travel into one inbox list on the right.
export function OmniInbox() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="1c-omnichannel-spec" className="relative h-full w-full overflow-hidden bg-bg p-5">
      <div className="absolute left-5 top-5 flex h-[calc(100%-2.5rem)] flex-col justify-around">
        {CHANNELS.map((c) => (
          <div key={c} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-raised font-mono text-[10px] text-fg-muted">
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
            <span className="font-mono text-[9px] text-accent">{c}</span>
            <span className="h-1 flex-1 rounded bg-fg-muted/40" />
          </motion.div>
        ))}
      </div>
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c}
          className="absolute left-14 h-5 w-14 rounded-full bg-accent/80"
          style={{ top: `${14 + i * 24}%` }}
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
