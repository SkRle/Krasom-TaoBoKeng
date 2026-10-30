import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getMediumOptions } from "@/features/medium/queries";
import { personSearch, toNumber, type parseListParams } from "@/lib/list-params";
import { prisma } from "@/lib/prisma";
import { formatFullName } from "@/lib/utils";
import type { HelperRow, MediumOption } from "./types";

export async function listHelpers(params: ReturnType<typeof parseListParams>) {
  const status = params.get("status");
  const mediumId = params.get("medium");
  const where: Prisma.MediumHelperWhereInput = {
    ...(status && { status }),
    ...(mediumId && /^\d+$/.test(mediumId) && { mediumId: BigInt(mediumId) }),
    ...(personSearch(params.q) as Prisma.MediumHelperWhereInput),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.mediumHelper.findMany({
      where,
      orderBy: [{ createdAt: { sort: "desc", nulls: "last" } }, { id: "desc" }],
      skip: params.skip,
      take: params.pageSize,
    }),
    prisma.mediumHelper.count({ where }),
  ]);

  // medium_id เป็น bigint ไม่มี relation ใน Prisma → join เอง
  const mediumIds = [...new Set(rows.map((r) => toNumber(r.mediumId)).filter((v): v is number => v !== null))];
  const mediums = mediumIds.length
    ? await prisma.medium.findMany({ where: { id: { in: mediumIds } } })
    : [];
  const nameMap = new Map(mediums.map((m) => [m.id, formatFullName(m)]));

  const result: HelperRow[] = rows.map((r) => {
    const id = toNumber(r.mediumId);
    return { ...r, mediumId: id, mediumName: id !== null ? (nameMap.get(id) ?? null) : null };
  });
  return { rows: result, total };
}

export async function getMediumSelectOptions(): Promise<MediumOption[]> {
  const mediums = await getMediumOptions();
  return mediums.map((m) => ({
    value: String(m.id),
    label: formatFullName(m) + (m.nickName ? ` (${m.nickName})` : ""),
  }));
}
