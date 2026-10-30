import "server-only";
import { toMediumRow } from "@/features/medium/queries";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [male, female, helpers, board, activeMediums] = await Promise.all([
    prisma.medium.count({ where: { sex: { in: ["male", "ชาย"] } } }),
    prisma.medium.count({ where: { sex: { in: ["female", "หญิง"] } } }),
    prisma.mediumHelper.count(),
    prisma.boardDirect.count(),
    prisma.medium.count({ where: { status: "active" } }),
  ]);
  return { male, female, helpers, board, activeMediums };
}

export async function getRecentPeople() {
  const [mediums, helpers] = await Promise.all([
    prisma.medium.findMany({ orderBy: { id: "desc" }, take: 5 }),
    prisma.mediumHelper.findMany({ orderBy: [{ createdAt: { sort: "desc", nulls: "last" } }, { id: "desc" }], take: 5 }),
  ]);
  return { mediums: mediums.map(toMediumRow), helpers };
}
