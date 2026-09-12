import { getTranslations } from "next-intl/server";
import { TelegramLogo, EnvelopeSimple, GithubLogo, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { getProfile } from "@/content";
import { contactEnabled } from "@/lib/contact";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";
import { KineticHeading } from "@/components/motion/KineticHeading";

export async function Contact() {
  const t = await getTranslations("contact");
  const tHero = await getTranslations("hero");
  const p = getProfile();
  const links = [
    { href: site.telegram, label: tHero("ctaTelegram"), Icon: TelegramLogo, primary: true },
    { href: `mailto:${site.email}`, label: site.email, Icon: EnvelopeSimple, primary: false },
    { href: site.github, label: t("github"), Icon: GithubLogo, primary: false },
    { href: site.freelancehunt, label: t("freelancehunt"), Icon: Briefcase, primary: false },
  ];
  return (
    <section id="contact" className="cv-auto scroll-mt-16 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{t("eyebrow")}</span>
          <KineticHeading text={t("title")} className="text-3xl font-semibold tracking-tight sm:text-4xl" />
          <p className="text-sm text-fg-muted">{p.available ? t("available") : t("busy")}</p>
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 ${l.primary ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  <l.Icon size={20} className={l.primary ? "text-accent" : undefined} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        {contactEnabled() && (
          <Reveal delay={0.1} className="relative lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </Reveal>
        )}
      </div>
    </section>
  );
}
