"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { formDataToObject, toErrorResult, validationError, type ActionResult } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { positionSchema } from "./schema";

function revalidate() {
  revalidatePath("/positions");
  revalidatePath("/board");
}

export async function createPosition(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = positionSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await prisma.position.create({ data: parsed.data });
  } catch (error) {
    return toErrorResult(error, "บันทึกตำแหน่งไม่สำเร็จ");
  }
  revalidate();
  return { ok: true, message: "เพิ่มตำแหน่งเรียบร้อย" };
}

export async function updatePosition(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = positionSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await prisma.position.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toErrorResult(error, "บันทึกตำแหน่งไม่สำเร็จ");
  }
  revalidate();
  return { ok: true, message: "บันทึกการแก้ไขเรียบร้อย" };
}

export async function deletePosition(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    const used = await prisma.boardDirect.count({ where: { positionId: id } });
    if (used > 0) {
      return { ok: false, message: `ลบไม่ได้ เนื่องจากมีกรรมการ ${used} คนอยู่ในตำแหน่งนี้` };
    }
    await prisma.position.delete({ where: { id } });
  } catch (error) {
    return toErrorResult(error, "ลบตำแหน่งไม่สำเร็จ");
  }
  revalidate();
  return { ok: true, message: "ลบตำแหน่งเรียบร้อย" };
}
