import { PAGE_SIZE } from "@/lib/constants";

export type SearchParams = Record<string, string | string[] | undefined>;

/** อ่าน ?q=&page=&... จาก URL ให้อยู่ในรูปที่ query ใช้ได้ */
export function parseListParams(sp: SearchParams) {
  const get = (key: string) => {
    const v = sp[key];
    const s = (Array.isArray(v) ? v[0] : v)?.trim();
    return s ? s : undefined;
  };
  const page = Math.max(1, Number.parseInt(get("page") ?? "1", 10) || 1);
  return { q: get("q"), page, pageSize: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, get };
}

/** เงื่อนไขค้นหาชื่อ/ชื่อเล่น/เบอร์โทร (ไม่สนตัวพิมพ์เล็กใหญ่) */
export function personSearch(q: string | undefined, fields = ["firstName", "middleName", "lastName", "nickName", "phoneNumber"]) {
  if (!q) return {};
  const digits = q.replace(/[\s-]/g, "");
  return {
    OR: fields.map((field) => ({
      [field]: { contains: field === "phoneNumber" ? digits || q : q, mode: "insensitive" as const },
    })),
  };
}

/** แปลง BigInt (FK) → number เพื่อส่งให้ client component ได้ */
export function toNumber(v: bigint | number | null | undefined) {
  return v === null || v === undefined ? null : Number(v);
}
