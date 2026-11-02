import { describe, it, expect } from "vitest";
import { getCases, getCase, getReviews, getProfile } from "@/content";
import { caseSchema, reviewSchema, profileSchema } from "@/content/schema";

const DASHES = /[–—]/;

describe("cases", () => {
  it("has at least 7 cases with unique slugs", () => {
    const cases = getCases();
    expect(cases.length).toBeGreaterThanOrEqual(7);
    expect(new Set(cases.map((c) => c.slug)).size).toBe(cases.length);
  });
  it("all cases validate and have both locales", () => {
    for (const c of getCases()) {
      expect(() => caseSchema.parse(c)).not.toThrow();
      expect(c.title.uk.length).toBeGreaterThan(0);
      expect(c.title.en.length).toBeGreaterThan(0);
      expect(c.body.task.uk.length).toBeGreaterThan(0);
      expect(c.body.task.en.length).toBeGreaterThan(0);
    }
  });
  it("is sorted by order ascending", () => {
    const orders = getCases().map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
  it("getCase returns by slug and undefined for unknown", () => {
    expect(getCase(getCases()[0].slug)).toBeDefined();
    expect(getCase("nope")).toBeUndefined();
  });
  it("contains no em or en dashes in visible text", () => {
    const text = JSON.stringify(getCases());
    expect(DASHES.test(text)).toBe(false);
  });
});

describe("reviews", () => {
  it("has 16 validated reviews, newest first", () => {
    const reviews = getReviews();
    expect(reviews.length).toBe(16);
    for (const r of reviews) expect(() => reviewSchema.parse(r)).not.toThrow();
    const dates = reviews.map((r) => r.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it("contains no em or en dashes", () => {
    expect(DASHES.test(JSON.stringify(getReviews()))).toBe(false);
  });
});

describe("profile", () => {
  it("validates and has sane numbers", () => {
    const p = getProfile();
    expect(() => profileSchema.parse(p)).not.toThrow();
    expect(p.completed).toBeGreaterThanOrEqual(27);
    expect(p.successRate).toBe(100);
  });
});
