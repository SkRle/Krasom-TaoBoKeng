import "server-only";
import type { DriveFolderKey } from "@/lib/constants";
import { deleteDriveFile, uploadProfileImage, validateImage } from "@/lib/google-drive";

export type ProfileImageChange =
  | { kind: "none" }
  | { kind: "remove" }
  | { kind: "upload"; profilePath: string; profileId: string };

/**
 * อ่านรูปจากฟอร์ม (ช่อง `image` และ `removeImage`) แล้วอัปโหลดไป Drive ถ้ามี
 * ค่าที่ได้ใช้ต่อกับ `profileDataFor` และ `cleanupOldImage`
 */
export async function processProfileImage(
  formData: FormData,
  folder: DriveFolderKey,
  fileNameHint: string,
): Promise<ProfileImageChange | { error: string }> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const error = validateImage(file);
    if (error) return { error };
    const uploaded = await uploadProfileImage(file, folder, fileNameHint);
    return { kind: "upload", profilePath: uploaded.webViewLink, profileId: uploaded.id };
  }
  if (formData.get("removeImage") === "1") return { kind: "remove" };
  return { kind: "none" };
}

export function profileDataFor(change: ProfileImageChange) {
  if (change.kind === "upload") return { profilePath: change.profilePath, profileId: change.profileId };
  if (change.kind === "remove") return { profilePath: null, profileId: null };
  return {};
}

/** ลบไฟล์เดิมใน Drive หลังบันทึกฐานข้อมูลสำเร็จแล้วเท่านั้น */
export async function cleanupOldImage(change: ProfileImageChange, oldProfileId: string | null | undefined) {
  if (change.kind !== "none") await deleteDriveFile(oldProfileId);
}

/** ถ้าบันทึกฐานข้อมูลไม่สำเร็จ ให้ลบไฟล์ที่เพิ่งอัปโหลด */
export async function rollbackUpload(change: ProfileImageChange) {
  if (change.kind === "upload") await deleteDriveFile(change.profileId);
}
