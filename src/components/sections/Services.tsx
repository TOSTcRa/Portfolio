import { getTranslations } from "next-intl/server";
import { Storefront, Code, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";
import { KineticHeading } from "@/components/motion/KineticHeading";

const items = [
  { key: "shops", Icon: Storefront, span: "lg:col-span-7", tinted: true },
  { key: "react", Icon: Code, span: "lg:col-span-5", tinted: false },
  { key: "automation", Icon: Robot, span: "lg:col-span-5", tinted: false },
  { key: "security", Icon: ShieldCheck, span: "lg:col-span-7", tinted: true },
] as const;

export async function Services() {
  const t = await getTranslations("services");
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <KineticHeading text={t("title")} className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 0.06} className={item.span}>
            <article
              className={`flex h-full flex-col gap-4 rounded-md border border-line p-6 ${item.tinted ? "bg-bg-raised" : "bg-transparent"}`}
            >
              <item.Icon size={24} className="text-accent" />
              <h3 className="text-lg font-medium">{t(`items.${item.key}.title`)}</h3>
              <p className="max-w-[60ch] text-sm leading-relaxed text-fg-muted">{t(`items.${item.key}.body`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
