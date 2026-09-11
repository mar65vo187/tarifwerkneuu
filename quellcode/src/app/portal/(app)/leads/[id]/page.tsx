import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { LeadActions } from "@/components/portal/LeadActions";
import { Card, StatusBadge, TypeBadge, formatDate } from "@/components/portal/ui";
import { getLead, getLeadNotes } from "@/lib/queries";
import { SITUATIONS } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const lead = await getLead(id);
  if (!lead) notFound();
  const notes = await getLeadNotes(id);
  const situation = SITUATIONS.find((s) => s.value === lead.situation)?.label ?? lead.situation;
  const waDigits = lead.phone?.replace(/[^\d+]/g, "").replace(/^\+/, "").replace(/^0/, "49");
  const meta = (lead.meta ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <Link href="/portal/leads" className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-steel hover:text-ink"><ArrowLeft className="h-4 w-4" /> Zurück zur Liste</Link>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><TypeBadge type={lead.type} /><StatusBadge status={lead.status} /><span className="text-[12.5px] text-steel">#{lead.id}</span></div>
          <h1 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">{lead.name}</h1>
          <p className="text-[14px] text-steel">Eingegangen {formatDate(lead.createdAt)} · Quelle: {lead.source ?? "website"}{lead.advisorName ? ` · Wunschberater: ${lead.advisorName}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {waDigits && <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-[13.5px] font-semibold text-ink-900"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13.5px] font-semibold"><Phone className="h-4 w-4" /> {lead.phone}</a>}
          <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13.5px] font-semibold"><Mail className="h-4 w-4" /> E-Mail</a>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <h2 className="text-[15px] font-extrabold">Anfrage</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
              {[
                ["Thema", lead.topic],
                ["Region", lead.region],
                ["Situation", situation],
                ["Wunschkanal", lead.preferredChannel],
                ["Wunschzeit", lead.preferredTime],
                ["E-Mail", lead.email],
                ["Telefon", lead.phone],
                ["Bearbeitet von", lead.assignedName ?? "noch niemand"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-steel">{k}</dt>
                  <dd className="mt-0.5 font-medium text-ink">{(v as string | null) || "–"}</dd>
                </div>
              ))}
              {typeof meta.job === "string" && meta.job && (
                <div><dt className="text-[12px] font-semibold uppercase tracking-wider text-steel">Aktueller Beruf</dt><dd className="mt-0.5 font-medium">{meta.job}</dd></div>
              )}
            </dl>
            {lead.message && (
              <div className="mt-5 rounded-xl bg-paper p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-steel">Nachricht</p>
                <p className="mt-1 whitespace-pre-line text-[14.5px] leading-relaxed">{lead.message}</p>
              </div>
            )}
            {lead.confirmedSlot && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[14px] text-emerald-900">
                <span className="font-bold">Bestätigter Termin:</span> {lead.confirmedSlot} <span className="text-emerald-800/70">(bestätigt am {formatDate(lead.confirmedAt)})</span>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-[15px] font-extrabold">Verlauf</h2>
            <ol className="mt-4 space-y-3">
              {notes.map((n) => (
                <li key={n.id} className={`rounded-xl p-3 text-[14px] ${n.kind === "system" ? "bg-paper text-steel" : "border border-line bg-white"}`}>
                  <p className={n.kind === "system" ? "" : "whitespace-pre-line text-ink"}>{n.body}</p>
                  <p className="mt-1 text-[11.5px] text-steel">{formatDate(n.createdAt)}{n.authorName ? ` · ${n.authorName}` : ""}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-[15px] font-extrabold">Bearbeiten</h2>
            <div className="mt-4">
              <LeadActions leadId={lead.id} status={lead.status} confirmedSlot={lead.confirmedSlot} assigned={Boolean(lead.assignedEmployeeId)} isAppointment={lead.type === "termin"} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
