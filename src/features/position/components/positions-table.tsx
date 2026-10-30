import { connection } from "next/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { TableCard } from "@/components/shared/table-card";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BELONG_IN_OPTIONS, optionLabel } from "@/lib/constants";
import { parseListParams, type SearchParams } from "@/lib/list-params";
import { formatThaiDate } from "@/lib/utils";
import { listPositions } from "../queries";
import { PositionRowActions } from "./position-row-actions";

export async function PositionsTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const params = parseListParams(await searchParams);
  const { rows, total } = await listPositions(params);

  return (
    <TableCard
      toolbar={
        <TableToolbar
          searchPlaceholder="ค้นหาชื่อตำแหน่ง"
          filters={[{ name: "belongIn", placeholder: "สังกัด", options: BELONG_IN_OPTIONS }]}
        />
      }
      footer={<Pagination page={params.page} pageSize={params.pageSize} total={total} />}
    >
      {rows.length === 0 ? (
        <EmptyState
          title="ไม่พบตำแหน่ง"
          description={params.q ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มตำแหน่ง” เพื่อสร้างตำแหน่งแรก"}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-4">ชื่อตำแหน่ง</TableHead>
              <TableHead>สังกัด</TableHead>
              <TableHead className="text-center">จำนวนกรรมการ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="py-3.5 pl-4 font-medium">{p.name ?? "-"}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-accent px-2 py-0.5 text-xs text-primary">
                    {optionLabel(BELONG_IN_OPTIONS, p.belongIn)}
                  </span>
                </TableCell>
                <TableCell className="text-center tabular-nums">{p.memberCount}</TableCell>
                <TableCell className="text-muted-foreground">{formatThaiDate(p.createdAt)}</TableCell>
                <TableCell className="pr-4 text-right">
                  <PositionRowActions position={p} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}
