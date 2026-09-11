import { Hero } from "@/components/home/Hero";
import { FinderTeaser } from "@/components/home/FinderTeaser";
import { TopicTicker } from "@/components/home/TopicTicker";
import {
  EverydaySection,
  FaqSection,
  FinalCta,
  FocusSection,
  Founder,
  Manifesto,
  Process,
  TrustStrip,
} from "@/components/home/Sections";
import { FAQ } from "@/lib/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.slice(0, 5).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <TrustStrip />
      <TopicTicker />
      <FocusSection />
      <EverydaySection />
      <Manifesto />
      <FinderTeaser />
      <Process />
      <Founder />
      <FaqSection />
      <FinalCta />
    </>
  );
}
