import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Services } from "@/components/sections/Services";
import { HowIWork } from "@/components/sections/HowIWork";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      <ProofStrip />
      <Services />
      <HowIWork />
    </main>
  );
}
