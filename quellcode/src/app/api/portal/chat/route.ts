import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { teamMessages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { listTeamMessages } from "@/lib/queries";
import { chatMessageSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  try {
    const messages = await listTeamMessages(100);
    return NextResponse.json({ ok: true, messages, me: user.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Nachrichten konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Nachricht darf nicht leer sein." }, { status: 422 });
  try {
    await db.insert(teamMessages).values({ employeeId: user.id, body: parsed.data.body });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Senden fehlgeschlagen." }, { status: 500 });
  }
}
