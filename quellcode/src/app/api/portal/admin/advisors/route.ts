import { NextResponse, type NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { advisors } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { advisorUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ ok: false, error: "Nur Administratoren." }, { status: 403 });

  try {
    const rows = await db.select().from(advisors).orderBy(asc(advisors.sortOrder), asc(advisors.name));
    return NextResponse.json({ ok: true, advisors: rows });
  } catch (err) {
    console.error("[portal/admin/advisors GET]", err);
    return NextResponse.json({ ok: false, error: "Berater konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ ok: false, error: "Nur Administratoren." }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = advisorUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." }, { status: 422 });
  }

  try {
    const { id, ...values } = parsed.data;
    const allowed = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== undefined)
    ) as Partial<typeof advisors.$inferInsert>;

    if (allowed.image === "") allowed.image = null;
    if (allowed.email === "") allowed.email = null;
    if (allowed.phone === "") allowed.phone = null;
    if (allowed.whatsapp === "") allowed.whatsapp = null;
    if (allowed.quote === "") allowed.quote = null;

    const [updated] = await db.update(advisors).set(allowed).where(eq(advisors.id, id)).returning();
    if (!updated) return NextResponse.json({ ok: false, error: "Berater nicht gefunden." }, { status: 404 });
    return NextResponse.json({ ok: true, advisor: updated });
  } catch (err) {
    console.error("[portal/admin/advisors PATCH]", err);
    return NextResponse.json({ ok: false, error: "Berater konnte nicht aktualisiert werden." }, { status: 500 });
  }
}
