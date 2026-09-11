"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "@/components/portal/ui";

type AdvisorRow = {
  id: number;
  name: string;
  title: string;
  city: string;
  region: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  bio: string | null;
  quote: string | null;
  active: boolean;
  sortOrder: number;
};

export default function PortalAdvisorsPage() {
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portal/admin/advisors");
        const data = await res.json();
        if (!active) return;
        if (!res.ok) throw new Error(data.error ?? "Fehler beim Laden");
        setAdvisors(data.advisors ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  const patchAdvisor = async (advisor: AdvisorRow) => {
    setSavingId(advisor.id);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        id: advisor.id,
        image: advisor.image ?? "",
        name: advisor.name,
        title: advisor.title,
        city: advisor.city,
        region: advisor.region,
        email: advisor.email ?? "",
        phone: advisor.phone ?? "",
        whatsapp: advisor.whatsapp ?? "",
        bio: advisor.bio ?? "",
        quote: advisor.quote ?? "",
        active: advisor.active,
        sortOrder: advisor.sortOrder,
      };
      const saveRes = await fetch("/api/portal/admin/advisors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error ?? "Speichern fehlgeschlagen");
      setSuccess(`Berater ${saveData.advisor.name} aktualisiert.`);
      const reloadRes = await fetch("/api/portal/admin/advisors");
      const reloadData = await reloadRes.json();
      if (!reloadRes.ok) throw new Error(reloadData.error ?? "Fehler beim Laden");
      setAdvisors(reloadData.advisors ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow text-electric-deep">Profil</p>
        <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">Berater-Bilder & Profile</h1>
      </header>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</p>}
      {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-700">{success}</p>}

      {loading ? (
        <Card><p className="text-[14px] text-steel">Lädt...</p></Card>
      ) : (
        <div className="space-y-4">
          {advisors.map((advisor) => (
            <Card key={advisor.id}>
              <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
                <div className="grid place-items-center rounded-2xl border border-line bg-paper p-4">
                  {advisor.image ? (
                    <Image src={advisor.image} alt={advisor.name} width={96} height={96} unoptimized className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-platinum to-electric font-extrabold text-ink">
                      {advisor.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Name
                      <input value={advisor.name} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, name: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Titel
                      <input value={advisor.title} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, title: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Stadt
                      <input value={advisor.city} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, city: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Region
                      <input value={advisor.region} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, region: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel md:col-span-2">
                      Bild-URL
                      <input value={advisor.image ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, image: e.target.value } : item))} className="field" placeholder="https://..." />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      E-Mail
                      <input value={advisor.email ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, email: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Telefon
                      <input value={advisor.phone ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, phone: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      WhatsApp
                      <input value={advisor.whatsapp ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, whatsapp: e.target.value } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel">
                      Sortierung
                      <input type="number" value={advisor.sortOrder} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, sortOrder: Number(e.target.value) } : item))} className="field" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel md:col-span-2">
                      Bio
                      <textarea value={advisor.bio ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, bio: e.target.value } : item))} className="field min-h-[90px]" />
                    </label>
                    <label className="grid gap-2 text-[13px] font-medium text-steel md:col-span-2">
                      Quote
                      <textarea value={advisor.quote ?? ""} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, quote: e.target.value } : item))} className="field min-h-[70px]" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="inline-flex items-center gap-2 text-[13px] font-medium text-steel">
                      <input type="checkbox" checked={advisor.active} onChange={(e) => setAdvisors((current) => current.map((item) => item.id === advisor.id ? { ...item, active: e.target.checked } : item))} />
                      Aktiv
                    </label>
                    <button type="button" disabled={savingId === advisor.id} onClick={() => patchAdvisor(advisor)} className="rounded-full bg-ink px-4 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60">
                      {savingId === advisor.id ? "Speichern..." : "Änderungen speichern"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
