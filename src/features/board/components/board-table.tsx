import { connection } from "next/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { PersonCell } from "@/components/shared/person-avatar";
import { TableCard } from "@/components/shared/table-card";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPositionOptions } from "@/features/position/queries";
import { parseListParams, type SearchParams } from "@/lib/list-params";
import { formatFullName, formatPhone } from "@/lib/utils";
import { listBoard } from "../queries";
import { BoardRowActions } from "./board-row-actions";

export async function BoardTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const params = parseListParams(await searchParams);
  const [{ rows, total }, positionOptions] = await Promise.all([listBoard(params), getPositionOptions()]);

  return (
    <TableCard
      toolbar={
        <TableToolbar
          searchPlaceholder="ค้นหาชื่อหรือเบอร์โทร"
          filters={[{ name: "position", placeholder: "ตำแหน่ง", options: positionOptions }]}
        />
      }
      footer={<Pagination page={params.page} pageSize={params.pageSize} total={total} />}
    >
      {rows.length === 0 ? (
        <EmptyState
          title="ไม่พบข้อมูลคณะกรรมการ"
          description={params.q ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มกรรมการ” เพื่อเริ่มบันทึกข้อมูล"}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-4">กรรมการ</TableHead>
              <TableHead>ตำแหน่ง</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="py-3 pl-4">
                  <PersonCell
                    {...b}
                    title={formatFullName(b)}
                    subtitle={b.nickName ? `ชื่อเล่น: ${b.nickName}` : null}
                  />
                </TableCell>
                <TableCell>
                  {b.positionName ? (
                    <span className="rounded-md bg-accent px-2 py-0.5 text-sm text-primary">{b.positionName}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="tabular-nums">{formatPhone(b.phoneNumber)}</TableCell>
                <TableCell className="pr-4 text-right">
                  <BoardRowActions member={b} positionOptions={positionOptions} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}
