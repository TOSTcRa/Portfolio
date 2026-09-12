import { cases } from "./cases";
import { reviews } from "./reviews";
import { loadProfile } from "./profile";
import { caseSchema, reviewSchema, type Case, type Review, type Profile, type Locale } from "./schema";

const validatedCases: Case[] = cases
  .map((c) => caseSchema.parse(c))
  .sort((a, b) => a.order - b.order);

const validatedReviews: Review[] = reviews
  .map((r) => reviewSchema.parse(r))
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getCases(): Case[] {
  return validatedCases;
}

export function getCase(slug: string): Case | undefined {
  return validatedCases.find((c) => c.slug === slug);
}

export function getReviews(): Review[] {
  return validatedReviews;
}

export function getProfile(): Profile {
  return loadProfile();
}

export type { Case, Review, Profile };

// Slim, pre-localized shape for client-side cards so full case bodies never reach the RSC payload.
export type CaseCardData = {
  slug: string;
  year: number;
  clientType: string;
  title: string;
  summary: string;
  stack: string[];
  cover?: { src: string; alt: string };
};

export function toCardData(c: Case, locale: Locale): CaseCardData {
  return {
    slug: c.slug,
    year: c.year,
    clientType: c.clientType[locale],
    title: c.title[locale],
    summary: c.summary[locale],
    stack: c.stack,
    cover: c.cover ? { src: c.cover.src, alt: c.cover.alt[locale] } : undefined,
  };
}
