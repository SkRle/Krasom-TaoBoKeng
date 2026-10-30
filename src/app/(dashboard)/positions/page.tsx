import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { PositionFormDialog } from "@/features/position/components/position-form-dialog";
import { PositionsTable } from "@/features/position/components/positions-table";

export const metadata: Metadata = { title: "ตำแหน่ง" };

export default function PositionsPage({ searchParams }: PageProps<"/positions">) {
  return (
    <>
      <PageHeader
        title="ตำแหน่ง"
        description="กำหนดตำแหน่งสำหรับคณะกรรมการและบุคลากรของศาลเจ้า"
        action={
          <PositionFormDialog
            trigger={
              <Button size="lg" className="h-10 px-4">
                <Plus />
                เพิ่มตำแหน่ง
              </Button>
            }
          />
        }
      />
      <Suspense fallback={<TableSkeleton />}>
        <PositionsTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}
