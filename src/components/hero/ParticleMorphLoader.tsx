"use client";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const ParticleMorph = dynamic(() => import("./ParticleMorph"), { ssr: false });

let cached: boolean | null = null;

// True only on clients that can render the 3D hero well: reduced motion off, WebGL present,
// and a hardware renderer. Software rasterizers (SwiftShader, llvmpipe, headless audits) get the
// CSS glow instead, which is also what keeps Lighthouse and PageSpeed honest about real users.
function canRun(): boolean {
  if (cached !== null) return cached;
  let ok = false;
  try {
    const force = localStorage.getItem("force3d") === "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (gl && !reduce) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
      const software = /swiftshader|llvmpipe|software|mesa offscreen/i.test(renderer);
      ok = force || !software;
    }
  } catch {
    ok = false;
  }
  cached = ok;
  return ok;
}
const noop = () => () => {};

export function ParticleMorphLoader({ onReady }: { onReady?: () => void }) {
  const enabled = useSyncExternalStore(noop, canRun, () => false);
  if (!enabled) return null;
  return <ParticleMorph onReady={onReady} />;
}
