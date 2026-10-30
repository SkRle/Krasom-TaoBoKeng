import { connection } from "next/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { PersonCell } from "@/components/shared/person-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableCard } from "@/components/shared/table-card";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isFemale, STATUS_OPTIONS } from "@/lib/constants";
import { parseListParams, type SearchParams } from "@/lib/list-params";
import { formatFullName, formatPhone } from "@/lib/utils";
import { listMediums } from "../queries";
import { MediumRowActions } from "./medium-row-actions";

export async function MediumsTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const params = parseListParams(await searchParams);
  const { rows, total } = await listMediums(params);

  return (
    <TableCard
      toolbar={
        <TableToolbar
          searchPlaceholder="ค้นหาชื่อ ชื่อเล่น หรือเบอร์โทร"
          filters={[{ name: "status", placeholder: "สถานะ", options: STATUS_OPTIONS }]}
        />
      }
      footer={<Pagination page={params.page} pageSize={params.pageSize} total={total} />}
    >
      {rows.length === 0 ? (
        <EmptyState
          title="ไม่พบข้อมูลม้าทรง"
          description={params.q ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มม้าทรง” เพื่อเริ่มบันทึกข้อมูล"}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-4">ม้าทรง</TableHead>
              <TableHead>องค์เทพ</TableHead>
              <TableHead>เพศ</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead className="text-center">พี่เลี้ยง</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="py-3 pl-4">
                  <PersonCell
                    {...m}
                    title={formatFullName(m)}
                    subtitle={m.nickName ? `ชื่อเล่น: ${m.nickName}` : null}
                  />
                </TableCell>
                <TableCell className="max-w-64">
                  <div className="flex flex-wrap gap-1">
                    {m.godName.length ? (
                      m.godName.map((g) => (
                        <span key={g} className="rounded-md bg-accent px-2 py-0.5 text-xs text-primary">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{m.sex ? (isFemale(m.sex) ? "หญิง" : "ชาย") : "-"}</TableCell>
                <TableCell className="tabular-nums">{formatPhone(m.phoneNumber)}</TableCell>
                <TableCell className="text-center tabular-nums">{m.helpers.length}</TableCell>
                <TableCell>
                  <StatusBadge status={m.status} />
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <MediumRowActions medium={m} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}
