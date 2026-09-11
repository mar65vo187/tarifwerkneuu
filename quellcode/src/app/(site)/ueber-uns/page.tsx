import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Founder, FinalCta, Process } from "@/components/home/Sections";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { Item, Reveal, Stagger } from "@/components/ui/Reveal";
import { REGIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Über uns – Haltung, Gründer & Arbeitsweise",
  description:
    "Warum es TarifWerk gibt: persönliche, unabhängige Beratung mit festem Ansprechpartner. Gegründet von Marvin Noel Egenolf in Wiesbaden – vor Ort im Rhein-Main-Gebiet, digital deutschlandweit.",
  alternates: { canonical: "/ueber-uns" },
};

const VALUES = [
  { t: "Verständlich", d: "Wenn du es nach dem Gespräch nicht erklären könntest, haben wir unseren Job nicht gemacht." },
  { t: "Unabhängig", d: "Viele Marktpartner, keine Bindung. Wir empfehlen, was zu dir passt – und sagen, wie wir verdienen." },
  { t: "Erreichbar", d: "Dein Berater bleibt dein Berater. Auch Monate nach der Entscheidung." },
  { t: "Ambitioniert", d: "Wir wollen wachsen – aber nur so, dass jeder Kunde weiterhin einen Menschen kennt, der für ihn zuständig ist." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Wir wollen nach oben. <span className="display-i font-normal text-champagne-soft">Aber auf einem Weg, den du nachvollziehen kannst.</span>
          </>
        }
        text="TarifWerk ist aus einer einfachen Beobachtung entstanden: Die meisten Menschen bekommen bei großen Entscheidungen entweder Verkauf oder gar nichts. Wir bauen die dritte Option."
      />

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-electric-deep">Woran wir uns messen lassen</p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,3rem)] font-extrabold leading-tight text-ink">Vier Worte, die bei uns Arbeit bedeuten.</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2" stagger={0.1}>
            {VALUES.map((v, i) => (
              <Item key={v.t}>
                <div className="card-hover h-full rounded-[24px] border border-line bg-white p-7">
                  <span className="text-[13px] font-bold text-electric-deep">0{i + 1}</span>
                  <h3 className="mt-3 text-[24px] font-extrabold text-ink">{v.t}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-steel">{v.d}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <Founder />
      <Process />

      <section className="bg-paper-2 py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-electric-deep">Wo wir sind</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-ink">Persönlich im Rhein-Main-Gebiet. Digital überall.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-steel">
              Unser Ursprung liegt in Wiesbaden. Vor-Ort-Termine sind im Rhein-Main-Gebiet und in weiteren Städten möglich – alles andere klären wir
              genauso persönlich per Video oder Telefon. Termine vereinbaren wir bewusst individuell, damit deine Zeit dir gehört.
            </p>
            <div className="mt-6">
              <Button href="/berater" iconRight={<ArrowRight />}>Berater in deiner Region</Button>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {REGIONS.map((r) => (
                <li key={r} className="rounded-2xl border border-line bg-white px-4 py-4 text-[14.5px] font-semibold text-ink">{r}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
