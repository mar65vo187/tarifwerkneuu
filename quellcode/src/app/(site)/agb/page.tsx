import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "AGB", robots: { index: false } };

export default function AgbPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Allgemeine Geschäftsbedingungen">
      <section>
        <h2>1. Geltungsbereich</h2>
        <p>Diese Bedingungen gelten für die Beratungs- und Vermittlungsleistungen von TarifWerk gegenüber Privat- und Geschäftskunden.</p>
      </section>
      <section>
        <h2>2. Leistungen</h2>
        <p>
          TarifWerk bietet eine kostenlose Erstorientierung und vermittelt auf Wunsch Verträge und Produkte Dritter. Die inhaltliche Leistung (z. B.
          Internetanschluss, Energielieferung, Photovoltaikanlage, Versicherungsschutz) erbringt ausschließlich der jeweilige Anbieter zu dessen
          Bedingungen. TarifWerk wird nicht Vertragspartner dieser Leistungen.
        </p>
      </section>
      <section>
        <h2>3. Vergütung</h2>
        <p>
          Erstgespräch und Prüfung sind für den Kunden kostenlos. Für vermittelte Verträge erhält TarifWerk eine Provision vom Anbieter. Hierdurch
          entstehen dem Kunden keine zusätzlichen Kosten.
        </p>
      </section>
      <section>
        <h2>4. Termine</h2>
        <p>
          Terminwünsche über die Website sind Anfragen und werden erst durch ausdrückliche Bestätigung eines Beraters verbindlich. Termine können
          beidseitig kostenfrei verschoben oder abgesagt werden.
        </p>
      </section>
      <section>
        <h2>5. Keine Erfolgsgarantie</h2>
        <p>
          TarifWerk gibt keine Garantien für Einsparungen, Renditen oder Wertentwicklungen. Alle Einschätzungen beruhen auf den vom Kunden gemachten
          Angaben und den zum Zeitpunkt der Beratung verfügbaren Informationen. Die Entscheidung über den Abschluss eines Vertrags liegt allein beim Kunden.
        </p>
      </section>
      <section>
        <h2>6. Haftung</h2>
        <p>
          TarifWerk haftet für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung wesentlicher Vertragspflichten nach den gesetzlichen Vorschriften.
          Im Übrigen ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
        </p>
      </section>
      <section>
        <h2>7. Schlussbestimmungen</h2>
        <p>Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
      </section>
    </LegalPage>
  );
}
