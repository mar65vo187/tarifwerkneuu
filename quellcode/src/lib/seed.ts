import { sql } from "drizzle-orm";
import { db } from "@/db";
import { advisors, employees } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

/**
 * Idempotentes Seeding für frische Umgebungen.
 * Legt Gründer-Profil und Admin-Zugang an, falls noch keine Daten existieren.
 * Läuft maximal einmal pro Server-Prozess.
 */
let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = run().catch((err) => {
      console.error("[seed] failed", err);
      seedPromise = null; // erneuter Versuch beim nächsten Aufruf
    });
  }
  return seedPromise;
}

async function run() {
  const [{ count: advisorCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(advisors);
  if (advisorCount === 0) {
    await db
      .insert(advisors)
      .values({
        slug: "marvin-egenolf",
        name: "Marvin Noel Egenolf",
        title: "Gründer & Senior Sales Consultant",
        city: "Wiesbaden",
        region: "Rhein-Main",
        regions: ["Wiesbaden", "Mainz", "Frankfurt am Main", "Worms", "Deutschlandweit (digital)"],
        topics: ["Internet, Mobilfunk, TV", "Strom & Gas", "Versicherungen", "Sicherheitslösungen", "Klimaanlagen", "Solar (Photovoltaik) & Wärmepumpe", "Edelmetalle", "Immobilien"],
        bio: "Marvin hat TarifWerk gegründet, weil er selbst erlebt hat, wie unübersichtlich Verträge und große Entscheidungen sein können. Sein Anspruch: erklären, bis es wirklich verständlich ist – und danach erreichbar bleiben.",
        quote: "Ich will, dass du nach unserem Gespräch klarer siehst als davor. Alles andere ergibt sich.",
        phone: "+4915782301076",
        whatsapp: "4915782301076",
        email: "m.egenolf@tarifwerk.eu",
        initials: "ME",
        isFounder: true,
        sortOrder: 1,
      })
      .onConflictDoNothing();
  }

  const [{ count: employeeCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(employees);
  if (employeeCount === 0) {
    const [founder] = await db.select({ id: advisors.id }).from(advisors).limit(1);
    const email = (process.env.PORTAL_ADMIN_EMAIL || "m.egenolf@tarifwerk.eu").toLowerCase();
    const password = process.env.PORTAL_ADMIN_PASSWORD || "TarifWerk2026!";
    await db
      .insert(employees)
      .values({ name: "Marvin Noel Egenolf", email, passwordHash: hashPassword(password), role: "admin", advisorId: founder?.id ?? null })
      .onConflictDoNothing();
  }
}
