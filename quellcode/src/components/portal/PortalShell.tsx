"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Inbox, LogOut, MessageSquare, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/portal", label: "Übersicht", icon: BarChart3, exact: true },
  { href: "/portal/leads", label: "Anfragen & Termine", icon: Inbox },
  { href: "/portal/chat", label: "Team-Chat", icon: MessageSquare },
];

export function PortalShell({ user, children, openCount }: { user: SessionUser; children: ReactNode; openCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink px-5 py-3 text-white lg:h-screen lg:flex-col lg:items-stretch lg:justify-start lg:border-b-0 lg:border-r lg:border-white/8 lg:px-5 lg:py-6">
        <Logo size={30} href="/portal" />
        <nav className="flex gap-1 lg:mt-8 lg:flex-col" aria-label="Portal">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  active ? "bg-white/10 text-white" : "text-silver hover:bg-white/6 hover:text-white"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="hidden lg:inline">{n.label}</span>
                {n.href === "/portal/leads" && openCount > 0 && (
                  <span className="ml-auto hidden rounded-full bg-electric px-2 py-0.5 text-[11px] font-bold text-white lg:inline">{openCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:mt-auto lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-silver hover:text-white"><ExternalLink className="h-3.5 w-3.5" /> Website öffnen</Link>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-platinum to-electric text-[12px] font-extrabold text-ink">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold">{user.name}</p>
              <p className="text-[11.5px] uppercase tracking-wider text-silver">{user.role}</p>
            </div>
            <button type="button" onClick={logout} className="grid h-8 w-8 place-items-center rounded-lg text-silver hover:bg-white/10 hover:text-white" aria-label="Abmelden">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button type="button" onClick={logout} className="grid h-9 w-9 place-items-center rounded-lg text-silver hover:bg-white/10 lg:hidden" aria-label="Abmelden">
          <LogOut className="h-4 w-4" />
        </button>
      </aside>
      <div className="min-w-0">
        <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
