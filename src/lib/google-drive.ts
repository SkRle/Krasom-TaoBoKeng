import "server-only";
import { Readable } from "node:stream";
import { google } from "googleapis";
import { DRIVE_FOLDERS, MAX_IMAGE_SIZE, type DriveFolderKey } from "@/lib/constants";

/**
 * ใช้ OAuth2 refresh token ของบัญชี krasomtaobokeng@gmail.com
 * (Service Account ไม่มีพื้นที่เก็บไฟล์ จึงอัปโหลดเข้า My Drive ของ Gmail ไม่ได้)
 */
function getDrive() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error("ยังไม่ได้ตั้งค่า Google Drive (GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN)");
  }
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return google.drive({ version: "v3", auth });
}

export type UploadedFile = {
  /** File ID → บันทึกลง profile_id */
  id: string;
  /** WebViewLink → บันทึกลง profile_path */
  webViewLink: string;
};

/** คืนข้อความ error ภาษาไทย หรือ null ถ้าไฟล์ใช้ได้ */
export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "กรุณาเลือกไฟล์รูปภาพเท่านั้น";
  if (file.size > MAX_IMAGE_SIZE) return "ไฟล์รูปต้องมีขนาดไม่เกิน 5MB";
  return null;
}

export async function uploadProfileImage(
  file: File,
  folder: DriveFolderKey,
  fileName: string,
): Promise<UploadedFile> {
  const drive = getDrive();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1] ?? "jpg";

  const res = await drive.files.create({
    requestBody: {
      name: `${fileName}-${Date.now()}.${ext}`,
      parents: [DRIVE_FOLDERS[folder]],
    },
    media: { mimeType: file.type, body: Readable.from(buffer) },
    fields: "id, webViewLink",
  });

  if (!res.data.id || !res.data.webViewLink) {
    throw new Error("อัปโหลดรูปไป Google Drive ไม่สำเร็จ");
  }
  return { id: res.data.id, webViewLink: res.data.webViewLink };
}

/** ลบไฟล์เดิม — ไม่ throw เพื่อไม่ให้การบันทึกข้อมูลล้มเพราะไฟล์หายไปแล้ว */
export async function deleteDriveFile(fileId: string | null | undefined) {
  if (!fileId) return;
  try {
    await getDrive().files.delete({ fileId });
  } catch (error) {
    console.error("[google-drive] ลบไฟล์ไม่สำเร็จ", fileId, error);
  }
}

/** ย้ายไฟล์ไปโฟลเดอร์อื่น (เช่น เปลี่ยนเพศของม้าทรง) */
export async function moveDriveFile(fileId: string, to: DriveFolderKey) {
  try {
    const drive = getDrive();
    const { data } = await drive.files.get({ fileId, fields: "parents" });
    await drive.files.update({
      fileId,
      addParents: DRIVE_FOLDERS[to],
      removeParents: data.parents?.join(","),
      fields: "id",
    });
  } catch (error) {
    console.error("[google-drive] ย้ายไฟล์ไม่สำเร็จ", fileId, error);
  }
}

export async function getDriveFileStream(fileId: string) {
  const drive = getDrive();
  const [meta, media] = await Promise.all([
    drive.files.get({ fileId, fields: "mimeType" }),
    drive.files.get({ fileId, alt: "media" }, { responseType: "stream" }),
  ]);
  return {
    mimeType: meta.data.mimeType ?? "application/octet-stream",
    stream: media.data as unknown as Readable,
  };
}
