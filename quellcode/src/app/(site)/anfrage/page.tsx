import type { Metadata } from "next";
import { Check } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_NAMES, normalizeTopic } from "@/lib/content";

export const metadata: Metadata = {
  title: "Anfrage stellen – kostenlose Erstprüfung",
  description:
    "In zwei Schritten zur persönlichen Einschätzung: Thema wählen, Kontakt hinterlassen – ein TarifWerk-Berater meldet sich persönlich. Kostenlos und unverbindlich.",
  alternates: { canonical: "/anfrage" },
};

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ thema?: string; region?: string }> }) {
  const { thema, region } = await searchParams;
  const normalized = normalizeTopic(thema ?? "");
  const topic = SERVICE_NAMES.includes(normalized) ? normalized : "";

  return (
    <>
      <PageHero
        eyebrow="Anfrage"
        title={
          <>
            Zwei Minuten. <span className="display-i font-normal text-champagne-soft">Dann weißt du mehr.</span>
          </>
        }
        text="Sag uns kurz, worum es geht. Wir prüfen deine Situation und melden uns persönlich – mit einer ehrlichen Einschätzung, nicht mit einem Angebotskatalog."
        compact
      />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[22px] font-extrabold text-ink">Was danach passiert</h2>
            <ul className="mt-5 space-y-3 text-[15px] text-steel">
              {[
                "Ein Berater sieht sich deine Angaben persönlich an.",
                "Du bekommst eine Rückmeldung – in der Regel innerhalb eines Tages.",
                "Terminwünsche bestätigen wir dir ausdrücklich.",
                "Du entscheidest, ob und wie es weitergeht.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-electric-deep" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-line bg-white p-5 text-[14px] text-steel">
              <p className="font-semibold text-ink">Keine Weitergabe deiner Daten.</p>
              <p className="mt-1">Deine Angaben nutzen wir ausschließlich für deine Anfrage – nichts wird verkauft, nichts landet in Newslettern.</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="rounded-[26px] border border-line bg-white p-6 shadow-soft sm:p-9">
              <LeadForm type="beratung" defaultTopic={topic} defaultRegion={region ?? ""} source="anfrage" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
