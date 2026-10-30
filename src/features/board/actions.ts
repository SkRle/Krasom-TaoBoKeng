"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { formDataToObject, toErrorResult, validationError, type ActionResult } from "@/lib/form";
import { deleteDriveFile } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import {
  cleanupOldImage,
  processProfileImage,
  profileDataFor,
  rollbackUpload,
  type ProfileImageChange,
} from "@/lib/profile-image";
import { boardSchema } from "./schema";

function revalidate() {
  revalidatePath("/board");
  revalidatePath("/positions");
  revalidatePath("/");
}

export async function createBoardMember(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = boardSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const { positionId, ...data } = parsed.data;

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, "board", data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.boardDirect.create({
      data: { ...data, positionId: positionId !== null ? BigInt(positionId) : null, ...profileDataFor(image) },
    });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลกรรมการไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "เพิ่มกรรมการเรียบร้อย" };
}

export async function updateBoardMember(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = boardSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const { positionId, ...data } = parsed.data;

  const existing = await prisma.boardDirect.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "ไม่พบข้อมูลกรรมการ" };

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, "board", data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.boardDirect.update({
      where: { id },
      data: { ...data, positionId: positionId !== null ? BigInt(positionId) : null, ...profileDataFor(image) },
    });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลกรรมการไม่สำเร็จ");
  }

  await cleanupOldImage(image, existing.profileId);
  revalidate();
  return { ok: true, message: "บันทึกการแก้ไขเรียบร้อย" };
}

export async function deleteBoardMember(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    const deleted = await prisma.boardDirect.delete({ where: { id } });
    await deleteDriveFile(deleted.profileId);
  } catch (error) {
    return toErrorResult(error, "ลบข้อมูลกรรมการไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "ลบข้อมูลกรรมการเรียบร้อย" };
}
