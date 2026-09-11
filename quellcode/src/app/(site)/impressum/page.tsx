import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/content";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function ImpressumPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum">
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          TarifWerk
          <br />
          Inhaber: {SITE.founder}
          <br />
          Wiesbaden, Deutschland
        </p>
        <p className="text-steel">Die vollständige Geschäftsadresse wird auf Anfrage mitgeteilt und vor Veröffentlichung ergänzt.</p>
      </section>
      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: {SITE.whatsappDisplay}
          <br />
          E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </section>
      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>{SITE.founder}, Anschrift wie oben.</p>
      </section>
      <section>
        <h2>Hinweis zur Tätigkeit</h2>
        <p>
          TarifWerk vermittelt Produkte und Dienstleistungen verschiedener Anbieter (u. a. Telekommunikation, Energie, Photovoltaik, Wärmepumpen,
          Immobilien, Edelmetalle, Versicherungen). Für vermittelte Verträge erhält TarifWerk eine Provision des jeweiligen Anbieters. Erstgespräch und
          Prüfung sind für Kundinnen und Kunden kostenlos. Erlaubnispflichtige Tätigkeiten werden ausschließlich durch entsprechend zugelassene
          Partner erbracht.
        </p>
      </section>
      <section>
        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr/" rel="noopener noreferrer" target="_blank">ec.europa.eu/consumers/odr</a>. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </LegalPage>
  );
}
