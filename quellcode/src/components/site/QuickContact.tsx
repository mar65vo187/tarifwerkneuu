"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Users } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/content";

/** Desktop: WhatsApp-FAB · Mobile: schlanke Aktionsleiste am unteren Rand */
export function QuickContact() {
  return (
    <>
      {/* Desktop FAB */}
      <motion.a
        href={whatsappLink("Hallo TarifWerk, ich hätte gern eine kurze Einschätzung.")}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-[#25D366] py-3 pl-4 pr-5 text-[14.5px] font-semibold text-ink-900 shadow-[0_18px_40px_-12px_rgba(37,211,102,0.65)] md:inline-flex"
        aria-label="Per WhatsApp schreiben"
      >
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse-dot" />
          <MessageCircle className="relative h-5 w-5" />
        </span>
        WhatsApp
      </motion.a>

      {/* Mobile Aktionsleiste */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-3 gap-1 p-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold text-white active:bg-white/10"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" /> WhatsApp
          </a>
          <Link href="/berater" className="flex flex-col items-center gap-1 rounded-xl bg-electric py-2 text-[11px] font-semibold text-white">
            <Users className="h-5 w-5" /> Berater finden
          </Link>
          <a href={SITE.phoneHref} className="flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold text-white active:bg-white/10">
            <Phone className="h-5 w-5 text-electric-soft" /> Anrufen
          </a>
        </div>
      </div>
    </>
  );
}
