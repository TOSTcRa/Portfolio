import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCases } from "@/content";
import type { Locale } from "@/content/schema";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Services } from "@/components/sections/Services";
import { WorkStack } from "@/components/sections/WorkStack";
import { ReviewsMarquee } from "@/components/sections/ReviewsMarquee";
import { HowIWork } from "@/components/sections/HowIWork";
import { Contact } from "@/components/sections/Contact";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  return (
    <main>
      <Hero />
      <ProofStrip />
      <Services />
      <WorkStack cases={getCases()} locale={locale as Locale} eyebrow={t("eyebrow")} title={t("title")} openLabel={t("open")} />
      <ReviewsMarquee />
      <HowIWork />
      <Contact />
    </main>
  );
}
