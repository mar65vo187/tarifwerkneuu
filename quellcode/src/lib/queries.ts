import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { advisors, employees, leadNotes, leads, teamMessages, type Advisor } from "@/db/schema";
import { SITE } from "@/lib/content";
import { ensureSeeded } from "@/lib/seed";

/* ------------------------------------------------------------------ */
/*  Advisors                                                           */
/* ------------------------------------------------------------------ */

export async function getActiveAdvisors(): Promise<Advisor[]> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(advisors)
      .where(eq(advisors.active, true))
      .orderBy(asc(advisors.sortOrder), asc(advisors.name));
    return rows.map((a) => a.slug === "marvin-egenolf" ? { ...a, email: SITE.email } : a);
  } catch {
    return [];
  }
}

export async function getAdvisorBySlug(slug: string): Promise<Advisor | null> {
  try {
    await ensureSeeded();
    const [a] = await db.select().from(advisors).where(and(eq(advisors.slug, slug), eq(advisors.active, true))).limit(1);
    return a ? (a.slug === "marvin-egenolf" ? { ...a, email: SITE.email } : a) : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Leads (portal)                                                     */
/* ------------------------------------------------------------------ */

export type LeadRow = typeof leads.$inferSelect & {
  advisorName: string | null;
  assignedName: string | null;
};

export async function listLeads(filter?: { status?: string; type?: string }) {
  const conditions = [];
  if (filter?.status) conditions.push(eq(leads.status, filter.status as typeof leads.status.enumValues[number]));
  if (filter?.type) conditions.push(eq(leads.type, filter.type as typeof leads.type.enumValues[number]));

  const rows = await db
    .select({
      lead: leads,
      advisorName: advisors.name,
      assignedName: employees.name,
    })
    .from(leads)
    .leftJoin(advisors, eq(leads.advisorId, advisors.id))
    .leftJoin(employees, eq(leads.assignedEmployeeId, employees.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(300);

  return rows.map((r) => ({ ...r.lead, advisorName: r.advisorName, assignedName: r.assignedName })) as LeadRow[];
}

export async function getLead(id: number) {
  const [row] = await db
    .select({ lead: leads, advisorName: advisors.name, assignedName: employees.name })
    .from(leads)
    .leftJoin(advisors, eq(leads.advisorId, advisors.id))
    .leftJoin(employees, eq(leads.assignedEmployeeId, employees.id))
    .where(eq(leads.id, id))
    .limit(1);
  if (!row) return null;
  return { ...row.lead, advisorName: row.advisorName, assignedName: row.assignedName } as LeadRow;
}

export async function getLeadNotes(leadId: number) {
  return db
    .select({
      id: leadNotes.id,
      body: leadNotes.body,
      kind: leadNotes.kind,
      createdAt: leadNotes.createdAt,
      authorName: employees.name,
    })
    .from(leadNotes)
    .leftJoin(employees, eq(leadNotes.employeeId, employees.id))
    .where(eq(leadNotes.leadId, leadId))
    .orderBy(asc(leadNotes.createdAt));
}

/* ------------------------------------------------------------------ */
/*  Dashboard-Statistiken                                              */
/* ------------------------------------------------------------------ */

export async function getDashboardStats() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [statusRows, typeRows, topicRows, recent, dailyRows] = await Promise.all([
    db.select({ status: leads.status, count: sql<number>`count(*)::int` }).from(leads).groupBy(leads.status),
    db.select({ type: leads.type, count: sql<number>`count(*)::int` }).from(leads).groupBy(leads.type),
    db
      .select({ topic: leads.topic, count: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.topic)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
    db
      .select({ lead: leads, advisorName: advisors.name, assignedName: employees.name })
      .from(leads)
      .leftJoin(advisors, eq(leads.advisorId, advisors.id))
      .leftJoin(employees, eq(leads.assignedEmployeeId, employees.id))
      .orderBy(desc(leads.createdAt))
      .limit(6),
    db
      .select({ day: sql<string>`to_char(${leads.createdAt}, 'YYYY-MM-DD')`, count: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, thirtyDaysAgo))
      .groupBy(sql`to_char(${leads.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${leads.createdAt}, 'YYYY-MM-DD')`),
  ]);

  const byStatus: Record<string, number> = {};
  for (const r of statusRows) byStatus[r.status] = r.count;
  const byType: Record<string, number> = {};
  for (const r of typeRows) byType[r.type] = r.count;

  const total = statusRows.reduce((s, r) => s + r.count, 0);
  const won = byStatus.abgeschlossen ?? 0;
  const lost = byStatus.verloren ?? 0;
  const decided = won + lost;

  // 14-Tage-Serie inkl. Nulltage
  const series: { day: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = dailyRows.find((r) => r.day === key);
    series.push({ day: key, label: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }), count: found?.count ?? 0 });
  }

  return {
    total,
    open: (byStatus.neu ?? 0) + (byStatus.kontaktiert ?? 0),
    confirmed: byStatus.termin_bestaetigt ?? 0,
    inConsult: byStatus.in_beratung ?? 0,
    won,
    conversion: decided ? Math.round((won / decided) * 100) : null,
    byStatus,
    byType,
    topics: topicRows.map((r) => ({ topic: r.topic ?? "Ohne Angabe", count: r.count })),
    recent: recent.map((r) => ({ ...r.lead, advisorName: r.advisorName, assignedName: r.assignedName })) as LeadRow[],
    series,
  };
}

/* ------------------------------------------------------------------ */
/*  Team-Chat                                                          */
/* ------------------------------------------------------------------ */

export async function listTeamMessages(limit = 100) {
  const rows = await db
    .select({
      id: teamMessages.id,
      body: teamMessages.body,
      createdAt: teamMessages.createdAt,
      employeeId: teamMessages.employeeId,
      authorName: employees.name,
    })
    .from(teamMessages)
    .leftJoin(employees, eq(teamMessages.employeeId, employees.id))
    .orderBy(desc(teamMessages.createdAt))
    .limit(limit);
  return rows.reverse();
}
