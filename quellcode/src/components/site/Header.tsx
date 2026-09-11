"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SITE, SERVICES, whatsappLink } from "@/lib/content";

const NAV = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/berater", label: "Berater" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/karriere", label: "Karriere" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Menü bei Routenwechsel schließen (ohne setState im Effekt-Body)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-electric focus:px-4 focus:py-2 focus:text-white"
      >
        Zum Inhalt springen
      </a>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-500 ease-premium ${
            scrolled || open ? "bg-ink/80 backdrop-blur-xl border-b border-white/8" : "bg-transparent border-b border-transparent"
          }`}
        >
          <div className="container-x flex h-[72px] items-center justify-between">
            <Logo size={34} imageSrc="/assets/logo-symbol.jpg" />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
              {NAV.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + "/");
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`relative rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ${
                      active ? "text-white" : "text-silver hover:text-white"
                    }`}
                  >
                    {n.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-electric"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <a
                href={whatsappLink("Hallo TarifWerk, ich hätte eine Frage.")}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="WhatsApp schreiben"
              >
                <MessageCircle className="h-[18px] w-[18px]" />
              </a>
              <Button href="/berater" size="sm" iconRight={<ArrowRight />}>
                Berater finden
              </Button>
            </div>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-x flex h-full flex-col overflow-y-auto pt-[88px] pb-8">
              <motion.nav
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                className="flex shrink-0 flex-col"
                aria-label="Mobile Navigation"
              >
                {NAV.map((n) => (
                  <motion.div key={n.href} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                    <Link
                      href={n.href}
                      className="flex items-center justify-between border-b border-white/8 py-4 text-[26px] font-semibold tracking-tight text-white"
                    >
                      {n.label}
                      <ArrowRight className="h-5 w-5 text-electric-soft" />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/leistungen/${s.slug}`}
                    className="chip border-white/12 text-silver hover:border-electric hover:text-white"
                  >
                    {s.shortLabel || s.name}
                  </Link>
                ))}
              </motion.div>

              <div className="mt-auto grid gap-3 pt-8">
                <Button href="/berater" size="lg" iconRight={<ArrowRight />} className="w-full">
                  Berater finden
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button href={whatsappLink()} target="_blank" variant="whatsapp" icon={<MessageCircle />} className="w-full">
                    WhatsApp
                  </Button>
                  <Button href={SITE.phoneHref} variant="secondary" icon={<Phone />} className="w-full">
                    Anrufen
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
