import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string[];
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="font-normal">
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      {children}
      {error?.[0] ? (
        <p className="text-xs text-primary">{error[0]}</p>
      ) : (
        hint && <p className="text-xs font-light text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
