import Link from "next/link";

type Props = { className?: string; size?: number; withWordmark?: boolean; tone?: "light" | "dark"; href?: string; imageSrc?: string };

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/assets/logo-symbol.jpg"
      width={size}
      height={size}
      alt="TarifWerk"
      decoding="async"
      style={{ width: size, height: size, objectFit: "contain" }}
      className={className}
    />
  );
}

export function Logo({ className = "", size = 34, withWordmark = true, tone = "light", href = "/", imageSrc = "/assets/logo-symbol.jpg" }: Props) {
  const text = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-silver" : "text-steel";
  return (
    <Link href={href} className={`group inline-flex items-center gap-3 ${className}`} aria-label="TarifWerk – Startseite">
      <span className="relative inline-flex">
        {imageSrc ? (
          <img src={imageSrc} width={size} height={size} alt="" decoding="async" style={{ width: size, height: size, objectFit: "contain" }} className="transition-transform duration-500 ease-premium group-hover:rotate-[-6deg] group-hover:scale-105" />
        ) : (
          <LogoMark size={size} className="transition-transform duration-500 ease-premium group-hover:rotate-[-6deg] group-hover:scale-105" />
        )}
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className={`text-[19px] font-extrabold tracking-tight ${text}`}>
            Tarif<span className="text-electric-soft">Werk</span>
          </span>
          <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${sub}`}>Beratung auf Augenhöhe</span>
        </span>
      )}
    </Link>
  );
}
