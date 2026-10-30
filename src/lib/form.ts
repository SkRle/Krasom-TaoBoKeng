import { z } from "zod";

export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialActionResult: ActionResult = { ok: false };

/** ข้อความว่าง → null */
export const optionalText = (max = 255) =>
  z
    .string()
    .trim()
    .max(max, `ต้องไม่เกิน ${max} ตัวอักษร`)
    .optional()
    .transform((v) => (v ? v : null));

export const requiredText = (label: string, max = 255) =>
  z
    .string({ error: `กรุณากรอก${label}` })
    .trim()
    .min(1, `กรุณากรอก${label}`)
    .max(max, `ต้องไม่เกิน ${max} ตัวอักษร`);

export const phoneSchema = z
  .string()
  .optional()
  .transform((v) => (v ? v.replace(/[\s-]/g, "") : null))
  .refine((v) => v === null || /^0\d{8,9}$/.test(v), "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)");

/** ค่าว่างหรือ "none" (ตัวเลือก "ไม่ระบุ" ใน Select) → null */
export const NONE_VALUE = "none";

export const optionalIdSchema = z
  .string()
  .optional()
  .transform((v) => (v && v !== NONE_VALUE ? Number(v) : null))
  .refine((v) => v === null || Number.isInteger(v), "ข้อมูลไม่ถูกต้อง");

/** ฟิลด์ชื่อ-ที่อยู่ที่ใช้ร่วมกันทุกประเภทบุคคล */
export const personFields = {
  titleName: optionalText(50),
  firstName: requiredText("ชื่อ", 100),
  middleName: optionalText(100),
  lastName: optionalText(100),
  phoneNumber: phoneSchema,
};

/** ดึงเฉพาะค่าที่เป็นข้อความจาก FormData (ไฟล์จัดการแยก) */
export function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") obj[key] = value;
  }
  return obj;
}

export function validationError(error: z.ZodError): ActionResult {
  return {
    ok: false,
    message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

export function toErrorResult(error: unknown, fallback = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"): ActionResult {
  console.error(error);
  return { ok: false, message: error instanceof Error && /[฀-๿]/.test(error.message) ? error.message : fallback };
}
