"use client";
import { motion } from "motion/react";
import { CheckCircle, FileText } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLoop, EASE } from "./useLoop";

const ORDERS = ["0418", "0419", "0420", "0421"];
const TICK = 900;
const FLIGHT = 0.45;
const HOLD = 2;
const ROW = "flex h-8 items-center gap-2 rounded-md border border-line px-2";

// Orders leave the EDI inbox one by one, travel along the wire and land in BAF as checked invoices.
export function EdiFlow() {
  const { ref, playing } = useLoop();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (ORDERS.length + HOLD + 1)), TICK);
    return () => clearInterval(id);
  }, [playing]);
  const sent = playing ? Math.min(step, ORDERS.length) : ORDERS.length;
  const flying = playing && step >= 1 && step <= ORDERS.length ? step - 1 : -1;
  return (
    <div ref={ref} data-visual="comarch-edi-baf" className="relative flex h-full w-full items-center overflow-hidden bg-bg p-5">
      <div className="flex w-[38%] flex-col gap-2 rounded-md border border-line bg-bg-raised p-3">
        <span className="mb-1 font-mono text-[9px] text-fg-muted">Comarch EDI</span>
        {ORDERS.map((o, i) => (
          <div key={o} className={`${ROW} transition-opacity duration-300 ${i < sent ? "opacity-35" : "opacity-100"}`}>
            <FileText size={12} className="shrink-0 text-fg-muted" />
            <span className="whitespace-nowrap font-mono text-[9px] text-fg">ORDER {o}</span>
          </div>
        ))}
      </div>

      <div className="flex w-[24%] flex-col gap-2 py-3">
        <span aria-hidden className="mb-1 font-mono text-[9px] text-transparent">.</span>
        {ORDERS.map((o, i) => (
          <div key={o} className="relative flex h-8 items-center">
            <div className={`w-full border-t border-dashed transition-colors duration-300 ${i < sent ? "border-accent/50" : "border-line"}`} />
            {i === flying && (
              <motion.span
                key={step}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_2px_var(--color-accent)]"
                initial={{ left: "0%", opacity: 1 }}
                animate={{ left: "100%", opacity: [1, 1, 0] }}
                transition={{ duration: FLIGHT, ease: "easeInOut" }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex w-[38%] flex-col gap-2 rounded-md border border-line bg-bg-raised p-3">
        <span className="mb-1 font-mono text-[9px] text-fg-muted">BAF</span>
        {ORDERS.map((o, i) => (
          <motion.div
            key={o}
            className={ROW}
            initial={false}
            animate={i < sent ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: EASE, delay: i === flying ? FLIGHT : 0 }}
          >
            <CheckCircle size={12} weight="fill" className="shrink-0 text-accent" />
            <span className="whitespace-nowrap font-mono text-[9px] text-fg">INVOICE {o}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
