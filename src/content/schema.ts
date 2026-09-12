import { z } from "zod";

export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

const noDashes = (s: string) => !/[–—]/.test(s);
const text = z.string().min(1).refine(noDashes, "no em/en dashes in visible text");

export const localizedSchema = z.object({ uk: text, en: text });
export type Localized = z.infer<typeof localizedSchema>;

export const localizedTextSchema = z.object({
  uk: z.array(text).min(1),
  en: z.array(text).min(1),
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

const imageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: localizedSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ContentImage = z.infer<typeof imageSchema>;

export const caseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  year: z.number().int().min(2020).max(2100),
  clientType: localizedSchema,
  title: localizedSchema,
  summary: localizedSchema,
  stack: z.array(z.string().min(1)).min(1).max(8),
  cover: imageSchema.optional(),
  gallery: z.array(imageSchema).optional(),
  link: z.string().url().optional(),
  budgetUAH: z.tuple([z.number().int().positive(), z.number().int().positive()]).optional(),
  body: z.object({
    task: localizedTextSchema,
    work: localizedTextSchema,
    result: localizedTextSchema,
  }),
});
export type Case = z.infer<typeof caseSchema>;

export const reviewSchema = z.object({
  id: z.number().int().positive(),
  author: text,
  company: z.string().optional(),
  projectName: text,
  quote: text.max(240),
  lang: z.enum(["uk", "ru"]),
  grade: z.number().min(0).max(10),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  url: z.string().url(),
});
export type Review = z.infer<typeof reviewSchema>;

export const profileSchema = z.object({
  completed: z.number().int().nonnegative(),
  successRate: z.number().min(0).max(100),
  averageGrade: z.number().min(0).max(10),
  positiveReviews: z.number().int().nonnegative(),
  available: z.boolean(),
  fetchedAt: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;
