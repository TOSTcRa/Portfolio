"use client";
import { motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { useLoop, EASE } from "./useLoop";

const ORDERS = ["0418", "0419", "0420", "0421"];
const CYCLE = 6;

// EDI order envelopes slide into the accounting panel and land there as posted invoice rows.
export function EdiFlow() {
  const { ref, state } = useLoop();
  return (
    <div ref={ref} data-visual="comarch-edi-baf" className="relative h-full w-full overflow-hidden bg-bg p-5">
      <div className="absolute left-5 top-5 flex h-[calc(100%-2.5rem)] w-[34%] flex-col justify-around">
        {ORDERS.map((o, i) => (
          <motion.div
            key={o}
            className="whitespace-nowrap rounded-md border border-line bg-bg-raised px-2 py-1.5 font-mono text-[9px] text-fg-muted"
            variants={{
              play: {
                x: [0, 0, 120, 120, 0],
                opacity: [1, 1, 0, 0, 1],
                transition: { duration: CYCLE, times: [0, 0.08 + i * 0.14, 0.2 + i * 0.14, 0.92, 1], repeat: Infinity, ease: EASE },
              },
              end: { x: 120, opacity: 0 },
            }}
            animate={state}
            initial={{ x: 0, opacity: 1 }}
          >
            ORDERS {o}
          </motion.div>
        ))}
      </div>
      <div className="absolute right-5 top-5 z-10 flex h-[calc(100%-2.5rem)] w-[52%] flex-col gap-2 rounded-md border border-line bg-bg-raised p-3">
        <div className="mb-1 flex items-center justify-between font-mono text-[9px] text-fg-muted">
          <span>BAF</span>
          <span>0 errors</span>
        </div>
        {ORDERS.map((o, i) => (
          <motion.div
            key={o}
            className="flex items-center gap-2 rounded-md border border-line px-2 py-1.5"
            variants={{
              play: {
                opacity: [0, 0, 1, 1, 0],
                x: [-10, -10, 0, 0, -10],
                transition: { duration: CYCLE, times: [0, 0.2 + i * 0.14, 0.26 + i * 0.14, 0.92, 1], repeat: Infinity, ease: EASE },
              },
              end: { opacity: 1, x: 0 },
            }}
            animate={state}
            initial={{ opacity: 0, x: -10 }}
          >
            <CheckCircle size={12} weight="fill" className="text-accent" />
            <span className="font-mono text-[9px] text-fg">INV-{String(120 + i).padStart(4, "0")}</span>
            <span className="h-1 flex-1 rounded bg-fg-muted/40" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
