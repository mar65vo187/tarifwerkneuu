import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { LEAD_STATUS_LABELS } from "@/lib/content";
import { leadUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });

  const { id: rawId } = await ctx.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ ok: false, error: "Ungültige ID." }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Ungültige Daten." }, { status: 422 });
  const data = parsed.data;

  try {
    const [existing] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (!existing) return NextResponse.json({ ok: false, error: "Anfrage nicht gefunden." }, { status: 404 });

    const patch: Partial<typeof leads.$inferInsert> = { updatedAt: new Date() };
    const systemNotes: string[] = [];

    if (data.assignToMe) {
      patch.assignedEmployeeId = user.id;
      systemNotes.push(`${user.name} hat die Anfrage übernommen.`);
    }
    if (data.status && data.status !== existing.status) {
      patch.status = data.status;
      systemNotes.push(`Status geändert: ${LEAD_STATUS_LABELS[existing.status]} → ${LEAD_STATUS_LABELS[data.status]}.`);
      if (data.status === "termin_bestaetigt") {
        patch.confirmedAt = new Date();
        if (data.confirmedSlot) patch.confirmedSlot = data.confirmedSlot;
        systemNotes.push(`Termin bestätigt${data.confirmedSlot ? `: ${data.confirmedSlot}` : ""}.`);
      }
      if (!existing.assignedEmployeeId && !data.assignToMe) patch.assignedEmployeeId = user.id;
    } else if (data.confirmedSlot && data.confirmedSlot !== existing.confirmedSlot) {
      patch.confirmedSlot = data.confirmedSlot;
      systemNotes.push(`Terminzeit aktualisiert: ${data.confirmedSlot}.`);
    }

    await db.update(leads).set(patch).where(eq(leads.id, id));

    if (systemNotes.length) {
      await db.insert(leadNotes).values(systemNotes.map((body) => ({ leadId: id, employeeId: user.id, kind: "system", body })));
    }
    if (data.note && data.note.trim()) {
      await db.insert(leadNotes).values({ leadId: id, employeeId: user.id, kind: "note", body: data.note.trim() });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[portal/leads PATCH]", err);
    return NextResponse.json({ ok: false, error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
