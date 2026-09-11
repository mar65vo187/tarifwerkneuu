import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function PageHero({
  eyebrow,
  title,
  text,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden bg-ink text-white grain ${compact ? "pt-[120px] pb-14" : "pt-[140px] pb-20 sm:pb-24"}`}>
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-electric/18 blur-[130px]" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow text-electric-soft">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.2rem,5.4vw,4.4rem)] font-extrabold leading-[1.0] tracking-[-0.03em]">{title}</h1>
          {text && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-silver">{text}</p>}
        </Reveal>
        {children && <Reveal delay={0.1} className="mt-8">{children}</Reveal>}
      </div>
    </section>
  );
}
