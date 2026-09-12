import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">
        {t("headline1")} {t("headline2")}
      </h1>
    </main>
  );
}
