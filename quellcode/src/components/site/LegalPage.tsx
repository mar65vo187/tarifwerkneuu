import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} compact />
      <section className="bg-paper py-16">
        <div className="container-x">
          <article className="prose-legal max-w-3xl space-y-8 text-[15.5px] leading-relaxed text-ink-700 [&_h2]:mt-8 [&_h2]:text-[20px] [&_h2]:font-extrabold [&_h2]:text-ink [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-ink [&_a]:text-electric-deep [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mt-2">
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
