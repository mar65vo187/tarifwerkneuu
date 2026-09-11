import { SERVICES } from "@/lib/content";

export function TopicTicker() {
  return (
    <div id="themen-laufband" role="region" aria-label="Alle Themenbereiche – zum Anhalten berühren oder fokussieren" className="overflow-hidden border-b border-white/8 bg-ink py-5 text-platinum motion-reduce:overflow-x-auto">
      <div tabIndex={0} className="animate-marquee flex w-max items-center focus-within:[animation-play-state:paused] motion-reduce:animate-none" data-topic-ticker="">
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined} className={`flex shrink-0 items-center ${copy ? "motion-reduce:hidden" : ""}`}>
            {SERVICES.map((service) => (
              <li key={service.key} className="flex shrink-0 items-center gap-6 px-6 text-[14px] font-semibold tracking-wide">
                <span className="whitespace-nowrap">{service.tickerLabel || service.name}</span>
                <span aria-hidden="true" className="text-electric-soft">·</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
