"use client";

import { useRouter } from "next/navigation";
import { CalendarCheck, Check, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { LEAD_STATUS_LABELS } from "@/lib/content";
import { STATUS_STYLES } from "./ui";

type Props = { leadId: number; status: string; confirmedSlot: string | null; assigned: boolean; isAppointment: boolean };

export function LeadActions({ leadId, status, confirmedSlot, assigned, isAppointment }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slot, setSlot] = useState(confirmedSlot ?? "");
  const [note, setNote] = useState("");

  const patch = async (key: string, body: Record<string, unknown>) => {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/portal/leads/${leadId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Speichern fehlgeschlagen.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Verbindung fehlgeschlagen.");
      return false;
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {!assigned && (
        <button type="button" onClick={() => patch("assign", { assignToMe: true })} disabled={busy !== null} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white hover:bg-electric disabled:opacity-60">
          {busy === "assign" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Anfrage übernehmen
        </button>
      )}

      <div>
        <p className="label">Status</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LEAD_STATUS_LABELS).map(([k, label]) => (
            <button
              key={k}
              type="button"
              disabled={busy !== null || k === status}
              onClick={() => patch(`status:${k}`, { status: k, confirmedSlot: k === "termin_bestaetigt" && slot ? slot : undefined })}
              className={`chip h-9 px-3.5 transition-all disabled:cursor-default ${k === status ? STATUS_STYLES[k] + " ring-2 ring-offset-1 ring-ink/10" : "border-line bg-white text-ink-700 hover:border-ink/40"}`}
            >
              {busy === `status:${k}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <p className="inline-flex items-center gap-2 text-[14px] font-bold text-emerald-900"><CalendarCheck className="h-4 w-4" /> {isAppointment ? "Termin bestätigen" : "Termin vereinbaren"}</p>
        <p className="mt-1 text-[12.5px] text-emerald-800/80">Trage die abgestimmte Zeit ein. Der Status wechselt auf „Termin bestätigt“ und wird im Verlauf dokumentiert.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input className="field flex-1" placeholder="z. B. Di, 14.05. · 18:30 Uhr · Video-Call" value={slot} onChange={(e) => setSlot(e.target.value)} />
          <button type="button" disabled={busy !== null || !slot.trim()} onClick={() => patch("confirm", { status: "termin_bestaetigt", confirmedSlot: slot.trim() })} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-[14px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy === "confirm" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Bestätigen
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="label">Interne Notiz</label>
        <textarea id="note" rows={3} className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gesprächsnotiz, nächste Schritte, Besonderheiten …" />
        <button
          type="button"
          disabled={busy !== null || !note.trim()}
          onClick={async () => {
            const ok = await patch("note", { note: note.trim() });
            if (ok) setNote("");
          }}
          className="mt-2 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13.5px] font-semibold text-ink hover:border-ink/40 disabled:opacity-50"
        >
          {busy === "note" ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Notiz speichern
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</p>}
    </div>
  );
}
