import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.count >= 10) {
    return NextResponse.json({ ok: false, error: "Zu viele Versuche. Bitte in 15 Minuten erneut probieren." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Bitte E-Mail und Passwort prüfen." }, { status: 422 });

  const fail = () => {
    const cur = attempts.get(ip);
    if (!cur || cur.reset < now) attempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 });
    else cur.count += 1;
    return NextResponse.json({ ok: false, error: "E-Mail oder Passwort ist nicht korrekt." }, { status: 401 });
  };

  try {
    await ensureSeeded();
    const [user] = await db.select().from(employees).where(eq(employees.email, parsed.data.email)).limit(1);
    if (!user || !user.active) return fail();
    if (!verifyPassword(parsed.data.password, user.passwordHash)) return fail();
    const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
    await setSessionCookie(user.id, proto === "https");
    attempts.delete(ip);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ ok: false, error: "Anmeldung derzeit nicht möglich." }, { status: 500 });
  }
}
