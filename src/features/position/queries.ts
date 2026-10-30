import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { BELONG_IN_OPTIONS, optionLabel, type Option } from "@/lib/constants";
import type { parseListParams } from "@/lib/list-params";
import { prisma } from "@/lib/prisma";
import type { PositionRow } from "./types";

export async function listPositions(params: ReturnType<typeof parseListParams>) {
  const belongIn = params.get("belongIn");
  const where: Prisma.PositionWhereInput = {
    ...(belongIn && { belongIn }),
    ...(params.q && { name: { contains: params.q, mode: "insensitive" } }),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.position.findMany({ where, orderBy: { id: "asc" }, skip: params.skip, take: params.pageSize }),
    prisma.position.count({ where }),
  ]);

  const counts = await prisma.boardDirect.groupBy({
    by: ["positionId"],
    where: { positionId: { in: rows.map((r) => BigInt(r.id)) } },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [Number(c.positionId), c._count._all]));

  const result: PositionRow[] = rows.map((r) => ({ ...r, memberCount: countMap.get(r.id) ?? 0 }));
  return { rows: result, total };
}

/** ตัวเลือกตำแหน่งสำหรับฟอร์มคณะกรรมการ (ตำแหน่งของคณะกรรมการขึ้นก่อน) */
export async function getPositionOptions(): Promise<Option[]> {
  const rows = await prisma.position.findMany({ orderBy: { id: "asc" } });
  const sorted = [...rows].sort((a, b) => Number(b.belongIn === "board") - Number(a.belongIn === "board"));
  return sorted.map((p) => ({
    value: String(p.id),
    label:
      (p.name ?? "ไม่มีชื่อ") +
      (p.belongIn && p.belongIn !== "board" ? ` (${optionLabel(BELONG_IN_OPTIONS, p.belongIn)})` : ""),
  }));
}
