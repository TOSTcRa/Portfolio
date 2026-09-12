"use client";
import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "reply" | "message", string>>;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    if (String(fd.get("name") ?? "").trim().length < 2) e.name = t("errName");
    if (String(fd.get("reply") ?? "").trim().length < 3) e.reply = t("errReply");
    if (String(fd.get("message") ?? "").trim().length < 20) e.message = t("errMessage");
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-locale": locale },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-md border border-line bg-bg px-3 py-2 text-fg placeholder:text-fg-muted/70 focus-visible:border-accent";
  const label = "text-sm text-fg-muted";
  const err = "text-xs text-red-500";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.p
          key="ok"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-line bg-bg-raised p-6 text-fg"
          role="status"
        >
          {t("success")}
        </motion.p>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={label}>{t("name")}</label>
            <input id="name" name="name" autoComplete="name" className={field} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-err" : undefined} />
            {errors.name && <p id="name-err" className={err}>{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="reply" className={label}>{t("reply")}</label>
            <input id="reply" name="reply" autoComplete="email" className={field} aria-invalid={Boolean(errors.reply)} aria-describedby={errors.reply ? "reply-err" : undefined} />
            {errors.reply && <p id="reply-err" className={err}>{errors.reply}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className={label}>{t("message")}</label>
            <textarea id="message" name="message" rows={5} className={field} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-err" : undefined} />
            {errors.message && <p id="message-err" className={err}>{errors.message}</p>}
          </div>
          <div className="absolute -left-[9999px] top-0" aria-hidden>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === "submitting"} className={`${buttonClasses("primary")} disabled:opacity-60`}>
              {status === "submitting" ? t("sending") : t("send")}
            </button>
            {status === "error" && (
              <p role="alert" className="text-sm text-fg-muted">
                {t("error")}{" "}
                <a href={site.telegram} className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
