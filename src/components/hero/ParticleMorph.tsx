"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { shape, SHAPE_NAMES } from "@/lib/shapes";

// A solid-looking object built from thousands of lit cubes (InstancedMesh) that morphs between
// the four service shapes, tilts toward the cursor and scatters on scroll. Full-bleed behind the hero text.

const HOLD_MS = 3200;
const MORPH_MS = 1400;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function readAccent(): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
  return new THREE.Color(raw || "#34d399");
}
function isDark(): boolean {
  return document.documentElement.getAttribute("data-theme") !== "light";
}

type Props = { onReady?: () => void };

export default function ParticleMorph({ onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mobile = window.innerWidth < 1024;
    const count = mobile ? 1600 : 3200;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0" });
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // Lights: soft white key, emerald fill from below-right, cool rim from behind.
    const accent = readAccent();
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(accent, 40, 12, 1.6);
    fill.position.set(2.5, -1.5, 2.5);
    scene.add(fill);
    const rim = new THREE.PointLight(0x9bb8ff, 18, 14, 1.4);
    rim.position.set(-2, 2, -3);
    scene.add(rim);

    const shapes = SHAPE_NAMES.map((n) => shape(n, count));
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();
    const scaleFor = mobile ? 0.85 : 0.92;

    // One box, instanced `count` times. All per-instance motion happens in the vertex shader:
    // the CPU only swaps the from/to buffers once per morph and updates a few uniforms.
    const box = new THREE.BoxGeometry(0.075, 0.075, 0.075);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = box.index;
    geometry.attributes.position = box.attributes.position;
    geometry.attributes.normal = box.attributes.normal;
    geometry.attributes.uv = box.attributes.uv;
    geometry.instanceCount = count;
    const fromAttr = new THREE.InstancedBufferAttribute(shapes[0].slice(), 3);
    const toAttr = new THREE.InstancedBufferAttribute(shapes[1].slice(), 3);
    fromAttr.setUsage(THREE.DynamicDrawUsage);
    toAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("aFrom", fromAttr);
    geometry.setAttribute("aTo", toAttr);
    geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));

    const uniforms = {
      uMix: { value: 0 },
      uSpread: { value: 0 },
      uTime: { value: 0 },
      uScale: { value: scaleFor },
    };
    const material = new THREE.MeshStandardMaterial({
      color: isDark() ? 0x2a2a30 : 0xdcdce2,
      metalness: 0.55,
      roughness: 0.35,
      emissive: accent,
      emissiveIntensity: 0.12,
      transparent: true,
    });
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          attribute vec3 aFrom;
          attribute vec3 aTo;
          attribute float aSeed;
          uniform float uMix;
          uniform float uSpread;
          uniform float uTime;
          uniform float uScale;`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vec3 p = mix(aFrom, aTo, uMix) * uScale;
          p.y += 0.03 * sin(uTime * 1.4 + aSeed * 12.0);
          vec3 dir = normalize(p + 0.0001);
          p += dir * uSpread * 3.0 * (0.5 + aSeed);
          transformed = transformed * (0.85 + aSeed * 0.3) + p;`,
        );
    };
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;

    const group = new THREE.Group();
    group.add(mesh);
    // Push the object to the right on desktop so the headline sits over empty space.
    group.position.x = mobile ? 0 : 2.05;
    group.position.y = mobile ? 0.5 : 0.15;
    scene.add(group);

    let current = 0;
    let spread = 0;

    function applyTheme() {
      const a = readAccent();
      fill.color = a;
      material.emissive = a;
      material.color = new THREE.Color(isDark() ? 0x2a2a30 : 0xdcdce2);
      material.needsUpdate = true;
    }
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function resize() {
      const w = el!.clientWidth || 1;
      const h = el!.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    function onPointerMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      pointerTarget.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    }
    function onPointerLeave() {
      pointerTarget.set(0, 0);
    }
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let last = performance.now();
    let phaseStart = last;
    let morphing = false;
    let ready = false;
    let time = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      time += dt;

      const elapsed = now - phaseStart;
      if (!morphing && elapsed > HOLD_MS) {
        morphing = true;
        phaseStart = now;
      } else if (morphing) {
        const t = Math.min(1, elapsed / MORPH_MS);
        uniforms.uMix.value = easeInOutCubic(t);
        if (t >= 1) {
          current = (current + 1) % shapes.length;
          (fromAttr.array as Float32Array).set(shapes[current]);
          (toAttr.array as Float32Array).set(shapes[(current + 1) % shapes.length]);
          fromAttr.needsUpdate = true;
          toAttr.needsUpdate = true;
          uniforms.uMix.value = 0;
          morphing = false;
          phaseStart = now;
        }
      }

      // Scroll: scatter and fade as the hero leaves the viewport. Read in rAF, no scroll listener.
      const rect = el!.getBoundingClientRect();
      const spreadTarget = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)));
      spread += (spreadTarget - spread) * 0.08;
      uniforms.uSpread.value = spread;
      material.opacity = 1 - spread * 0.9;
      uniforms.uTime.value = time;

      pointer.lerp(pointerTarget, 0.06);
      group.rotation.y = time * 0.18 + pointer.x * 0.35;
      group.rotation.x = -pointer.y * 0.25 + Math.sin(time * 0.4) * 0.05;

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
      box.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={ref} className="absolute inset-0" aria-hidden />;
}
