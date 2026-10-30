import { optionLabel, STATUS_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-primary text-primary-foreground",
  inactive: "bg-accent text-primary ring-1 ring-primary/25",
  retired: "bg-muted text-muted-foreground ring-1 ring-border",
};

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">-</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[status] ?? "bg-muted text-foreground ring-1 ring-border",
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {optionLabel(STATUS_OPTIONS, status)}
    </span>
  );
}
