import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, StatusBadge, TypeBadge, formatDate } from "@/components/portal/ui";
import { LEAD_STATUS_LABELS, LEAD_TYPE_LABELS } from "@/lib/content";
import { listLeads } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUSES = Object.keys(LEAD_STATUS_LABELS);
const TYPES = Object.keys(LEAD_TYPE_LABELS);

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; type?: string }> }) {
  const { status, type } = await searchParams;
  const s = status && STATUSES.includes(status) ? status : undefined;
  const t = type && TYPES.includes(type) ? type : undefined;
  const rows = await listLeads({ status: s, type: t });

  const link = (next: { status?: string; type?: string }) => {
    const p = new URLSearchParams();
    const ns = "status" in next ? next.status : s;
    const nt = "type" in next ? next.type : t;
    if (ns) p.set("status", ns);
    if (nt) p.set("type", nt);
    return `/portal/leads${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow text-electric-deep">Anfragen & Termine</p>
        <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">Lead-Verwaltung</h1>
      </header>

      <div className="flex flex-col gap-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Link href={link({ status: undefined })} className={`chip h-9 shrink-0 px-3.5 ${!s ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-700"}`}>Alle Status</Link>
          {STATUSES.map((k) => (
            <Link key={k} href={link({ status: k })} className={`chip h-9 shrink-0 px-3.5 ${s === k ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-700"}`}>{LEAD_STATUS_LABELS[k]}</Link>
          ))}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Link href={link({ type: undefined })} className={`chip h-9 shrink-0 px-3.5 ${!t ? "border-electric bg-electric text-white" : "border-line bg-white text-ink-700"}`}>Alle Arten</Link>
          {TYPES.map((k) => (
            <Link key={k} href={link({ type: k })} className={`chip h-9 shrink-0 px-3.5 ${t === k ? "border-electric bg-electric text-white" : "border-line bg-white text-ink-700"}`}>{LEAD_TYPE_LABELS[k]}</Link>
          ))}
        </div>
      </div>

      <Card className="p-0 sm:p-0">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-[14.5px] text-steel">Keine Anfragen für diese Auswahl.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((l) => (
              <li key={l.id}>
                <Link href={`/portal/leads/${l.id}`} className="grid gap-3 px-5 py-4 transition-colors hover:bg-paper sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15.5px] font-bold">{l.name}</p>
                      <span className="text-[12px] text-steel">#{l.id}</span>
                      {l.status === "neu" && <span className="h-2 w-2 rounded-full bg-electric" aria-label="neu" />}
                    </div>
                    <p className="mt-0.5 truncate text-[13.5px] text-steel">
                      {l.topic ?? "Ohne Thema"} · {l.region ?? "Region offen"} · {l.preferredChannel ?? "Kanal offen"}
                      {l.preferredTime ? ` · Wunsch: ${l.preferredTime}` : ""}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-steel">
                      {formatDate(l.createdAt)}{l.advisorName ? ` · für ${l.advisorName}` : ""}{l.assignedName ? ` · bearbeitet von ${l.assignedName}` : " · noch nicht übernommen"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <TypeBadge type={l.type} />
                    <StatusBadge status={l.status} />
                    <ArrowRight className="hidden h-4 w-4 text-steel sm:block" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
