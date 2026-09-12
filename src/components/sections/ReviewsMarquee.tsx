import { getTranslations } from "next-intl/server";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { getReviews, type Review } from "@/content";
import { site } from "@/lib/site";

function Card({ r, hidden }: { r: Review; hidden: boolean }) {
  return (
    <figure
      data-review={hidden ? undefined : r.id}
      aria-hidden={hidden || undefined}
      lang={r.lang}
      className="flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-md border border-line bg-bg-raised p-5 sm:w-[380px]"
    >
      <blockquote className="line-clamp-3 text-sm leading-relaxed">
        <span aria-hidden>&ldquo;</span>
        {r.quote}
        <span aria-hidden>&rdquo;</span>
      </blockquote>
      <figcaption className="flex items-end justify-between gap-3 text-xs text-fg-muted">
        <span>
          <span className="block text-fg">{r.author}{r.company ? `, ${r.company}` : ""}</span>
          <span className="line-clamp-1">{r.projectName}</span>
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-accent">
          <Star size={12} weight="fill" /> {r.grade}
        </span>
      </figcaption>
    </figure>
  );
}

export async function ReviewsMarquee() {
  const t = await getTranslations("reviews");
  const reviews = getReviews();
  return (
    <section id="reviews" className="cv-auto scroll-mt-16 border-t border-line py-24">
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-4 px-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
        <a href={site.freelancehunt} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted underline underline-offset-4 hover:text-fg">
          {t("source")}
        </a>
      </div>
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max gap-4 px-4">
          {reviews.map((r) => (
            <Card key={r.id} r={r} hidden={false} />
          ))}
          {reviews.map((r) => (
            <Card key={`dup-${r.id}`} r={r} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
