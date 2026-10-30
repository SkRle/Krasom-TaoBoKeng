import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardCreateButton } from "@/features/board/components/board-create-button";
import { BoardTable } from "@/features/board/components/board-table";

export const metadata: Metadata = { title: "คณะกรรมการ" };

export default function BoardPage({ searchParams }: PageProps<"/board">) {
  return (
    <>
      <PageHeader
        title="คณะกรรมการ"
        description="จัดการรายชื่อและตำแหน่งของคณะกรรมการศาลเจ้า"
        action={
          <Suspense fallback={<Skeleton className="h-10 w-36 rounded-lg" />}>
            <BoardCreateButton />
          </Suspense>
        }
      />
      <Suspense fallback={<TableSkeleton />}>
        <BoardTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}
