import { NextResponse, type NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { advisors, employees } from "@/db/schema";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { employeeCreateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ ok: false, error: "Nur Administratoren." }, { status: 403 });

  try {
    const rows = await db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        role: employees.role,
        advisorId: employees.advisorId,
        active: employees.active,
        createdAt: employees.createdAt,
        advisorName: advisors.name,
      })
      .from(employees)
      .leftJoin(advisors, eq(employees.advisorId, advisors.id))
      .orderBy(desc(employees.createdAt));

    return NextResponse.json({ ok: true, employees: rows });
  } catch (err) {
    console.error("[portal/admin/employees GET]", err);
    return NextResponse.json({ ok: false, error: "Mitarbeiter konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ ok: false, error: "Nur Administratoren." }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = employeeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." }, { status: 422 });
  }

  try {
    const existing = await db.select({ id: employees.id }).from(employees).where(eq(employees.email, parsed.data.email)).limit(1);
    if (existing[0]) {
      return NextResponse.json({ ok: false, error: "Diese E-Mail wird bereits verwendet." }, { status: 409 });
    }

    const [created] = await db
      .insert(employees)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: hashPassword(parsed.data.password),
        role: parsed.data.role,
        advisorId: parsed.data.advisorId ?? null,
        active: parsed.data.active,
      })
      .returning();

    const [advisor] = parsed.data.advisorId ? await db.select({ name: advisors.name }).from(advisors).where(eq(advisors.id, parsed.data.advisorId)).limit(1) : [null];

    return NextResponse.json({
      ok: true,
      employee: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        advisorId: created.advisorId,
        active: created.active,
        createdAt: created.createdAt,
        advisorName: advisor?.name ?? null,
      },
    });
  } catch (err) {
    console.error("[portal/admin/employees POST]", err);
    return NextResponse.json({ ok: false, error: "Mitarbeiter konnte nicht angelegt werden." }, { status: 500 });
  }
}
