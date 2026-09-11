"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

export function Accordion({
  items,
  tone = "light",
}: {
  items: { q: string; a: string }[];
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const dark = tone === "dark";
  return (
    <div className={`divide-y ${dark ? "divide-white/10" : "divide-ink/10"}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-6 py-5 text-left transition-colors ${
                dark ? "text-white hover:text-electric-soft" : "text-ink hover:text-electric-deep"
              }`}
            >
              <span className="text-[17px] font-semibold tracking-tight sm:text-[18px]">{it.q}</span>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-premium ${
                  dark ? "border-white/15" : "border-ink/10"
                } ${isOpen ? "rotate-45 bg-electric text-white border-electric" : ""}`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className={`max-w-2xl pb-6 text-[15.5px] leading-relaxed ${dark ? "text-silver" : "text-steel"}`}>{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
