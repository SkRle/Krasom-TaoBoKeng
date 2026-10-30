import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MediumFormDialog } from "@/features/medium/components/medium-form-dialog";
import { MediumSexTabs } from "@/features/medium/components/medium-sex-tabs";
import { MediumsTable } from "@/features/medium/components/mediums-table";

export const metadata: Metadata = { title: "ม้าทรง" };

export default function MediumsPage({ searchParams }: PageProps<"/mediums">) {
  return (
    <>
      <PageHeader
        title="ม้าทรง"
        description="จัดการข้อมูลม้าทรงชายและหญิง พร้อมองค์เทพที่ประทับทรง"
        action={
          <MediumFormDialog
            trigger={
              <Button size="lg" className="h-10 px-4">
                <Plus />
                เพิ่มม้าทรง
              </Button>
            }
          />
        }
      />
      <Suspense fallback={<Skeleton className="mb-4 h-10 w-80 rounded-xl" />}>
        <MediumSexTabs searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <MediumsTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}
