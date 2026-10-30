import { Readable } from "node:stream";
import { getCurrentUser } from "@/lib/auth";
import { getDriveFileStream } from "@/lib/google-drive";

/** ส่งรูปจาก Google Drive ให้ <img> แสดงได้ โดยไม่ต้องเปิดไฟล์เป็นสาธารณะ */
export async function GET(_request: Request, ctx: RouteContext<"/api/drive-image/[id]">) {
  const user = await getCurrentUser();
  if (!user) return new Response("ไม่ได้รับอนุญาต", { status: 401 });

  const { id } = await ctx.params;
  try {
    const { mimeType, stream } = await getDriveFileStream(id);
    if (!mimeType.startsWith("image/")) return new Response("ไม่ใช่ไฟล์รูปภาพ", { status: 415 });

    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Content-Type": mimeType,
        // file ID ไม่เปลี่ยน (เปลี่ยนรูป = ไฟล์ใหม่) จึง cache ได้นาน
        "Cache-Control": "private, max-age=604800, immutable",
      },
    });
  } catch {
    return new Response("ไม่พบรูปภาพ", { status: 404 });
  }
}
