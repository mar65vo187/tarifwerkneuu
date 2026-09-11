# TarifWerk – Premium Website & Mitarbeiter-Portal

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion · Drizzle ORM · PostgreSQL

## Struktur

| Bereich | Pfad |
| --- | --- |
| Öffentliche Website | `src/app/(site)/…` – Start, Berater-Finder, Berater-Profil, Anfrage, Leistungen (8 SEO-Landingpages), Über uns, Karriere, FAQ, Rechtliches |
| Mitarbeiter-Portal | `src/app/portal/…` – Login, Übersicht/Auswertungen, Lead-Verwaltung, Terminbestätigung, Team-Chat |
| API | `src/app/api/leads` (öffentlich, validiert, rate-limited) · `src/app/api/portal/*` (Session-geschützt) |
| Inhalte (Single Source of Truth) | `src/lib/content.ts` |
| Datenmodell | `src/db/schema.ts` (advisors, employees, leads, lead_notes, team_messages) |
| Auth | `src/lib/auth.ts` – scrypt-Passwörter, HMAC-signierte HttpOnly-Session-Cookies |

## Portal-Zugang (Seed)

- E-Mail: `m.egenolf@tarifwerk.eu`
- Passwort: `TarifWerk2026!` (über `PORTAL_ADMIN_PASSWORD` in `.env` änderbar – **vor Go-live ändern**)

Das Seeding läuft idempotent automatisch (`src/lib/seed.ts`) oder manuell via `node scripts/seed.mjs`.

## Umgebungsvariablen

```
DATABASE_URL=postgresql://…
SESSION_SECRET=<mind. 32 zufällige Zeichen>   # empfohlen für Produktion
PORTAL_ADMIN_EMAIL=…                          # optional
PORTAL_ADMIN_PASSWORD=…                       # optional
```

## Weitere Berater anlegen

Neue Berater-Profile per SQL/Drizzle in `advisors` einfügen (slug, name, title, city, region, regions[], topics[], bio, whatsapp …).
Portal-Accounts in `employees` (Passwort-Hash via `hashPassword()` aus `src/lib/auth.ts`).

## Hinweise

- Keine Secrets im Client-Bundle; alle externen Kontakte (WhatsApp, Tel) sind öffentliche Kontaktdaten.
- Impressum: vollständige Geschäftsadresse vor Veröffentlichung ergänzen (`src/app/(site)/impressum/page.tsx`).
