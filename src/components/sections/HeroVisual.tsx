"use client";
import { useCallback, useState } from "react";
import { ParticleMorphLoader } from "@/components/hero/ParticleMorphLoader";

// Full-bleed background layer of the hero: glow + 3D object. Text is layered on top by Hero.tsx.
export function HeroVisual() {
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-glow absolute inset-0" />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${live ? "opacity-100" : "opacity-0"}`}>
        <ParticleMorphLoader onReady={onReady} />
      </div>
      <div className="hero-vignette absolute inset-0" />
    </div>
  );
}
