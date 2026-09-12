import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  reply: z.string().trim().min(3).max(120),
  message: z.string().trim().min(20).max(2000),
  website: z.string().max(0), // honeypot: bots fill it, humans never see it
});
export type ContactInput = z.infer<typeof contactSchema>;

export class RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(private limit: number, private windowMs: number) {}

  hit(key: string, now: number = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export function formatMessage(data: ContactInput, meta: { locale?: string; ip?: string }): string {
  return [
    "New message from the portfolio site",
    `Name: ${data.name}`,
    `Reply to: ${data.reply}`,
    `Locale: ${meta.locale ?? "?"}  IP: ${meta.ip ?? "?"}`,
    "",
    data.message,
  ].join("\n");
}

export async function sendTelegram(input: { token: string; chatId: string; text: string; fetchImpl?: typeof fetch }): Promise<void> {
  const f = input.fetchImpl ?? fetch;
  const res = await f(`https://api.telegram.org/bot${input.token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: input.chatId, text: input.text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

export function contactEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}
