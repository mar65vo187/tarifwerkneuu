import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PageHero } from "@/components/site/PageHero";
import { Item, Reveal, Stagger } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Berater werden – Karriere bei TarifWerk",
  description:
    "Du erklärst gern, hörst zu und willst Menschen ehrlich beraten? Werde Berater bei TarifWerk – in acht Bereichen, mit Rückhalt und ohne Skript.",
  alternates: { canonical: "/karriere" },
};

const EXPECT = [
  { t: "Echte Verantwortung", d: "Du begleitest Menschen in Entscheidungen, die zählen – von Internet bis Immobilie." },
  { t: "Kein Skript", d: "Du berätst so, wie du selbst beraten werden wolltest. Zeit ist bei uns kein Kostenfaktor, sondern Qualität." },
  { t: "Rückhalt", d: "Erfahrung, Abstimmung und ein offenes Ohr – vom ersten Tag an. Du bist nicht allein." },
];

const FITS = ["Du magst den ehrlichen Kontakt mit Menschen", "Du kannst Komplexes verständlich machen", "Du sagst auch mal „nicht abschließen“", "Du arbeitest selbstständig und zuverlässig"];
const NOT = ["Du willst Produkte losschieben, ohne zuzuhören", "Du versprichst gern alles, was gehört werden will", "Du arbeitest mit künstlichem Zeitdruck"];

export default function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Karriere"
        title={
          <>
            Beraten, wie du selbst <span className="display-i font-normal text-champagne-soft">beraten werden willst.</span>
          </>
        }
        text="Wir suchen Menschen, die zuhören können, gern erklären und Ambition mit Anstand verbinden. Nebenberuflich oder mit voller Kraft – das klären wir im Gespräch."
      />

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <Stagger className="grid gap-4 md:grid-cols-3" stagger={0.1}>
            {EXPECT.map((e, i) => (
              <Item key={e.t}>
                <div className="card-hover h-full rounded-[24px] border border-line bg-white p-7">
                  <span className="text-[13px] font-bold text-electric-deep">0{i + 1}</span>
                  <h2 className="mt-3 text-[22px] font-extrabold text-ink">{e.t}</h2>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-steel">{e.d}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="rounded-[24px] border border-line bg-white p-7">
                <h3 className="text-[18px] font-extrabold text-ink">Passt zu uns</h3>
                <ul className="mt-4 space-y-3">
                  {FITS.map((f) => <li key={f} className="flex gap-3 text-[15px] text-ink-700"><Check className="mt-1 h-4 w-4 shrink-0 text-electric-deep" />{f}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[24px] border border-line bg-paper-2 p-7">
                <h3 className="text-[18px] font-extrabold text-ink">Passt eher nicht</h3>
                <ul className="mt-4 space-y-3">
                  {NOT.map((f) => <li key={f} className="flex gap-3 text-[15px] text-steel"><X className="mt-1 h-4 w-4 shrink-0 text-steel" />{f}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-20 sm:py-28" id="bewerben">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-electric-deep">Bewerbung</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-ink">Erzähl uns kurz, wer du bist.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-steel">Zwei Minuten reichen. Wir melden uns persönlich – und klären in einem kurzen Gespräch, ob und wie wir zusammenpassen.</p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="rounded-[26px] border border-line bg-white p-6 shadow-soft sm:p-9">
              <ApplicationForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
