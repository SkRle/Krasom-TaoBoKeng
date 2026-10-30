import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { personSearch, type parseListParams } from "@/lib/list-params";
import { prisma } from "@/lib/prisma";
import { parseGodName, type MediumHelperSummary, type MediumListRow, type MediumRow } from "./types";

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

  // พี่เลี้ยงของม้าทรงในหน้านี้ (medium_id เป็น bigint ไม่มี relation ใน Prisma → join เอง)
  const helpers = await prisma.mediumHelper.findMany({
    where: { mediumId: { in: rows.map((r) => BigInt(r.id)) } },
    select: {
      id: true,
      titleName: true,
      firstName: true,
      middleName: true,
      lastName: true,
      nickName: true,
      phoneNumber: true,
      status: true,
      profileId: true,
      mediumId: true,
    },
    orderBy: { id: "asc" },
  });
  const helperMap = new Map<number, MediumHelperSummary[]>();
  for (const { mediumId, ...h } of helpers) {
    const key = Number(mediumId);
    helperMap.set(key, [...(helperMap.get(key) ?? []), h]);
  }

  const result: MediumListRow[] = rows.map((r) => ({ ...toMediumRow(r), helpers: helperMap.get(r.id) ?? [] }));
  return { rows: result, total };
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
