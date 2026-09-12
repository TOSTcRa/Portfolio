import { describe, it, expect } from "vitest";
import { shape, SHAPE_NAMES } from "@/lib/shapes";

describe("shape", () => {
  for (const name of SHAPE_NAMES) {
    it(`${name}: returns n*3 finite coordinates inside the unit-ish box`, () => {
      const n = 500;
      const out = shape(name, n);
      expect(out.length).toBe(n * 3);
      let max = 0;
      for (const v of out) {
        expect(Number.isFinite(v)).toBe(true);
        max = Math.max(max, Math.abs(v));
      }
      expect(max).toBeLessThanOrEqual(1.6);
      expect(max).toBeGreaterThan(0.5);
    });
  }
  it("is deterministic for the same seed", () => {
    expect(Array.from(shape("shield", 50))).toEqual(Array.from(shape("shield", 50)));
  });
});
