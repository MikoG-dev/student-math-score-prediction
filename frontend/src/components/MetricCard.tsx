import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  description: string;
  colorClass: string;
  delay?: number;
}

export function MetricCard({ label, value, description, colorClass, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="opacity-0 animate-fade-up group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className={cn("absolute top-0 left-0 h-1 w-full", colorClass)} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-3xl font-semibold font-mono tracking-tight tabular-nums">
          {value.toFixed(4)}
        </p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
