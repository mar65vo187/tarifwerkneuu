"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { REGIONS, SERVICES } from "@/lib/content";

const EXPERIENCE = [
  { v: "umfangreich", l: "Ja, umfangreich" },
  { v: "etwas", l: "Etwas Erfahrung" },
  { v: "keine", l: "Noch keine – aber Lust" },
];

export function ApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    job: "",
    experience: "",
    areas: [] as string[],
    time: "",
    why: "",
    channel: "whatsapp",
    consent: false,
    website: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.name.trim() || !f.email.trim() || !f.why.trim()) return setError("Bitte Name, E-Mail und deine Motivation angeben.");
    if (!f.consent) return setError("Bitte stimme der Datenverarbeitung zu.");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bewerbung",
          name: f.name,
          email: f.email,
          phone: f.phone,
          region: f.region,
          topic: f.areas.join(", "),
          situation: f.experience,
          message: f.why,
          preferredChannel: f.channel,
          preferredTime: f.time,
          consent: f.consent,
          website: f.website,
          source: "karriere",
          meta: { job: f.job },
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) return setError(json.error ?? "Etwas ist schiefgelaufen.");
      setDone(true);
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-electric text-white shadow-glow"><Check className="h-7 w-7" /></span>
        <h3 className="mt-6 text-[26px] font-extrabold text-ink">Danke, {f.name.split(" ")[0]}.</h3>
        <p className="mx-auto mt-3 max-w-md text-[15.5px] text-steel">Deine Bewerbung ist angekommen. Wir melden uns persönlich – so, wie du es dir gewünscht hast.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="ap-name" className="label">Name *</label><input id="ap-name" className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required /></div>
        <div><label htmlFor="ap-email" className="label">E-Mail *</label><input id="ap-email" type="email" className="field" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" required /></div>
        <div><label htmlFor="ap-phone" className="label">Telefon</label><input id="ap-phone" type="tel" className="field" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></div>
        <div>
          <label htmlFor="ap-region" className="label">Region</label>
          <select id="ap-region" className="field appearance-none" value={f.region} onChange={(e) => set("region", e.target.value)}>
            <option value="">Bitte wählen</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2"><label htmlFor="ap-job" className="label">Was machst du aktuell beruflich?</label><input id="ap-job" className="field" value={f.job} onChange={(e) => set("job", e.target.value)} /></div>
      </div>

      <div>
        <p className="label">Erfahrung im Vertrieb oder Kundenkontakt?</p>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE.map((x) => (
            <button key={x.v} type="button" onClick={() => set("experience", x.v)} aria-pressed={f.experience === x.v} className={`chip h-10 px-4 text-[13.5px] ${f.experience === x.v ? "border-electric bg-electric text-white" : "border-line bg-white text-ink-700"}`}>{x.l}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Bereiche, die dich interessieren</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => {
            const on = f.areas.includes(s.name);
            return (
              <button key={s.key} type="button" aria-pressed={on} onClick={() => set("areas", on ? f.areas.filter((a) => a !== s.name) : [...f.areas, s.name])} className={`chip h-10 px-4 text-[13.5px] ${on ? "border-electric bg-electric text-white" : "border-line bg-white text-ink-700"}`}>{s.name}</button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="ap-time" className="label">Wie viel Zeit möchtest du investieren?</label>
        <select id="ap-time" className="field appearance-none" value={f.time} onChange={(e) => set("time", e.target.value)}>
          <option value="">Bitte wählen</option>
          <option>Nebenberuflich (bis 10 Std./Woche)</option>
          <option>Teilzeit (10–25 Std./Woche)</option>
          <option>Vollzeit</option>
          <option>Noch offen</option>
        </select>
      </div>

      <div><label htmlFor="ap-why" className="label">Warum möchtest du bei TarifWerk beraten? *</label><textarea id="ap-why" rows={4} className="field" value={f.why} onChange={(e) => set("why", e.target.value)} required /></div>

      <div>
        <p className="label">Wie sollen wir uns melden?</p>
        <div className="flex flex-wrap gap-2">
          {[["whatsapp", "WhatsApp"], ["telefon", "Telefon"], ["email", "E-Mail"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => set("channel", v)} aria-pressed={f.channel === v} className={`chip h-10 px-4 text-[13.5px] ${f.channel === v ? "border-electric bg-electric text-white" : "border-line bg-white text-ink-700"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="hidden" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} /></label></div>

      <label className="flex items-start gap-3 text-[13.5px] text-steel">
        <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-electric" />
        <span>Ich bin einverstanden, dass TarifWerk meine Angaben zur Bearbeitung meiner Bewerbung verarbeitet. <Link href="/datenschutz" className="underline underline-offset-2">Datenschutz</Link></span>
      </label>

      {error && <p role="alert" className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-600">{error}</p>}

      <div>
        <Button type="submit" size="lg" disabled={loading} iconRight={loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}>
          {loading ? "Wird gesendet…" : "Bewerbung absenden"}
        </Button>
      </div>
    </form>
  );
}
