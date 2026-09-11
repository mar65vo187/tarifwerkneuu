"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Verbindung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-5 py-12 text-white grain">
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-electric/20 blur-[140px]" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo size={40} /></div>
        <div className="glass rounded-[28px] p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-electric/15 text-electric-soft"><Lock className="h-4.5 w-4.5" /></span>
            <div>
              <h1 className="text-[22px] font-extrabold">Mitarbeiter-Login</h1>
              <p className="text-[13px] text-silver">Nur für das TarifWerk-Team</p>
            </div>
          </div>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-platinum">E-Mail</label>
              <input id="email" type="email" className="field-dark" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-platinum">Passwort</label>
              <input id="password" type="password" className="field-dark" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">{error}</p>}
            <button type="submit" disabled={loading} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-electric font-semibold text-white transition-colors hover:bg-electric-deep disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Anmelden…" : "Anmelden"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-[13px] text-steel">
          <Link href="/" className="hover:text-white">← Zurück zur Website</Link>
        </p>
      </motion.div>
    </main>
  );
}
