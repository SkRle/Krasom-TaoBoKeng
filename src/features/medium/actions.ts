"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { formDataToObject, toErrorResult, validationError, type ActionResult } from "@/lib/form";
import { deleteDriveFile, moveDriveFile } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import {
  cleanupOldImage,
  processProfileImage,
  profileDataFor,
  rollbackUpload,
  type ProfileImageChange,
} from "@/lib/profile-image";
import { mediumSchema } from "./schema";

const folderFor = (sex: string) => (sex === "female" ? "mediumFemale" : "mediumMale");

function revalidate() {
  revalidatePath("/mediums");
  revalidatePath("/helpers");
  revalidatePath("/");
}

export async function createMedium(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = mediumSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, folderFor(data.sex), data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.medium.create({ data: { ...data, ...profileDataFor(image) } });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลม้าทรงไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "เพิ่มม้าทรงเรียบร้อย" };
}

export async function updateMedium(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = mediumSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;

  const existing = await prisma.medium.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "ไม่พบข้อมูลม้าทรง" };

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, folderFor(data.sex), data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.medium.update({ where: { id }, data: { ...data, ...profileDataFor(image) } });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลม้าทรงไม่สำเร็จ");
  }

  await cleanupOldImage(image, existing.profileId);
  // เปลี่ยนเพศ → ย้ายรูปเดิมไปโฟลเดอร์ที่ถูกต้อง
  if (image.kind === "none" && existing.profileId && folderFor(existing.sex ?? "") !== folderFor(data.sex)) {
    await moveDriveFile(existing.profileId, folderFor(data.sex));
  }

  revalidate();
  return { ok: true, message: "บันทึกการแก้ไขเรียบร้อย" };
}

export async function deleteMedium(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    const helperCount = await prisma.mediumHelper.count({ where: { mediumId: id } });
    if (helperCount > 0) {
      return {
        ok: false,
        message: `ลบไม่ได้ เนื่องจากมีพี่เลี้ยง ${helperCount} คนดูแลม้าทรงท่านนี้อยู่ กรุณาย้ายพี่เลี้ยงก่อน`,
      };
    }
    const deleted = await prisma.medium.delete({ where: { id } });
    await deleteDriveFile(deleted.profileId);
  } catch (error) {
    return toErrorResult(error, "ลบข้อมูลม้าทรงไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "ลบข้อมูลม้าทรงเรียบร้อย" };
}
