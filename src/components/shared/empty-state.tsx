import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        <Inbox className="size-5" />
      </span>
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm font-light text-muted-foreground">{description}</p>}
    </div>
  );
}
