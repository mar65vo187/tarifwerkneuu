import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { whatsappLink } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 text-white grain">
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-[140px]" />
      <div className="relative max-w-lg text-center">
        <LogoMark size={56} className="mx-auto" />
        <p className="eyebrow mt-8 justify-center text-electric-soft">404</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.02]">
          Diese Seite gibt es nicht. <span className="display-i font-normal text-champagne-soft">Klarheit schon.</span>
        </h1>
        <p className="mt-5 text-[16px] text-silver">Kein Drama. Am besten startest du auf der Startseite – oder fragst uns direkt.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-full bg-electric px-6 font-semibold text-white hover:bg-electric-deep">
            Zur Startseite <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 font-semibold text-white hover:bg-white/10">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
