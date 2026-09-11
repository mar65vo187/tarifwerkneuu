"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/portal/ui";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "berater",
  advisorId: "",
  active: true,
};

type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "berater";
  advisorId: number | null;
  active: boolean;
  advisorName: string | null;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [advisors, setAdvisors] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const [empRes, advRes] = await Promise.all([
          fetch("/api/portal/admin/employees"),
          fetch("/api/portal/admin/advisors"),
        ]);
        const empData = await empRes.json();
        const advData = await advRes.json();
        if (!active) return;
        if (!empRes.ok || !advRes.ok) throw new Error((empData.error || advData.error) ?? "Fehler beim Laden");
        setEmployees(empData.employees ?? []);
        setAdvisors((advData.advisors ?? []).map((a: { id: number; name: string }) => ({ id: a.id, name: a.name })));
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

  const advisorOptions = useMemo(() => {
    return advisors.map((a) => ({ value: String(a.id), label: a.name }));
  }, [advisors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        advisorId: form.advisorId ? Number(form.advisorId) : null,
        active: Boolean(form.active),
      };
      const res = await fetch("/api/portal/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Speichern fehlgeschlagen");
      setSuccess(`Mitarbeiter ${data.employee.name} hinzugefügt.`);
      setForm(emptyForm);
      const [empRes, advRes] = await Promise.all([
        fetch("/api/portal/admin/employees"),
        fetch("/api/portal/admin/advisors"),
      ]);
      const empData = await empRes.json();
      const advData = await advRes.json();
      if (!empRes.ok || !advRes.ok) throw new Error((empData.error || advData.error) ?? "Fehler beim Laden");
      setEmployees(empData.employees ?? []);
      setAdvisors((advData.advisors ?? []).map((a: { id: number; name: string }) => ({ id: a.id, name: a.name })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow text-electric-deep">Zugang</p>
        <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">Mitarbeiter verwalten</h1>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="grid gap-2 text-[13px] font-medium text-steel">
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Max Mustermann" required />
          </label>
          <label className="grid gap-2 text-[13px] font-medium text-steel">
            E-Mail
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="name@tarifwerk.eu" required />
          </label>
          <label className="grid gap-2 text-[13px] font-medium text-steel">
            Passwort
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field" placeholder="Mindestens 8 Zeichen" required minLength={8} />
          </label>
          <label className="grid gap-2 text-[13px] font-medium text-steel">
            Rolle
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "berater" })} className="field">
              <option value="berater">Berater</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="grid gap-2 text-[13px] font-medium text-steel">
            Berater zuordnen
            <select value={form.advisorId} onChange={(e) => setForm({ ...form, advisorId: e.target.value })} className="field">
              <option value="">Keine Zuordnung</option>
              {advisorOptions.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end rounded-xl border border-line bg-paper px-3 py-3 text-[13px] font-medium text-steel md:col-span-2 xl:col-span-1">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Aktiv
          </label>
          <div className="flex items-end md:col-span-2 xl:col-span-1">
            <button type="submit" disabled={saving} className="w-full rounded-full bg-ink px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-60">
              {saving ? "Speichern..." : "Mitarbeiter anlegen"}
            </button>
          </div>
        </form>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-700">{success}</p>}
      </Card>

      <Card>
        <h2 className="text-[16px] font-extrabold">Vorhandene Mitarbeiter</h2>
        {loading ? (
          <p className="mt-4 text-[14px] text-steel">Lädt...</p>
        ) : employees.length === 0 ? (
          <p className="mt-4 text-[14px] text-steel">Noch keine Mitarbeiter angelegt.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {employees.map((employee) => (
              <div key={employee.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{employee.name}</p>
                  <p className="text-[13px] text-steel">{employee.email} · {employee.role}</p>
                  <p className="text-[12px] text-steel">{employee.active ? "Aktiv" : "Deaktiviert"}{employee.advisorName ? ` · Berater: ${employee.advisorName}` : ""}</p>
                </div>
                <span className="chip border-line bg-white text-[12px] text-ink-700">{employee.role === "admin" ? "Admin" : "Berater"}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
