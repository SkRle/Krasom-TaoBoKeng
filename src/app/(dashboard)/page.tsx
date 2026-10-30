import { Suspense } from "react";
import Image from "next/image";
import { DashboardStats, DashboardStatsSkeleton } from "@/features/dashboard/components/dashboard-stats";
import { RecentPeople, RecentPeopleSkeleton } from "@/features/dashboard/components/recent-people";
import { SITE_NAME } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
        <Image
          src="/brand/temple.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover object-[center_60%] opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/85 to-primary/20" />
        <div className="relative px-6 py-8 md:px-10 md:py-12">
          <p className="text-sm font-light opacity-85">ยินดีต้อนรับสู่ระบบจัดการ</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{SITE_NAME}</h1>
          <p className="mt-2 max-w-md text-sm font-light opacity-85">
            บันทึกและดูแลข้อมูลม้าทรง พี่เลี้ยง และคณะกรรมการได้จากที่เดียว
          </p>
        </div>
      </section>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<RecentPeopleSkeleton />}>
        <RecentPeople />
      </Suspense>
    </div>
  );
}
