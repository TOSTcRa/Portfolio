"use client";
import { motion } from "motion/react";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLoop, EASE } from "./useLoop";

const TILES = [0, 1, 2, 3, 4, 5, 6, 7];
const HUES = ["from-rose-400/70 to-rose-900/40", "from-amber-300/70 to-amber-800/40", "from-sky-400/70 to-sky-900/40", "from-violet-400/70 to-violet-900/40", "from-emerald-400/70 to-emerald-900/40", "from-orange-400/70 to-orange-900/40", "from-teal-300/70 to-teal-900/40", "from-fuchsia-400/70 to-fuchsia-900/40"];
const PRICES = ["1 290", "840", "2 450", "590", "1 990", "720", "3 100", "460"];
const FILTERS = ["All", "New", "Sale"];
const ORDERS = [TILES, [3, 0, 6, 1, 7, 2, 4, 5], [5, 2, 7, 0, 3, 6, 1, 4]];

// A product grid re-sorts as filter pills switch; the cart badge fills up.
export function ShopCatalog() {
  const { ref, playing } = useLoop();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % ORDERS.length), 1800);
    return () => clearInterval(id);
  }, [playing]);
  const order = ORDERS[step];
  return (
    <div ref={ref} data-visual="shop-storefront-catalog" className="flex h-full w-full flex-col gap-3 overflow-hidden bg-bg p-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {FILTERS.map((f, i) => (
            <span key={f} className={`rounded-md border px-2 py-0.5 font-mono text-[10px] transition-colors ${i === step ? "border-accent text-accent" : "border-line text-fg-muted"}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="relative text-fg-muted">
          <ShoppingCartSimple size={18} />
          <motion.span
            key={step}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] text-accent-fg"
          >
            {step + 1}
          </motion.span>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {order.map((id) => (
          <motion.div
            key={id}
            layout
            transition={{ duration: 0.7, ease: EASE }}
            className="relative flex flex-col justify-end gap-1 overflow-hidden rounded-md border border-line bg-bg-raised p-2 shadow-[0_10px_24px_-12px_rgb(0_0_0/0.8)]"
          >
            <div className={`h-1/2 rounded-sm bg-gradient-to-br ${HUES[id]}`} />
            {id % 3 === 0 && <span className="absolute right-1.5 top-1.5 rounded-sm bg-accent px-1 font-mono text-[8px] font-semibold text-accent-fg">-20%</span>}
            <div className="h-1 w-3/4 rounded bg-fg-muted/50" />
            <div className="font-mono text-[9px] text-fg">{PRICES[id]} ₴</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
