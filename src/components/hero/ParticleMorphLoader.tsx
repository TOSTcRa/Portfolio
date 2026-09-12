"use client";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const ParticleMorph = dynamic(() => import("./ParticleMorph"), { ssr: false });

let cached: boolean | null = null;
function canRun(): boolean {
  if (cached !== null) return cached;
  let ok = false;
  try {
    ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      Boolean(document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl"));
  } catch {
    ok = false;
  }
  cached = ok;
  return ok;
}
const noop = () => () => {};

// Mounts the three.js scene only on capable clients, after hydration, so the hero image stays the LCP.
export function ParticleMorphLoader({ onReady }: { onReady?: () => void }) {
  const enabled = useSyncExternalStore(noop, canRun, () => false);
  if (!enabled) return null;
  return <ParticleMorph onReady={onReady} />;
}
