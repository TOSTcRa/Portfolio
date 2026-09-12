"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

type Props = { href: string; className?: string; children: ReactNode; external?: boolean };

// Pulls the element toward the cursor by up to 12px. Feedback: the primary CTA feels "alive".
export function MagneticLink({ href, className, children, external }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  function onMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-12, Math.min(12, dx * 0.25)));
    y.set(Math.max(-12, Math.min(12, dy * 0.25)));
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}
