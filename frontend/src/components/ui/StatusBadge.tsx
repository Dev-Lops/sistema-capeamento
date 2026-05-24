import { cn } from "../../lib/cn";

const styles: Record<string, string> = {
  planejado: "badge-blue",
  planejada: "badge-blue",
  em_execucao: "badge-amber",
  em_andamento: "badge-amber",
  concluido: "badge-green",
  alta: "badge-red",
  media: "badge-amber",
  baixa: "badge-slate",
};

type Props = {
  value: string;
  className?: string;
};

export default function StatusBadge({ value, className }: Props) {
  const label = value.replace(/_/g, " ");
  const variant = styles[value] ?? "badge-slate";

  return (
    <span className={cn("badge", variant, className)}>
      {label}
    </span>
  );
}
