"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { forwardRef, useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light" | "whatsapp" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-[background,color,box-shadow,border-color] duration-300 ease-premium select-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-white shadow-[0_10px_30px_-10px_rgba(79,141,255,0.8)] hover:bg-electric-deep hover:shadow-[0_14px_40px_-10px_rgba(79,141,255,0.9)]",
  secondary:
    "border border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/25",
  ghost: "text-white/80 hover:text-white hover:bg-white/8",
  light: "bg-white text-ink shadow-[0_10px_30px_-12px_rgba(6,11,22,0.4)] hover:bg-paper",
  dark: "bg-ink text-white hover:bg-ink-800 shadow-[0_10px_30px_-12px_rgba(6,11,22,0.5)]",
  whatsapp:
    "bg-[#25D366] text-ink-900 hover:bg-[#1fc15b] shadow-[0_10px_30px_-12px_rgba(37,211,102,0.7)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13.5px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-[16px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
};

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };
type LinkProps = CommonProps & { href: string; target?: string; rel?: string; onClick?: () => void };

function useMagnetic(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return { ref, sx, sy, onMove, onLeave };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps | LinkProps>(function Button(props, _ref) {
  const { variant = "primary", size = "md", className = "", children, magnetic = true, icon, iconRight } = props;
  const { ref, sx, sy, onMove, onLeave } = useMagnetic(magnetic);
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const inner = (
    <>
      {icon && <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="shrink-0 transition-transform duration-300 ease-premium group-hover/btn:translate-x-0.5 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {iconRight}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    return (
      <motion.span style={{ x: sx, y: sy }} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
        {external ? (
          <a
            ref={(el) => {
              ref.current = el;
            }}
            href={href}
            target={target}
            rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
            className={`group/btn ${cls}`}
            onClick={onClick}
          >
            {inner}
          </a>
        ) : (
          <Link
            ref={(el) => {
              ref.current = el;
            }}
            href={href}
            className={`group/btn ${cls}`}
            onClick={onClick}
          >
            {inner}
          </Link>
        )}
      </motion.span>
    );
  }

  const { href: _h, variant: _v, size: _s, className: _c, magnetic: _m, icon: _i, iconRight: _ir, ...rest } =
    props as ButtonProps;
  void _h; void _v; void _s; void _c; void _m; void _i; void _ir; void _ref;

  return (
    <motion.span style={{ x: sx, y: sy }} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
      <button
        ref={(el) => {
          ref.current = el;
        }}
        className={`group/btn ${cls}`}
        {...rest}
      >
        {inner}
      </button>
    </motion.span>
  );
});
