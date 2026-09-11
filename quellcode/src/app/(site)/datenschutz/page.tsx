import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/content";

export const metadata: Metadata = { title: "Datenschutzerklärung", robots: { index: false } };

export default function DatenschutzPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Datenschutzerklärung">
      <section>
        <h2>1. Verantwortlicher</h2>
        <p>
          {SITE.founder}, TarifWerk, Wiesbaden · E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </section>
      <section>
        <h2>2. Welche Daten wir verarbeiten</h2>
        <h3>Besuch der Website</h3>
        <p>
          Beim Aufruf werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp) in Server-Logs verarbeitet, um die
          Website sicher bereitzustellen (Art. 6 Abs. 1 lit. f DSGVO). Wir setzen keine Tracking-Cookies und keine Analyse-Tools von Drittanbietern ein.
        </p>
        <h3>Anfragen, Terminwünsche und Bewerbungen</h3>
        <p>
          Wenn du ein Formular nutzt, verarbeiten wir die von dir angegebenen Daten (z. B. Name, E-Mail, Telefon, Thema, Region, Nachricht)
          ausschließlich zur Bearbeitung deiner Anfrage bzw. Bewerbung und zur Kontaktaufnahme (Art. 6 Abs. 1 lit. a und b DSGVO). Die Daten werden in
          unserem geschützten internen System gespeichert und nur den zuständigen Beraterinnen und Beratern zugänglich gemacht.
        </p>
        <h3>WhatsApp, Telefon, E-Mail</h3>
        <p>
          Kontaktierst du uns über WhatsApp, gelten zusätzlich die Datenschutzbestimmungen von WhatsApp (Meta Platforms Ireland Ltd.). Nutze diesen Weg
          bitte nur, wenn du damit einverstanden bist. Alternativ stehen Telefon, E-Mail und unser Formular zur Verfügung.
        </p>
        <h3>Externe Bilder</h3>
        <p>Einzelne Bilder werden von images.pexels.com geladen; dabei wird deine IP-Adresse an diesen Anbieter übermittelt.</p>
      </section>
      <section>
        <h2>3. Weitergabe</h2>
        <p>
          Eine Weitergabe an Dritte erfolgt nur, wenn dies zur Erfüllung deines Auftrags erforderlich ist (z. B. an den Anbieter eines von dir
          gewünschten Vertrags) und du dem zugestimmt hast. Ein Verkauf deiner Daten findet nicht statt.
        </p>
      </section>
      <section>
        <h2>4. Speicherdauer</h2>
        <p>
          Anfragen speichern wir so lange, wie es für die Bearbeitung und eine mögliche Folgeberatung erforderlich ist, längstens jedoch bis zu deinem
          Widerruf oder dem Ablauf gesetzlicher Aufbewahrungsfristen. Bewerbungsdaten löschen wir spätestens sechs Monate nach Abschluss des Verfahrens,
          sofern keine Zusammenarbeit zustande kommt.
        </p>
      </section>
      <section>
        <h2>5. Deine Rechte</h2>
        <ul>
          <li>Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21)</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft</li>
          <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde, z. B. dem Hessischen Beauftragten für Datenschutz und Informationsfreiheit</li>
        </ul>
        <p>Schreib uns dazu einfach an <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </section>
      <section>
        <h2>6. Sicherheit</h2>
        <p>Die Übertragung erfolgt verschlüsselt (TLS). Der interne Mitarbeiterbereich ist passwortgeschützt und nur für berechtigte Personen zugänglich.</p>
      </section>
      <p className="text-steel">Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</p>
    </LegalPage>
  );
}
