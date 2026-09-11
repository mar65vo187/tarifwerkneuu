import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { advisors, leadNotes, leads } from "@/db/schema";
import { leadSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/* Einfaches In-Memory-Rate-Limit (Best-Effort pro Instanz) */
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 8;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ ok: false, error: first?.message ?? "Bitte prüfe deine Angaben.", field: first?.path?.[0] }, { status: 422 });
  }
  const data = parsed.data;

  // Honeypot gefüllt → still akzeptieren, aber nicht speichern
  if (data.website) return NextResponse.json({ ok: true, id: 0 });

  try {
    let advisorId: number | null = null;
    if (data.advisorSlug) {
      const [a] = await db.select({ id: advisors.id }).from(advisors).where(eq(advisors.slug, data.advisorSlug)).limit(1);
      advisorId = a?.id ?? null;
    }

    const [created] = await db
      .insert(leads)
      .values({
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        topic: data.topic || null,
        region: data.region || null,
        situation: data.situation || null,
        message: data.message || null,
        preferredChannel: data.preferredChannel || null,
        preferredTime: data.preferredTime || null,
        advisorId,
        source: data.source || "website",
        meta: { ...(data.meta ?? {}), userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? null },
      })
      .returning({ id: leads.id });

    await db.insert(leadNotes).values({
      leadId: created.id,
      kind: "system",
      body: `Anfrage über die Website eingegangen (${data.type}).`,
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[leads] insert failed", err);
    return NextResponse.json({ ok: false, error: "Die Anfrage konnte gerade nicht gespeichert werden. Bitte versuche es erneut oder schreib uns per WhatsApp." }, { status: 500 });
  }
}
