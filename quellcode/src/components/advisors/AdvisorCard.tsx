import { normalizeTopics } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Advisor } from "@/db/schema";

export function AdvisorAvatar({ initials, size = "md", className = "" }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const s = { sm: "h-12 w-12 text-[15px]", md: "h-16 w-16 text-[19px]", lg: "h-24 w-24 text-[28px]", xl: "h-36 w-36 text-[44px]" }[size];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-platinum via-electric-soft to-electric font-extrabold text-ink ring-4 ring-white/60 ${s} ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function AdvisorCard({ advisor, highlightTopic, highlightRegion }: { advisor: Advisor; highlightTopic?: string | null; highlightRegion?: string | null }) {
  const query = new URLSearchParams();
  if (highlightTopic) query.set("thema", highlightTopic);
  if (highlightRegion) query.set("region", highlightRegion);
  const profileHref = `/berater/${advisor.slug}${query.size ? `?${query}` : ""}`;
  const wa = advisor.whatsapp
    ? `https://wa.me/${advisor.whatsapp}?text=${encodeURIComponent(`Hallo ${advisor.name.split(" ")[0]}, ich habe eine Frage${highlightTopic ? ` zum Thema ${highlightTopic}` : ""}.`)}`
    : null;
  return (
    <article className="card-hover group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white p-6 sm:p-7">
      {advisor.isFounder && (
        <span className="absolute right-5 top-5 chip border-champagne/50 bg-champagne-soft/40 text-[11px] text-ink-700">Gründer</span>
      )}
      <div className="flex items-center gap-4">
        <AdvisorAvatar initials={advisor.initials} />
        <div className="min-w-0">
          <h3 className="truncate text-[19px] font-extrabold text-ink">{advisor.name}</h3>
          <p className="text-[13.5px] text-steel">{advisor.title}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-700">
            <MapPin className="h-3.5 w-3.5 text-electric-deep" /> {advisor.city} · {advisor.region}
          </p>
        </div>
      </div>

      <p className="mt-5 text-[14.5px] leading-relaxed text-steel">{advisor.bio}</p>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Schwerpunkte</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {normalizeTopics(advisor.topics).map((t) => {
            const on = highlightTopic && t === highlightTopic;
            return (
              <li key={t} className={`chip ${on ? "border-electric bg-electric text-white" : "border-line bg-paper text-ink-700"}`}>
                {t}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl bg-paper py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-[#25D366]/15"
          >
            <MessageCircle className="h-4.5 w-4.5 text-[#1fa855]" /> WhatsApp
          </a>
        )}
        {advisor.phone && (
          <a href={`tel:${advisor.phone}`} className="flex flex-col items-center gap-1 rounded-xl bg-paper py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-electric/10">
            <Phone className="h-4.5 w-4.5 text-electric-deep" /> Anruf
          </a>
        )}
        <Link
          href={`${profileHref}#termin`}
          className="flex flex-col items-center gap-1 rounded-xl bg-paper py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-electric/10"
        >
          <CalendarCheck className="h-4.5 w-4.5 text-electric-deep" /> Termin
        </Link>
      </div>

      <Link
        href={profileHref}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-[14px] font-semibold text-white transition-colors hover:bg-electric"
      >
        Profil & Termin anfragen <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
