import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { REGIONS, SERVICES, SITE, whatsappLink } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-silver">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-electric/10 blur-[120px]" />
      <div className="container-x relative pt-20 pb-28 md:pb-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo size={38} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
              Ein persönlicher Ansprechpartner für die Entscheidungen, die Alltag und Vermögen wirklich betreffen.
              Unabhängig, verständlich, langfristig erreichbar.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-[14.5px]">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <MessageCircle className="h-4 w-4 text-electric-soft" /> WhatsApp {SITE.whatsappDisplay}
              </a>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-electric-soft" /> {SITE.whatsappDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-electric-soft" /> {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-electric-soft" /> {SITE.hq} · {SITE.hours}
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow text-platinum">Leistungen</h3>
            <ul className="mt-5 space-y-2.5 text-[14.5px]">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/leistungen/${s.slug}`} className="hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="eyebrow text-platinum">Unternehmen</h3>
            <ul className="mt-5 space-y-2.5 text-[14.5px]">
              <li><Link href="/berater" className="hover:text-white">Berater finden</Link></li>
              <li><Link href="/anfrage" className="hover:text-white">Anfrage stellen</Link></li>
              <li><Link href="/ueber-uns" className="hover:text-white">Über uns</Link></li>
              <li><Link href="/karriere" className="hover:text-white">Berater werden</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/portal/login" className="hover:text-white">Mitarbeiter-Login</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow text-platinum">Regionen</h3>
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px]">
              {REGIONS.map((r) => (
                <li key={r} className="chip border-white/10 text-silver">{r}</li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-steel">
              Persönlich vor Ort im Rhein-Main-Gebiet, digital in ganz Deutschland.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/8 pt-6 text-[13px] text-steel md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} TarifWerk · {SITE.founder} · Alle Rechte vorbehalten</p>
          <div className="flex gap-5">
            <Link href="/impressum" className="hover:text-white">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
