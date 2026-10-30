import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { personSearch, toNumber, type parseListParams } from "@/lib/list-params";
import { prisma } from "@/lib/prisma";
import type { BoardRow } from "./types";

export async function listBoard(params: ReturnType<typeof parseListParams>) {
  const positionId = params.get("position");
  const where: Prisma.BoardDirectWhereInput = {
    ...(positionId && /^\d+$/.test(positionId) && { positionId: BigInt(positionId) }),
    ...(personSearch(params.q, ["firstName", "middleName", "lastName", "phoneNumber"]) as Prisma.BoardDirectWhereInput),
  };

  const [rows, total] = await prisma.$transaction([
    // เรียงตามลำดับตำแหน่ง (ประธานมักสร้างก่อน) แล้วตามลำดับที่เพิ่ม
    prisma.boardDirect.findMany({
      where,
      orderBy: [{ positionId: { sort: "asc", nulls: "last" } }, { id: "asc" }],
      skip: params.skip,
      take: params.pageSize,
    }),
    prisma.boardDirect.count({ where }),
  ]);

  // position_id เป็น bigint ไม่มี relation ใน Prisma → join เอง
  const positionIds = [...new Set(rows.map((r) => toNumber(r.positionId)).filter((v): v is number => v !== null))];
  const positions = positionIds.length
    ? await prisma.position.findMany({ where: { id: { in: positionIds } } })
    : [];
  const nameMap = new Map(positions.map((p) => [p.id, p.name]));

  const result: BoardRow[] = rows.map((r) => {
    const id = toNumber(r.positionId);
    return { ...r, positionId: id, positionName: id !== null ? (nameMap.get(id) ?? null) : null };
  });
  return { rows: result, total };
}
