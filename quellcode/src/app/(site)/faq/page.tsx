import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/home/Sections";
import { FAQ, SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ – Fragen zu Beratung, Kosten & Ablauf",
  description: "Kostet die Beratung etwas? Wie unabhängig ist TarifWerk? Wie läuft ein Termin ab? Die wichtigsten Antworten auf einen Blick.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const all = [...FAQ, ...SERVICES.flatMap((s) => s.faq.map((f) => ({ q: `${s.name}: ${f.q}`, a: f.a })))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title={<>Ehrliche Antworten <span className="display-i font-normal text-champagne-soft">vor</span> dem ersten Gespräch.</>} compact />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[22px] font-extrabold text-ink">Allgemein</h2>
            <p className="mt-2 text-[15px] text-steel">Kosten, Ablauf, Unabhängigkeit, Daten.</p>
          </Reveal>
          <Reveal className="lg:col-span-8"><Accordion items={FAQ} /></Reveal>
        </div>
        <div className="container-x mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[22px] font-extrabold text-ink">Zu den Themen</h2>
            <p className="mt-2 text-[15px] text-steel">Was Kunden zu einzelnen Bereichen am häufigsten fragen.</p>
          </Reveal>
          <Reveal className="lg:col-span-8">
            <Accordion items={SERVICES.flatMap((s) => s.faq.map((f) => ({ q: `${s.name} – ${f.q}`, a: f.a })))} />
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
