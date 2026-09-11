import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Item, Reveal, Stagger } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { REGIONS, SERVICES, SERVICE_IMAGES, SITE, getService, whatsappLink } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Nicht gefunden" };
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/leistungen/${s.slug}` } };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const img = SERVICE_IMAGES[s.key];
  const others = SERVICES.filter((x) => x.key !== s.key).slice(0, 4);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${s.name} – persönliche Beratung`,
    serviceType: s.name,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: REGIONS.map((r) => r),
    description: s.seoDescription,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: "Kostenloses Erstgespräch" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <section className="relative overflow-hidden bg-ink pt-[120px] pb-20 text-white grain sm:pt-[140px]">
        <div className="absolute inset-0 grid-lines" aria-hidden />
        {img && (
          <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
            <Image src={img.src} alt={img.alt} fill sizes="46vw" priority className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
          </div>
        )}
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <nav aria-label="Breadcrumb" className="text-[13px] text-silver">
              <Link href="/leistungen" className="hover:text-white">Leistungen</Link> <span className="mx-2">/</span> <span className="text-white">{s.name}</span>
            </nav>
            <p className="eyebrow mt-6 text-electric-soft">{s.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.0] tracking-[-0.03em]">{s.headline}</h1>
            <p className="mt-6 text-[17px] leading-relaxed text-silver">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/berater?thema=${encodeURIComponent(s.name)}`} size="lg" iconRight={<ArrowRight />}>
                Berater für {s.name}
              </Button>
              <Button href={whatsappLink(`Hallo TarifWerk, ich interessiere mich für ${s.name}.`)} target="_blank" variant="secondary" size="lg" icon={<MessageCircle />}>
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-electric-deep">Was wir für dich prüfen</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-ink">Die Fragen, die vor der Entscheidung beantwortet sein sollten.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-steel">Nicht mehr, aber auch nicht weniger. Danach weißt du, ob und wie es für dich Sinn ergibt.</p>
          </Reveal>
          <Stagger className="grid gap-3 lg:col-span-7" stagger={0.08}>
            {s.checks.map((c, i) => (
              <Item key={c}>
                <div className="card-hover flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-electric/10 text-[13px] font-extrabold text-electric-deep">0{i + 1}</span>
                  <p className="text-[16px] font-semibold text-ink">{c}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-paper-2 py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-electric-deep">Für wen das passt</p>
            <ul className="mt-5 space-y-3">
              {s.forWhom.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[16px] text-ink">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-electric-deep" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="eyebrow text-electric-deep">Häufige Fragen zu {s.name}</p>
            <div className="mt-3">
              <Accordion items={s.faq} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-white sm:py-28" id="anfrage">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-electric-soft">Kostenlose Erstprüfung</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight">Lass uns über {s.name} sprechen.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-silver">Zwei Schritte, dann meldet sich ein Berater persönlich bei dir. Ohne Verpflichtung.</p>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-silver">Auch interessant</p>
              <ul className="mt-3 space-y-2">
                {others.map((o) => (
                  <li key={o.key}>
                    <Link href={`/leistungen/${o.slug}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-platinum hover:text-white">
                      {o.name} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="glass rounded-[26px] p-6 sm:p-9">
              <LeadForm type="beratung" defaultTopic={s.name} tone="dark" source={`leistung:${s.slug}`} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
