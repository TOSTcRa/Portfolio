// Runs in `npm run prebuild` with Node 26 (native type stripping, no bundler).
// Refreshes src/content/profile.generated.json from the Freelancehunt API.
// Never fails the build: on any error the existing file is kept.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, "..", "src", "content", "profile.generated.json");
const FREELANCER_ID = 618668;

type ApiResponse = {
  data: {
    attributes: {
      completed_projects: number;
      success_rate: number;
      average_grade: number;
      positive_reviews: number;
      status: { id: number };
    };
  };
};

async function main() {
  const token = process.env.FREELANCEHUNT_TOKEN;
  if (!token) {
    console.log("profile: FREELANCEHUNT_TOKEN not set, keeping committed numbers");
    return;
  }
  const res = await fetch(`https://api.freelancehunt.com/v2/freelancers/${FREELANCER_ID}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse;
  const a = json.data.attributes;
  const profile = {
    completed: a.completed_projects,
    successRate: a.success_rate,
    averageGrade: a.average_grade,
    positiveReviews: a.positive_reviews,
    available: a.status.id === 10,
    fetchedAt: new Date().toISOString(),
  };
  const previous = JSON.parse(readFileSync(target, "utf8"));
  writeFileSync(target, JSON.stringify(profile, null, 2) + "\n");
  console.log(`profile: updated (${previous.completed} -> ${profile.completed} completed)`);
}

main().catch((err) => {
  console.warn(`profile: fetch failed (${err instanceof Error ? err.message : err}), keeping committed numbers`);
});
