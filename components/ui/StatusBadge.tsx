import clsx from "clsx";

const tones = {
  amber: "border-amber-400/25 bg-amber-400/12 text-amber-200",
  cyan: "border-cyan-400/25 bg-cyan-400/12 text-cyan-200",
  green: "border-emerald-400/25 bg-emerald-400/12 text-emerald-200",
  orange: "border-orange-400/25 bg-orange-400/12 text-orange-200",
  red: "border-rose-400/25 bg-rose-400/12 text-rose-200",
  slate: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  violet: "border-violet-400/25 bg-violet-400/12 text-violet-200",
  zinc: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusBadge({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
