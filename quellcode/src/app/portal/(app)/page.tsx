import Link from "next/link";
import { ArrowRight, CalendarCheck, Inbox, TrendingUp, Users } from "lucide-react";
import { Card, StatusBadge, TypeBadge, formatDate } from "@/components/portal/ui";
import { BarSeries, TopicBars } from "@/components/portal/Charts";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const user = await getCurrentUser();
  const stats = await getDashboardStats();
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Guten Morgen" : hour < 18 ? "Hallo" : "Guten Abend";

  const kpis = [
    { label: "Offene Anfragen", value: stats.open, icon: Inbox, hint: "neu + kontaktiert" },
    { label: "Bestätigte Termine", value: stats.confirmed, icon: CalendarCheck, hint: "warten auf Gespräch" },
    { label: "In Beratung", value: stats.inConsult, icon: Users, hint: "aktive Kunden" },
    { label: "Abschlussquote", value: stats.conversion === null ? "–" : `${stats.conversion}%`, icon: TrendingUp, hint: `${stats.won} abgeschlossen` },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-electric-deep">Übersicht</p>
          <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">{greet}, {user?.name.split(" ")[0]}.</h1>
          <p className="text-[14.5px] text-steel">{stats.total} Anfragen insgesamt · {stats.byType.termin ?? 0} Terminwünsche · {stats.byType.bewerbung ?? 0} Bewerbungen</p>
        </div>
        <Link href="/portal/leads?status=neu" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white hover:bg-electric">
          Neue Anfragen bearbeiten <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-steel">{k.label}</p>
                <Icon className="h-4.5 w-4.5 text-electric-deep" />
              </div>
              <p className="mt-3 text-[34px] font-extrabold leading-none tracking-tight">{k.value}</p>
              <p className="mt-2 text-[12.5px] text-steel">{k.hint}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold">Anfragen – letzte 14 Tage</h2>
            <span className="text-[12.5px] text-steel">{stats.series.reduce((s, d) => s + d.count, 0)} gesamt</span>
          </div>
          <div className="mt-5"><BarSeries data={stats.series} /></div>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-[16px] font-extrabold">Themen-Auswertung</h2>
          <p className="text-[12.5px] text-steel">Wonach am häufigsten gefragt wird</p>
          <div className="mt-5"><TopicBars data={stats.topics} /></div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold">Zuletzt eingegangen</h2>
          <Link href="/portal/leads" className="text-[13.5px] font-semibold text-electric-deep hover:underline">Alle anzeigen</Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-line p-8 text-center text-[14.5px] text-steel">Noch keine Anfragen. Sobald jemand über die Website anfragt, erscheint es hier.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {stats.recent.map((l) => (
              <li key={l.id}>
                <Link href={`/portal/leads/${l.id}`} className="flex flex-col gap-2 py-3 transition-colors hover:bg-paper sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-2">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{l.name} <span className="font-normal text-steel">· {l.topic ?? "Ohne Thema"}</span></p>
                    <p className="text-[12.5px] text-steel">{formatDate(l.createdAt)} · {l.region ?? "Region offen"}{l.advisorName ? ` · für ${l.advisorName}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2"><TypeBadge type={l.type} /><StatusBadge status={l.status} /></div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
