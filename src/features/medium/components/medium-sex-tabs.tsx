import { connection } from "next/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMediumSexCounts } from "../queries";

type SearchParams = Record<string, string | string[] | undefined>;

/** แท็บ ทั้งหมด / ชาย / หญิง พร้อมจำนวน */
export async function MediumSexTabs({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const sp = await searchParams;
  const current = typeof sp.sex === "string" ? sp.sex : "";
  const counts = await getMediumSexCounts();

  const tabs = [
    { value: "", label: "ทั้งหมด", count: counts.all },
    { value: "male", label: "ม้าทรงชาย", count: counts.male },
    { value: "female", label: "ม้าทรงหญิง", count: counts.female },
  ];

  return (
    <div className="mb-4 inline-flex rounded-xl bg-card p-1 ring-1 ring-border">
      {tabs.map((t) => {
        const active = current === t.value;
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(sp)) {
          if (typeof v === "string" && k !== "sex" && k !== "page") params.set(k, v);
        }
        if (t.value) params.set("sex", t.value);
        const qs = params.toString();
        return (
          <Link
            key={t.value || "all"}
            href={qs ? `/mediums?${qs}` : "/mediums"}
            scroll={false}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                active ? "bg-white/20" : "bg-muted",
              )}
            >
              {t.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
