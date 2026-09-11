"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LOCATION_OPTIONS, SERVICES } from "@/lib/content";

export function FinderTeaser() {
  const [topic, setTopic] = useState<string | null>(null);
  const [region, setRegion] = useState<string>("");


  return (
    <section id="berater-auswahl" style={{ scrollMarginTop: 88 }} className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-electric/15 blur-[130px]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-electric-soft">Die wichtigste Entscheidung heute</p>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold leading-[1.02]">
            Finde deinen <span className="display-i font-normal text-champagne-soft">persönlichen</span> Berater.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-silver">
            Wähle dein Thema und deinen Ort. Du siehst, wer zu dir passt, und kannst unverbindlich ein erstes Gespräch anfragen.
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <form action="/berater" method="get" className="glass rounded-[28px] p-6 sm:p-8">
            <input type="hidden" name="thema" value={topic || ""} />
            <p className="text-[13px] font-semibold text-platinum">1 · Worum geht es?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const on = topic === s.name;
                return (
                  <motion.button
                    key={s.key}
                    type="button"
                    data-topic={s.name}
                    aria-label={s.name}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setTopic(on ? null : s.name)}
                    aria-pressed={on}
                    className={`chip h-9 px-4 text-[13.5px] transition-all duration-300 ${
                      on
                        ? "border-electric bg-electric text-white shadow-[0_8px_24px_-8px_rgba(79,141,255,0.9)]"
                        : "border-white/12 text-silver hover:border-white/30 hover:text-white"
                    } ${s.featured && !on ? "border-champagne/30" : ""}`}
                  >
                    {s.shortLabel || s.name}
                  </motion.button>
                );
              })}
            </div>

            <p className="mt-7 text-[13px] font-semibold text-platinum">2 · Wo bist du?</p>
            <div className="relative mt-3">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver" />
              <input
                type="search"
                name="region"
                list="tarifwerk-standorte"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="field-dark appearance-none pl-11"
                placeholder="Stadt oder Region suchen (optional)"
                aria-label="Stadt oder Region suchen"
                autoComplete="address-level2"
                maxLength={80}
              />
              <datalist id="tarifwerk-standorte">
                {LOCATION_OPTIONS.map((r) => <option key={r} value={r} />)}
              </datalist>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-silver">Kostenlos · unverbindlich · Antwort persönlich</p>
              <Button type="submit" size="lg" iconRight={<ArrowRight />}>
                Passende Berater anzeigen
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
