import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getCase, getCases } from "@/content";
import type { Locale } from "@/content/schema";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCases().map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const l = locale as Locale;
  return { title: c.title[l], description: c.summary[l] };
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const c = getCase(slug);
  if (!c) notFound();
  const t = await getTranslations("work");
  const all = getCases();
  const idx = all.findIndex((x) => x.slug === c.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  const budget = c.budgetUAH
    ? c.budgetUAH[0] === c.budgetUAH[1]
      ? t("budgetOne", { value: c.budgetUAH[0].toLocaleString(locale) })
      : t("budgetRange", { min: c.budgetUAH[0].toLocaleString(locale), max: c.budgetUAH[1].toLocaleString(locale) })
    : null;

  const sections = [
    { label: t("task"), paras: c.body.task[l] },
    { label: t("did"), paras: c.body.work[l] },
    { label: t("result"), paras: c.body.result[l] },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <PageTransition>
        <Link href="/#work" className="mb-10 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} /> {t("all")}
        </Link>
        <h1 className="max-w-[20ch] text-4xl font-semibold tracking-tight sm:text-5xl">{c.title[l]}</h1>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6 font-mono text-sm sm:grid-cols-4">
          <div>
            <dt className="text-fg-muted">{t("client")}</dt>
            <dd>{c.clientType[l]}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t("year")}</dt>
            <dd>{c.year}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t("stack")}</dt>
            <dd>{c.stack.join(", ")}</dd>
          </div>
          {budget && (
            <div>
              <dt className="text-fg-muted">{t("budget")}</dt>
              <dd>{budget}</dd>
            </div>
          )}
        </dl>

        {c.gallery && c.gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.gallery.map((img) => (
              <div key={img.src} className="relative aspect-video overflow-hidden rounded-md border border-line">
                <Image src={img.src} alt={img.alt[l]} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {sections.map((s) => (
            <section key={s.label} className="lg:col-span-8 lg:col-start-3">
              <h2 className="mb-3 text-xl font-medium">{s.label}</h2>
              <div className="flex max-w-[65ch] flex-col gap-3 text-fg-muted">
                {s.paras.map((p) => (
                  <p key={p} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {c.link && (
            <a href={c.link} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
              {t("link")} <ArrowUpRight size={16} />
            </a>
          )}
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary")}>
            {(await getTranslations("hero"))("ctaTelegram")}
          </a>
        </div>

        <nav className="mt-16 flex items-center justify-between border-t border-line pt-6 text-sm">
          <Link href={`/work/${prev.slug}`} className="inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            <ArrowLeft size={16} /> {t("prev")}
          </Link>
          <Link href={`/work/${next.slug}`} className="inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            {t("next")} <ArrowRight size={16} />
          </Link>
        </nav>
      </PageTransition>
    </main>
  );
}
