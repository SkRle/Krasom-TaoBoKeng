import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PersonCell } from "@/components/shared/person-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFullName } from "@/lib/utils";
import { getRecentPeople } from "../queries";

export async function RecentPeople() {
  await connection();
  const { mediums, helpers } = await getRecentPeople();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RecentList title="ม้าทรงล่าสุด" href="/mediums" empty="ยังไม่มีข้อมูลม้าทรง">
        {mediums.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 py-3">
            <PersonCell
              {...m}
              title={formatFullName(m)}
              subtitle={m.godName.length ? `องค์เทพ: ${m.godName.join(", ")}` : m.nickName}
            />
            <StatusBadge status={m.status} />
          </li>
        ))}
      </RecentList>
      <RecentList title="พี่เลี้ยงล่าสุด" href="/helpers" empty="ยังไม่มีข้อมูลพี่เลี้ยง">
        {helpers.map((h) => (
          <li key={h.id} className="flex items-center justify-between gap-3 py-3">
            <PersonCell {...h} title={formatFullName(h)} subtitle={h.nickName} />
            <StatusBadge status={h.status} />
          </li>
        ))}
      </RecentList>
    </div>
  );
}

function RecentList({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="rounded-2xl bg-card p-5 ring-1 ring-border">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Link href={href} className="flex items-center gap-1 text-sm text-primary hover:underline">
          ดูทั้งหมด <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {children.length ? <ul className="divide-y divide-border">{children}</ul> : <EmptyState title={empty} />}
    </section>
  );
}

export function RecentPeopleSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Skeleton className="h-96 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
