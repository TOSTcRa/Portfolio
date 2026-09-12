import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col items-start justify-center gap-6 px-4">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <Link href="/" className="text-accent underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}
