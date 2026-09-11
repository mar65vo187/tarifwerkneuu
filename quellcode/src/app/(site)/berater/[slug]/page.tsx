import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Mail, MapPin, MessageCircle, Phone, Quote } from "lucide-react";
import { AdvisorAvatar } from "@/components/advisors/AdvisorCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import { getAdvisorBySlug } from "@/lib/queries";
import { PROCESS, SITE, normalizeTopic, normalizeTopics } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ thema?: string; region?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAdvisorBySlug(slug);
  if (!a) return { title: "Berater nicht gefunden" };
  return {
    title: `${a.name} – ${a.title} in ${a.city}`,
    description: `${a.name} berät persönlich zu ${normalizeTopics(a.topics).slice(0, 4).join(", ")} in ${a.regions.slice(0, 3).join(", ")}. Termin anfragen, WhatsApp oder Anruf.`,
    alternates: { canonical: `/berater/${a.slug}` },
  };
}

export default async function AdvisorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { thema: requestedTopic, region } = await searchParams;
  const thema = normalizeTopic(requestedTopic ?? "");
  const filters = new URLSearchParams();
  if (thema) filters.set("thema", thema);
  if (region) filters.set("region", region.slice(0, 80));
  const a = await getAdvisorBySlug(slug);
  if (!a) notFound();

  const first = a.name.split(" ")[0];
  const wa = a.whatsapp ? `https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Hallo ${first}, ich habe eine Frage${thema ? ` zum Thema ${thema}` : ""}.`)}` : null;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    jobTitle: a.title,
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
    address: { "@type": "PostalAddress", addressLocality: a.city, addressCountry: "DE" },
    knowsAbout: normalizeTopics(a.topics),
    url: `${SITE.url}/berater/${a.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <section className="relative overflow-hidden bg-ink pt-[112px] pb-16 text-white grain sm:pt-[128px]">
        <div className="absolute inset-0 grid-lines" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-electric/18 blur-[130px]" />
        <div className="container-x relative">
          <Link href={`/berater${filters.size ? `?${filters}` : ""}`} className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-silver hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Alle Berater
          </Link>
          <Reveal className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-5">
                <AdvisorAvatar initials={a.initials} image={a.image} size="lg" className="ring-white/15" />
                <div>
                  {a.isFounder && <span className="chip mb-2 border-champagne/50 text-[11px] text-champagne-soft">Gründer</span>}
                  <h1 className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold leading-[1.02]">{a.name}</h1>
                  <p className="mt-1 text-[15px] text-silver">{a.title}</p>
                </div>
              </div>
              {a.quote && (
                <blockquote className="mt-8 flex gap-3">
                  <Quote className="h-6 w-6 shrink-0 text-champagne" />
                  <p className="display-i text-[clamp(1.3rem,2.4vw,1.8rem)] leading-snug text-platinum">{a.quote}</p>
                </blockquote>
              )}
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-silver">{a.bio}</p>
              <dl className="mt-7 grid gap-3 text-[14px] sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-electric-soft" />
                  <div>
                    <dt className="text-silver">Vor Ort</dt>
                    <dd className="font-semibold">{a.regions.filter((r) => !r.startsWith("Deutschlandweit")).join(" · ")}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-electric-soft" />
                  <div>
                    <dt className="text-silver">Erreichbar</dt>
                    <dd className="font-semibold">{SITE.hours} · digital deutschlandweit</dd>
                  </div>
                </div>
              </dl>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {normalizeTopics(a.topics).map((t) => (
                  <li key={t} className={`chip ${thema === t ? "border-electric bg-electric text-white" : "border-white/12 text-silver"}`}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <div className="glass rounded-[26px] p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-silver">Direkter Draht</p>
                <div className="mt-4 grid gap-2">
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl bg-[#25D366] px-5 py-4 font-semibold text-ink-900 transition-transform hover:scale-[1.01]">
                      <span className="inline-flex items-center gap-3"><MessageCircle className="h-5 w-5" /> WhatsApp schreiben</span>
                      <span className="text-[12.5px] font-medium opacity-80">meist schnellste Antwort</span>
                    </a>
                  )}
                  {a.phone && (
                    <a href={`tel:${a.phone}`} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/5 px-5 py-4 font-semibold transition-colors hover:bg-white/10">
                      <span className="inline-flex items-center gap-3"><Phone className="h-5 w-5 text-electric-soft" /> Anrufen</span>
                      <span className="text-[12.5px] font-medium text-silver">{SITE.whatsappDisplay}</span>
                    </a>
                  )}
                  {a.email && (
                    <a href={`mailto:${a.email}`} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/5 px-5 py-4 font-semibold transition-colors hover:bg-white/10">
                      <span className="inline-flex items-center gap-3"><Mail className="h-5 w-5 text-electric-soft" /> E-Mail</span>
                      <span className="truncate pl-3 text-[12.5px] font-medium text-silver">{a.email}</span>
                    </a>
                  )}
                  <a href="#termin" className="mt-1 rounded-2xl bg-electric px-5 py-4 text-center font-semibold text-white transition-colors hover:bg-electric-deep">
                    Termin anfragen
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-24" id="termin">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-electric-deep">Terminanfrage</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-ink">Ein Gespräch mit {first}.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-steel">
              Du nennst Thema und Wunschzeit – {first} bestätigt dir den Termin persönlich. Telefonisch, per Video oder vor Ort.
            </p>
            <ol className="mt-8 space-y-4">
              {PROCESS.slice(0, 3).map((p) => (
                <li key={p.step} className="flex gap-4">
                  <span className="text-[13px] font-extrabold text-electric-deep">{p.step}</span>
                  <div>
                    <p className="font-bold text-ink">{p.title}</p>
                    <p className="text-[14px] text-steel">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="rounded-[26px] border border-line bg-white p-6 shadow-soft sm:p-9">
              <LeadForm type="termin" advisorSlug={a.slug} advisorName={a.name} defaultTopic={thema} defaultRegion={(region ?? "").slice(0, 80)} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
