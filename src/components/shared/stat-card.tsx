import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  hint,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{value.toLocaleString("th-TH")}</p>
        {hint && <p className="mt-1 text-xs font-light text-muted-foreground">{hint}</p>}
      </div>
    </Link>
  );
}
