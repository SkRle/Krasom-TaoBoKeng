import { connection } from "next/server";
import { Contact, HandHeart, User, UserRound } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "../queries";

export async function DashboardStats() {
  await connection();
  const s = await getDashboardStats();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="ม้าทรงชาย" value={s.male} icon={User} href="/mediums?sex=male" />
      <StatCard label="ม้าทรงหญิง" value={s.female} icon={UserRound} href="/mediums?sex=female" />
      <StatCard label="พี่เลี้ยง" value={s.helpers} icon={HandHeart} href="/helpers" />
      <StatCard label="คณะกรรมการ" value={s.board} icon={Contact} href="/board" />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}
