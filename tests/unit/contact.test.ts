import { describe, it, expect, vi } from "vitest";
import { contactSchema, RateLimiter, sendTelegram, formatMessage } from "@/lib/contact";

const valid = { name: "Ольга", reply: "@olha", message: "Потрібно доробити каталог у магазині на OpenCart. Є дизайн.", website: "" };

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });
  it("rejects a short message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
});

describe("RateLimiter", () => {
  it("allows up to limit within the window, then blocks, then resets", () => {
    const rl = new RateLimiter(2, 1000);
    expect(rl.hit("a", 0)).toBe(true);
    expect(rl.hit("a", 10)).toBe(true);
    expect(rl.hit("a", 20)).toBe(false);
    expect(rl.hit("b", 20)).toBe(true);
    expect(rl.hit("a", 1001)).toBe(true);
  });
});

describe("sendTelegram", () => {
  it("posts to the bot API and resolves on 200", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    await sendTelegram({ token: "T", chatId: "C", text: "hello", fetchImpl });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/botT/sendMessage");
    expect(JSON.parse(init.body as string)).toMatchObject({ chat_id: "C", text: "hello" });
  });
  it("throws on non-2xx", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 500 }));
    await expect(sendTelegram({ token: "T", chatId: "C", text: "x", fetchImpl })).rejects.toThrow();
  });
});

describe("formatMessage", () => {
  it("includes all fields and meta", () => {
    const text = formatMessage(valid, { locale: "uk", ip: "1.2.3.4" });
    expect(text).toContain("Ольга");
    expect(text).toContain("@olha");
    expect(text).toContain("OpenCart");
    expect(text).toContain("uk");
  });
});
