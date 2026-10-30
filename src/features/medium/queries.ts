import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { personSearch, type parseListParams } from "@/lib/list-params";
import { prisma } from "@/lib/prisma";
import { parseGodName, type MediumRow } from "./types";

type Medium = Prisma.MediumGetPayload<object>;

export function toMediumRow(m: Medium): MediumRow {
  return { ...m, godName: parseGodName(m.godName) };
}

export async function listMediums(params: ReturnType<typeof parseListParams>) {
  const sex = params.get("sex");
  const status = params.get("status");
  const where: Prisma.MediumWhereInput = {
    ...(sex && { sex: { in: sex === "female" ? ["female", "หญิง"] : ["male", "ชาย"] } }),
    ...(status && { status }),
    ...(personSearch(params.q) as Prisma.MediumWhereInput),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.medium.findMany({ where, orderBy: { id: "desc" }, skip: params.skip, take: params.pageSize }),
    prisma.medium.count({ where }),
  ]);

  // จำนวนพี่เลี้ยงของแต่ละม้าทรง
  const helperCounts = await prisma.mediumHelper.groupBy({
    by: ["mediumId"],
    where: { mediumId: { in: rows.map((r) => BigInt(r.id)) } },
    _count: { _all: true },
  });
  const countMap = new Map(helperCounts.map((h) => [Number(h.mediumId), h._count._all]));

  return {
    rows: rows.map((r) => ({ ...toMediumRow(r), helperCount: countMap.get(r.id) ?? 0 })),
    total,
  };
}

export async function getMediumSexCounts() {
  const [all, male, female] = await Promise.all([
    prisma.medium.count(),
    prisma.medium.count({ where: { sex: { in: ["male", "ชาย"] } } }),
    prisma.medium.count({ where: { sex: { in: ["female", "หญิง"] } } }),
  ]);
  return { all, male, female };
}

/** ตัวเลือกม้าทรงสำหรับฟอร์มพี่เลี้ยง */
export async function getMediumOptions() {
  const rows = await prisma.medium.findMany({
    select: { id: true, titleName: true, firstName: true, middleName: true, lastName: true, nickName: true },
    orderBy: { firstName: "asc" },
  });
  return rows;
}
