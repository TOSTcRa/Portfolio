"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { shape, SHAPE_NAMES } from "@/lib/shapes";

const HOLD_MS = 3000;
const MORPH_MS = 1200;

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uMix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  varying float vAlpha;
  void main() {
    vec3 p = mix(position, aTarget, uMix);
    p += 0.025 * vec3(sin(uTime * 1.3 + aSeed * 6.28), cos(uTime * 1.1 + aSeed * 3.1), sin(uTime * 0.9 + aSeed * 9.4));
    p += normalize(p + 0.0001) * uSpread * 2.5 * (0.4 + aSeed);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec2 d = mv.xy - uPointer;
    float push = smoothstep(0.8, 0.0, length(d)) * 0.35;
    mv.xy += normalize(d + 0.0001) * push;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + 2.2 * aSeed) * uPixelRatio * (3.2 / -mv.z);
    vAlpha = (1.0 - uSpread) * (0.35 + 0.65 * aSeed);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.15, d) * vAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function readAccent(): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
  return new THREE.Color(raw || "#34d399");
}

type Props = { onReady?: () => void };

export default function ParticleMorph({ onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const count = window.innerWidth < 768 ? 5000 : 12000;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.6;

    const shapes = SHAPE_NAMES.map((n) => shape(n, count));
    let current = 0;
    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(shapes[0].slice(), 3);
    const targetAttr = new THREE.BufferAttribute(shapes[1].slice(), 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("aTarget", targetAttr);
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSpread: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uPointer: { value: new THREE.Vector2(99, 99) },
        uColor: { value: readAccent() },
      },
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Keep the accent in sync with the theme toggle.
    const themeObserver = new MutationObserver(() => {
      material.uniforms.uColor.value = readAccent();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let width = 1;
    let height = 1;
    function resize() {
      width = el!.clientWidth || 1;
      height = el!.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Pointer in view space on the z=0 plane, so the shader can push particles away.
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const pointerTarget = new THREE.Vector2(99, 99);
    function onPointerMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointerTarget.set(nx * halfH * camera.aspect, ny * halfH);
    }
    function onPointerLeave() {
      pointerTarget.set(99, 99);
    }
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    function onVisibility() {
      visible = !document.hidden;
    }
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let last = performance.now();
    let phaseStart = last;
    let morphing = false;
    let ready = false;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;

      // Morph cycle: hold, then ease to the next shape, then swap buffers.
      const elapsed = now - phaseStart;
      if (!morphing && elapsed > HOLD_MS) {
        morphing = true;
        phaseStart = now;
      } else if (morphing) {
        const t = Math.min(1, elapsed / MORPH_MS);
        material.uniforms.uMix.value = easeInOutCubic(t);
        if (t >= 1) {
          current = (current + 1) % shapes.length;
          (posAttr.array as Float32Array).set(shapes[current]);
          (targetAttr.array as Float32Array).set(shapes[(current + 1) % shapes.length]);
          posAttr.needsUpdate = true;
          targetAttr.needsUpdate = true;
          material.uniforms.uMix.value = 0;
          morphing = false;
          phaseStart = now;
        }
      }

      // Scroll spread: how far the hero box has scrolled past the top. No scroll listener.
      const rect = el!.getBoundingClientRect();
      const spread = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      material.uniforms.uSpread.value += (spread - material.uniforms.uSpread.value) * 0.1;

      const p = material.uniforms.uPointer.value as THREE.Vector2;
      p.lerp(pointerTarget, 0.15);
      material.uniforms.uTime.value += dt;
      points.rotation.y += dt * 0.15;
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady?.();
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={ref} className="absolute inset-0" aria-hidden />;
}
