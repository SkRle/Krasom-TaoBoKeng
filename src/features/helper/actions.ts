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
import { helperSchema } from "./schema";

function revalidate() {
  revalidatePath("/helpers");
  revalidatePath("/mediums");
  revalidatePath("/");
}

export async function createHelper(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = helperSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const { mediumId, ...data } = parsed.data;

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, "helper", data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.mediumHelper.create({
      data: { ...data, mediumId: mediumId !== null ? BigInt(mediumId) : null, ...profileDataFor(image) },
    });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลพี่เลี้ยงไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "เพิ่มพี่เลี้ยงเรียบร้อย" };
}

export async function updateHelper(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const parsed = helperSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);
  const { mediumId, ...data } = parsed.data;

  const existing = await prisma.mediumHelper.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "ไม่พบข้อมูลพี่เลี้ยง" };

  let image: ProfileImageChange = { kind: "none" };
  try {
    const result = await processProfileImage(formData, "helper", data.firstName);
    if ("error" in result) return { ok: false, fieldErrors: { image: [result.error] }, message: result.error };
    image = result;

    await prisma.mediumHelper.update({
      where: { id },
      data: {
        ...data,
        mediumId: mediumId !== null ? BigInt(mediumId) : null,
        updateAt: new Date(),
        ...profileDataFor(image),
      },
    });
  } catch (error) {
    await rollbackUpload(image);
    return toErrorResult(error, "บันทึกข้อมูลพี่เลี้ยงไม่สำเร็จ");
  }

  await cleanupOldImage(image, existing.profileId);
  revalidate();
  return { ok: true, message: "บันทึกการแก้ไขเรียบร้อย" };
}

export async function deleteHelper(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    const deleted = await prisma.mediumHelper.delete({ where: { id } });
    await deleteDriveFile(deleted.profileId);
  } catch (error) {
    return toErrorResult(error, "ลบข้อมูลพี่เลี้ยงไม่สำเร็จ");
  }

  revalidate();
  return { ok: true, message: "ลบข้อมูลพี่เลี้ยงเรียบร้อย" };
}
