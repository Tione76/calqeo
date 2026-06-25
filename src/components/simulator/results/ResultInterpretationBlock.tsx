import type { InterpretationLevel } from "@/lib/simulators/types";

const styles: Record<
  InterpretationLevel,
  { wrap: string; badge: string; icon: string }
> = {
  favorable: {
    wrap: "border-emerald-200 bg-emerald-50/80",
    badge: "bg-emerald-100 text-emerald-800",
    icon: "🟢",
  },
  intermediate: {
    wrap: "border-amber-200 bg-amber-50/80",
    badge: "bg-amber-100 text-amber-800",
    icon: "🟠",
  },
  warning: {
    wrap: "border-red-200 bg-red-50/80",
    badge: "bg-red-100 text-red-800",
    icon: "🔴",
  },
  neutral: {
    wrap: "border-slate-200 bg-slate-50",
    badge: "bg-slate-100 text-slate-700",
    icon: "ℹ️",
  },
};

interface Props {
  level: InterpretationLevel;
  badge?: string;
  title: string;
  message: string;
}

export function ResultInterpretationBlock({
  level,
  badge,
  title,
  message,
}: Props) {
  const s = styles[level];
  return (
    <div className={`rounded-xl border p-4 ${s.wrap}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span aria-hidden className="text-base">
          {s.icon}
        </span>
        <p className="font-semibold text-slate-900">{title}</p>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{message}</p>
    </div>
  );
}
