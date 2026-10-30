import { TableCard } from "@/components/shared/table-card";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <TableCard toolbar={<Skeleton className="h-9 w-full max-w-sm" />}>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="hidden h-4 w-28 md:block" />
            <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
          </div>
        ))}
      </div>
    </TableCard>
  );
}
