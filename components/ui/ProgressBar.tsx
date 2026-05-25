import clsx from "clsx";

const barTones = {
  amber: "bg-amber-400",
  cyan: "bg-cyan-400",
  green: "bg-emerald-400",
  violet: "bg-violet-400",
  slate: "bg-slate-400",
} as const;

export function ProgressBar({
  value,
  tone = "cyan",
}: {
  value: number;
  tone?: keyof typeof barTones;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className={clsx("h-full rounded-full transition-all", barTones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
