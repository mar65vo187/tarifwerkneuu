"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CHANNELS, LOCATION_OPTIONS, SERVICES, SITE, SITUATIONS, TIME_SLOTS, whatsappLink, normalizeTopic } from "@/lib/content";

type Props = {
  type?: "beratung" | "termin" | "tarifcheck" | "kontakt";
  advisorSlug?: string;
  advisorName?: string;
  defaultTopic?: string;
  defaultRegion?: string;
  source?: string;
  tone?: "light" | "dark";
  title?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function LeadForm({ type = "termin", advisorSlug, advisorName, defaultTopic = "", defaultRegion = "", source, tone = "light", title }: Props) {
  const dark = tone === "dark";
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [form, setForm] = useState({
    topic: normalizeTopic(defaultTopic),
    situation: "",
    region: defaultRegion.slice(0, 80),
    name: "",
    email: "",
    phone: "",
    preferredChannel: "whatsapp",
    preferredTime: "",
    message: "",
    consent: false,
    website: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const field = dark ? "field-dark" : "field";
  const label = dark ? "mb-1.5 block text-[13px] font-semibold text-platinum" : "label";
  const muted = dark ? "text-silver" : "text-steel";
  const chip = (on: boolean) =>
    `chip h-10 px-4 text-[13.5px] transition-all ${
      on
        ? "border-electric bg-electric text-white"
        : dark
          ? "border-white/12 text-silver hover:border-white/30 hover:text-white"
          : "border-line bg-white text-ink-700 hover:border-electric/50"
    }`;

  const canNext = step === 0 ? Boolean(form.topic && form.situation) : true;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError("Bitte Name und E-Mail angeben.");
      return;
    }
    if (!form.consent) {
      setError("Bitte stimme der Datenverarbeitung zu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, advisorSlug, source: source ?? (advisorSlug ? `berater:${advisorSlug}` : "anfrage") }),
      });
      const json = (await res.json()) as { ok: boolean; id?: number; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Etwas ist schiefgelaufen. Bitte versuche es erneut.");
        return;
      }
      setDone(json.id ?? 0);
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuche es erneut oder schreib uns per WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (done !== null) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-electric text-white shadow-glow">
          <Check className="h-7 w-7" />
        </span>
        <h3 className={`mt-6 text-[26px] font-extrabold ${dark ? "text-white" : "text-ink"}`}>Danke, {form.name.split(" ")[0]}.</h3>
        <p className={`mx-auto mt-3 max-w-md text-[15.5px] leading-relaxed ${muted}`}>
          Deine Anfrage ist angekommen{advisorName ? ` und liegt bei ${advisorName.split(" ")[0]}` : ""}. Du bekommst eine persönliche
          Rückmeldung – in der Regel innerhalb eines Tages. Terminwünsche bestätigen wir dir ausdrücklich.
        </p>
        {done > 0 && <p className={`mt-2 text-[12.5px] ${muted}`}>Vorgangsnummer #{done}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href={whatsappLink(`Hallo TarifWerk, ich habe gerade Anfrage #${done} gestellt.`)} target="_blank" variant="whatsapp" icon={<MessageCircle />}>
            Lieber gleich per WhatsApp
          </Button>
          <Button href="/" variant={dark ? "secondary" : "dark"} magnetic={false}>
            Zur Startseite
          </Button>
        </div>
      </motion.div>
    );
  }

  const steps = ["Dein Thema", "Dein Kontakt"];

  return (
    <form onSubmit={submit} noValidate>
      {title && <h3 className={`text-[22px] font-extrabold ${dark ? "text-white" : "text-ink"}`}>{title}</h3>}

      {/* Fortschritt */}
      <ol className={`${title ? "mt-5" : ""} flex items-center gap-3 text-[12.5px] font-semibold`}>
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${
                i <= step ? "bg-electric text-white" : dark ? "bg-white/10 text-silver" : "bg-paper-2 text-steel"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={i <= step ? (dark ? "text-white" : "text-ink") : muted}>{s}</span>
            {i < steps.length - 1 && <span className={`h-px w-8 ${dark ? "bg-white/15" : "bg-line"}`} />}
          </li>
        ))}
      </ol>

      <div className="relative mt-7 min-h-[320px]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
              <p className={label}>Worum geht es?</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <button key={s.key} type="button" onClick={() => set("topic", s.name)} aria-pressed={form.topic === s.name} className={chip(form.topic === s.name)}>
                    {s.name}
                  </button>
                ))}
              </div>

              <p className={`${label} mt-7`}>Wo stehst du gerade?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SITUATIONS.map((s) => {
                  const on = form.situation === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("situation", s.value)}
                      aria-pressed={on}
                      className={`rounded-xl border px-4 py-3 text-left text-[14px] font-medium transition-all ${
                        on
                          ? "border-electric bg-electric/10 text-ink ring-2 ring-electric/30 " + (dark ? "!text-white" : "")
                          : dark
                            ? "border-white/12 text-silver hover:border-white/30"
                            : "border-line bg-white text-ink-700 hover:border-electric/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <p className={`${label} mt-7`}>Region (optional)</p>
              <input type="search" value={form.region} onChange={(e) => set("region", e.target.value)} list="anfrage-standorte" className={`${field} appearance-none`} aria-label="Region wählen" placeholder="Stadt oder Region suchen" autoComplete="address-level2" maxLength={80} />
              <datalist id="anfrage-standorte">
                {LOCATION_OPTIONS.map((r) => <option key={r} value={r} />)}
              </datalist>
            </motion.div>
          ) : (
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lf-name" className={label}>Name *</label>
                  <input id="lf-name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required placeholder="Vor- und Nachname" />
                </div>
                <div>
                  <label htmlFor="lf-email" className={label}>E-Mail *</label>
                  <input id="lf-email" type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" required placeholder="du@beispiel.de" />
                </div>
                <div>
                  <label htmlFor="lf-phone" className={label}>Telefon (für Rückruf / WhatsApp)</label>
                  <input id="lf-phone" type="tel" className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+49 …" />
                </div>
                <div>
                  <label htmlFor="lf-time" className={label}>Wann passt es dir?</label>
                  <select id="lf-time" value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} className={`${field} appearance-none`}>
                    <option value="" className="text-ink">Bitte wählen</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t.value} value={t.label} className="text-ink">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className={`${label} mt-5`}>Wie möchtest du sprechen?</p>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((c) => (
                  <button key={c.value} type="button" onClick={() => set("preferredChannel", c.value)} aria-pressed={form.preferredChannel === c.value} className={chip(form.preferredChannel === c.value)}>
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label htmlFor="lf-msg" className={label}>Was sollten wir vorab wissen? (optional)</label>
                <textarea id="lf-msg" rows={3} className={field} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Kurz in deinen Worten – reicht völlig." />
              </div>

              {/* Honeypot */}
              <div className="hidden" aria-hidden>
                <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} /></label>
              </div>

              <label className={`mt-5 flex items-start gap-3 text-[13.5px] leading-snug ${muted}`}>
                <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink/20 accent-electric" />
                <span>
                  Ich bin einverstanden, dass TarifWerk meine Angaben zur Bearbeitung meiner Anfrage verarbeitet.{" "}
                  <Link href="/datenschutz" className="underline underline-offset-2 hover:text-electric">Datenschutz</Link>
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mt-4 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-500">
          {error}
        </motion.p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`inline-flex items-center gap-2 text-[12.5px] ${muted}`}>
          <ShieldCheck className="h-4 w-4 text-electric" /> Kostenlos · unverbindlich · keine Weitergabe
        </p>
        <div className="flex gap-2">
          {step > 0 && (
            <Button type="button" variant={dark ? "secondary" : "dark"} magnetic={false} onClick={() => setStep(0)} icon={<ArrowLeft />}>
              Zurück
            </Button>
          )}
          {step === 0 ? (
            <Button type="button" disabled={!canNext} onClick={() => setStep(1)} iconRight={<ArrowRight />}>
              Weiter
            </Button>
          ) : (
            <Button type="submit" disabled={loading} iconRight={loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}>
              {loading ? "Wird gesendet…" : type === "termin" ? "Termin anfragen" : "Anfrage senden"}
            </Button>
          )}
        </div>
      </div>
      <p className={`mt-4 text-[12.5px] ${muted}`}>
        Lieber direkt? <a className="font-semibold underline underline-offset-2" href={SITE.phoneHref}>{SITE.whatsappDisplay}</a> – täglich 08–22 Uhr.
      </p>
    </form>
  );
}
