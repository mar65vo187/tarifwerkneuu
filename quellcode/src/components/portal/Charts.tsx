"use client";

import { motion } from "framer-motion";

export function BarSeries({ data }: { data: { day: string; label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5">
        {data.map((d, i) => (
          <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
              transition={{ duration: 0.7, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full rounded-t-md ${d.count > 0 ? "bg-electric" : "bg-paper-2"}`}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-steel">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function TopicBars({ data }: { data: { topic: string; count: number }[] }) {
  if (data.length === 0) return <p className="text-[14px] text-steel">Noch keine Daten.</p>;
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={d.topic}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="truncate font-semibold text-ink">{d.topic}</span>
            <span className="text-steel">{d.count}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-electric-deep to-electric-soft"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
