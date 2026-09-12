import { NextResponse } from "next/server";
import { contactSchema, contactEnabled, formatMessage, RateLimiter, sendTelegram } from "@/lib/contact";

const limiter = new RateLimiter(5, 60 * 60 * 1000);

export async function POST(req: Request) {
  if (!contactEnabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.hit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const locale = req.headers.get("x-locale") ?? undefined;
  try {
    await sendTelegram({
      token: process.env.TELEGRAM_BOT_TOKEN!,
      chatId: process.env.TELEGRAM_CHAT_ID!,
      text: formatMessage(parsed.data, { locale, ip }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
