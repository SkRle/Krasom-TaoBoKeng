"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Option } from "@/lib/constants";

const ALL = "__all__";

export type ToolbarFilter = {
  name: string;
  placeholder: string;
  options: Option[];
};

/** ค้นหาและกรองข้อมูลผ่าน URL (?q=...&status=...) ให้เซิร์ฟเวอร์ query ใหม่ */
export function TableToolbar({
  searchPlaceholder = "ค้นหา...",
  filters = [],
}: {
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function update(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  useEffect(() => {
    if (query === (searchParams.get("q") ?? "")) return;
    const timer = setTimeout(() => update({ q: query.trim() || null }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 bg-background/60 pr-9 pl-9"
          aria-label="ค้นหา"
        />
        {isPending ? (
          <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="ล้างคำค้นหา"
            >
              <X className="size-4" />
            </button>
          )
        )}
      </div>
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {filters.map((f) => {
            const value = searchParams.get(f.name) ?? ALL;
            const label = f.options.find((o) => o.value === value)?.label ?? `${f.placeholder}ทั้งหมด`;
            return (
            <Select
              key={f.name}
              value={value}
              onValueChange={(v) => update({ [f.name]: v === ALL ? null : v })}
            >
              <SelectTrigger className="h-10! min-w-36 bg-background/60" aria-label={f.placeholder}>
                <SelectValue placeholder={f.placeholder}>{label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{f.placeholder}ทั้งหมด</SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            );
          })}
        </div>
      )}
    </div>
  );
}
