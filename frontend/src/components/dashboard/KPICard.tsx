import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  title: string;
  value: number;
  icon: ReactNode;
  subtitle: string;
  accent?: "blue" | "amber" | "cyan" | "green" | "red";
};

const cardStyles = {
  blue: "from-blue-500/10 to-blue-600/5 border-blue-200/60",
  amber: "from-amber-500/10 to-amber-600/5 border-amber-200/60",
  cyan: "from-cyan-500/10 to-cyan-600/5 border-cyan-200/60",
  green: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/60",
  red: "from-red-500/10 to-red-600/5 border-red-200/60",
};

const iconStyles = {
  blue: "text-blue-600",
  amber: "text-amber-600",
  cyan: "text-cyan-600",
  green: "text-emerald-600",
  red: "text-red-600",
};

export default function KPICard({
  title,
  value,
  icon,
  subtitle,
  accent = "blue",
}: Props) {
  return (
    <div
      className={cn(
        "card relative overflow-hidden bg-gradient-to-br p-6 transition hover:shadow-md",
        cardStyles[accent],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm",
            iconStyles[accent],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
