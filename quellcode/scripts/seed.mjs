/* eslint-disable */
// Idempotentes Seed: Berater-Profile + Portal-Admin.
// Ausführen: node scripts/seed.mjs
import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";
import { config } from "dotenv";

config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

const advisors = [
  {
    slug: "marvin-egenolf",
    name: "Marvin Noel Egenolf",
    title: "Gründer & Senior Sales Consultant",
    city: "Wiesbaden",
    region: "Rhein-Main",
    regions: ["Wiesbaden", "Mainz", "Frankfurt am Main", "Worms", "Deutschlandweit (digital)"],
    topics: ["Immobilien", "Edelmetalle", "Solar & Photovoltaik", "Wärmepumpe", "Internet, Glasfaser & TV", "Mobilfunk", "Strom & Gas", "Versicherungen"],
    bio: "Marvin hat TarifWerk gegründet, weil er selbst erlebt hat, wie unübersichtlich Verträge und große Entscheidungen sein können. Sein Anspruch: erklären, bis es wirklich verständlich ist – und danach erreichbar bleiben.",
    quote: "Ich will, dass du nach unserem Gespräch klarer siehst als davor. Alles andere ergibt sich.",
    phone: "+4915782301076",
    whatsapp: "4915782301076",
    email: "m.egenolf@tarifwerk.eu",
    initials: "ME",
    isFounder: true,
    sortOrder: 1,
  },
];

async function main() {
  const client = await pool.connect();
  try {
    for (const a of advisors) {
      await client.query(
        `insert into advisors (slug, name, title, city, region, regions, topics, bio, quote, phone, whatsapp, email, initials, is_founder, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         on conflict (slug) do update set
           name = excluded.name, title = excluded.title, city = excluded.city, region = excluded.region,
           regions = excluded.regions, topics = excluded.topics, bio = excluded.bio, quote = excluded.quote,
           phone = excluded.phone, whatsapp = excluded.whatsapp, email = excluded.email, initials = excluded.initials,
           is_founder = excluded.is_founder, sort_order = excluded.sort_order`,
        [a.slug, a.name, a.title, a.city, a.region, a.regions, a.topics, a.bio, a.quote, a.phone, a.whatsapp, a.email, a.initials, a.isFounder, a.sortOrder],
      );
    }

    const adminEmail = (process.env.PORTAL_ADMIN_EMAIL || "m.egenolf@tarifwerk.eu").toLowerCase();
    const adminPassword = process.env.PORTAL_ADMIN_PASSWORD || "TarifWerk2026!";
    const { rows } = await client.query("select id from employees where email = $1", [adminEmail]);
    const { rows: adv } = await client.query("select id from advisors where slug = 'marvin-egenolf'");
    if (rows.length === 0) {
      await client.query(
        `insert into employees (name, email, password_hash, role, advisor_id) values ($1,$2,$3,'admin',$4)`,
        ["Marvin Noel Egenolf", adminEmail, hashPassword(adminPassword), adv[0]?.id ?? null],
      );
      console.log(`Admin angelegt: ${adminEmail}`);
    } else {
      console.log("Admin existiert bereits – übersprungen.");
    }
    console.log("Seed abgeschlossen.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
