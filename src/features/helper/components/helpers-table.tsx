import { connection } from "next/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { PersonCell } from "@/components/shared/person-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableCard } from "@/components/shared/table-card";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { optionLabel, SEX_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { parseListParams, type SearchParams } from "@/lib/list-params";
import { formatFullName, formatPhone, formatThaiDate } from "@/lib/utils";
import { getMediumSelectOptions, listHelpers } from "../queries";
import { HelperRowActions } from "./helper-row-actions";

export async function HelpersTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const params = parseListParams(await searchParams);
  const [{ rows, total }, mediumOptions] = await Promise.all([listHelpers(params), getMediumSelectOptions()]);

  return (
    <TableCard
      toolbar={
        <TableToolbar
          searchPlaceholder="ค้นหาชื่อ ชื่อเล่น หรือเบอร์โทร"
          filters={[
            { name: "medium", placeholder: "ม้าทรง", options: mediumOptions },
            { name: "status", placeholder: "สถานะ", options: STATUS_OPTIONS },
          ]}
        />
      }
      footer={<Pagination page={params.page} pageSize={params.pageSize} total={total} />}
    >
      {rows.length === 0 ? (
        <EmptyState
          title="ไม่พบข้อมูลพี่เลี้ยง"
          description={params.q ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มพี่เลี้ยง” เพื่อเริ่มบันทึกข้อมูล"}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-4">พี่เลี้ยง</TableHead>
              <TableHead>ดูแลม้าทรง</TableHead>
              <TableHead>เพศ</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่เพิ่ม</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="py-3 pl-4">
                  <PersonCell
                    {...h}
                    title={formatFullName(h)}
                    subtitle={h.nickName ? `ชื่อเล่น: ${h.nickName}` : null}
                  />
                </TableCell>
                <TableCell>{h.mediumName ?? <span className="text-muted-foreground">-</span>}</TableCell>
                <TableCell>{optionLabel(SEX_OPTIONS, h.sex)}</TableCell>
                <TableCell className="tabular-nums">{formatPhone(h.phoneNumber)}</TableCell>
                <TableCell>
                  <StatusBadge status={h.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatThaiDate(h.createdAt)}</TableCell>
                <TableCell className="pr-4 text-right">
                  <HelperRowActions helper={h} mediumOptions={mediumOptions} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}
