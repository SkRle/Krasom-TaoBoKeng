import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { HelperCreateButton } from "@/features/helper/components/helper-create-button";
import { HelpersTable } from "@/features/helper/components/helpers-table";

export const metadata: Metadata = { title: "พี่เลี้ยง" };

export default function HelpersPage({ searchParams }: PageProps<"/helpers">) {
  return (
    <>
      <PageHeader
        title="พี่เลี้ยง"
        description="จัดการข้อมูลพี่เลี้ยงและม้าทรงที่ดูแล"
        action={
          <Suspense fallback={<Skeleton className="h-10 w-36 rounded-lg" />}>
            <HelperCreateButton />
          </Suspense>
        }
      />
      <Suspense fallback={<TableSkeleton />}>
        <HelpersTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}
