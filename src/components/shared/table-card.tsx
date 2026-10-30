import { cn } from "@/lib/utils";

/** กรอบตารางสีขาวตามแบบ Dribbble: toolbar ด้านบน, ตาราง, pagination ด้านล่าง */
export function TableCard({
  toolbar,
  footer,
  children,
  className,
}: {
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl bg-card ring-1 ring-border", className)}>
      {toolbar && <div className="border-b border-border p-4">{toolbar}</div>}
      <div className="overflow-x-auto">{children}</div>
      {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
    </section>
  );
}
