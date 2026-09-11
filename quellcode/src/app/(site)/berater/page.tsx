import type { Metadata } from "next";
import { Suspense } from "react";
import { AdvisorFinder } from "@/components/advisors/AdvisorFinder";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getActiveAdvisors } from "@/lib/queries";
import { FinalCta } from "@/components/home/Sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Persönlichen Berater finden – Wiesbaden, Mainz, Frankfurt & deutschlandweit",
  description:
    "Wähle Thema und Region und finde deinen persönlichen TarifWerk-Berater: Immobilien, Edelmetalle, Solar, Wärmepumpe, Internet, Mobilfunk, Energie, Versicherungen. Per WhatsApp, Anruf oder Termin.",
  alternates: { canonical: "/berater" },
};

export default async function AdvisorsPage() {
  const advisors = await getActiveAdvisors();

  return (
    <>
      <PageHero
        eyebrow="Berater finden"
        title={
          <>
            Ein Mensch, der <span className="display-i font-normal text-champagne-soft">zu dir</span> passt – nicht irgendein Kontaktformular.
          </>
        }
        text="Wähle dein Thema und deine Region. Du siehst sofort, wer dich begleiten kann – mit Schwerpunkten, Kontaktwegen und direkter Terminanfrage."
        compact
      />
      <section className="bg-paper pb-24">
        <div className="container-x">
          <Suspense fallback={<div className="skeleton mt-8 h-64 rounded-[26px]" />}>
            <AdvisorFinder advisors={advisors} />
          </Suspense>
          <Reveal className="mt-14 rounded-[26px] border border-line bg-white p-7 sm:p-9">
            <p className="eyebrow text-electric-deep">Das Team wächst</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold text-ink">Wir nehmen lieber wenige richtige Berater als viele schnelle.</h2>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-steel">
              Jeder Berater bei TarifWerk arbeitet nach denselben Grundsätzen: verständlich erklären, unabhängig einordnen, erreichbar bleiben. Du
              möchtest Teil davon werden? <a href="/karriere" className="font-semibold text-electric-deep underline underline-offset-2">Hier erfährst du mehr.</a>
            </p>
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
