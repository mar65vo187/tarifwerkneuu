"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const CHECKS = [
  { label: "Deine Situation", sub: "Zuerst hören wir zu.", state: "done" },
  { label: "Dein Bedarf", sub: "Was ist dir wichtig?", state: "active" },
  { label: "Deine Möglichkeiten", sub: "Optionen verständlich einordnen", state: "queue" },
  { label: "Dein nächster Schritt", sub: "Du entscheidest in Ruhe.", state: "queue" },
];

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["30%", "70%"]);
  const [activeIdx, setActiveIdx] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % CHECKS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white grain"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Atmosphäre */}
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <motion.div
        aria-hidden
        style={{ left: glowX }}
        className="pointer-events-none absolute top-[-10%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-electric/25 blur-[140px]"
      />
      <div aria-hidden className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-[520px] w-[520px] rounded-full bg-champagne/10 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />

      <div className="container-x relative grid min-h-[100svh] items-center gap-14 pt-[120px] pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-[140px]">
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="eyebrow text-electric-soft"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Persönliche Beratung · deutschlandweit
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.25rem,6.2vw,5.2rem)] font-extrabold leading-[1.0] tracking-[-0.03em]">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="block text-gradient-silver"
            >
              Verträge verstehen.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.32 }}
              className="block"
            >
              Klarheit{" "}
              <span className="display-i text-champagne-soft">gewinnen.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.44 }}
              className="block"
            >
              Persönlich begleitet.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="mt-7 max-w-xl text-[17px] leading-relaxed text-silver sm:text-[18px]"
          >
            Von Alltagstarifen bis zu großen Entscheidungen: Wir prüfen deine Möglichkeiten, erklären verständlich und bleiben dein Ansprechpartner – auch danach.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.72 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#berater-auswahl" size="lg" iconRight={<ArrowRight />}>
              Kostenlos beraten lassen
            </Button>
            <Button href={whatsappLink("Hallo TarifWerk, ich hätte gern eine kurze Einschätzung.")} target="_blank" variant="secondary" size="lg" icon={<MessageCircle />}>
              Frage per WhatsApp stellen
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-silver"
          >
            {["Erstgespräch kostenlos", "Du entscheidest in Ruhe", "Täglich 08–22 Uhr erreichbar"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-electric-soft" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visual: Prüfungs-Karte */}
        <div className="lg:col-span-5" style={{ perspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            className="relative mx-auto w-full max-w-[440px]"
          >
            <div className="glass relative overflow-hidden rounded-[28px] p-6 shadow-soft">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric/30 blur-[70px]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-silver">So läuft die Beratung</p>
                  <p className="mt-1 text-[18px] font-bold">Ein Gespräch. Ein klarer Plan.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-silver">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-electric-soft animate-pulse-dot" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
                  </span>
                  persönlich
                </span>
              </div>

              <ul className="mt-6 space-y-2.5">
                {CHECKS.map((c, i) => {
                  const state = i < activeIdx ? "done" : i === activeIdx ? "active" : "queue";
                  return (
                    <motion.li
                      key={c.label}
                      layout
                      transition={{ duration: 0.5, ease }}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors duration-500 ${
                        state === "active"
                          ? "border-electric/50 bg-electric/12"
                          : state === "done"
                            ? "border-white/8 bg-white/4"
                            : "border-white/6 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold transition-colors duration-500 ${
                            state === "done"
                              ? "bg-electric text-white"
                              : state === "active"
                                ? "bg-white text-ink"
                                : "border border-white/12 text-silver"
                          }`}
                        >
                          {state === "done" ? <Check className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-[14.5px] font-semibold leading-tight">{c.label}</p>
                          <p className="text-[12.5px] text-silver">{c.sub}</p>
                        </div>
                      </div>
                      <span className={`text-[11.5px] font-medium ${state === "active" ? "text-electric-soft" : "text-steel"}`}>
                        {state === "done" ? "Schritt davor" : state === "active" ? "im Fokus" : "danach"}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/8 bg-ink/40 p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-platinum to-electric text-[13px] font-extrabold text-ink">
                  ME
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold">Marvin · dein Ansprechpartner</p>
                  <p className="text-[12.5px] text-silver">antwortet persönlich – nicht per Ticket</p>
                </div>
              </div>
            </div>

            {/* Schwebende Notiz */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -left-4 -bottom-6 hidden rounded-2xl px-4 py-3 text-[13px] sm:block"
              style={{ transform: "translateZ(40px)" }}
            >
              <p className="font-semibold">Ehrliche Einschätzung</p>
              <p className="text-silver">auch wenn sie „noch nicht“ lautet</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
