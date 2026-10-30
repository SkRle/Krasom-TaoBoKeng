export { cn } from "cn"

type NameParts = {
  titleName?: string | null
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
}

/** รวมชื่อเต็ม เช่น "นายสมชาย ใจดี" (คำนำหน้าติดกับชื่อตามแบบไทย) */
export function formatFullName({ titleName, firstName, middleName, lastName }: NameParts) {
  const first = `${titleName ?? ""}${firstName ?? ""}`
  const full = [first, middleName, lastName].filter(Boolean).join(" ").trim()
  return full || "ไม่ระบุชื่อ"
}

/** ตัวอักษรย่อสำหรับ avatar */
export function initials({ firstName, lastName }: NameParts) {
  const a = firstName?.trim().charAt(0) ?? ""
  const b = lastName?.trim().charAt(0) ?? ""
  return (a + b) || "?"
}

/** รูปแบบเบอร์โทร 0812345678 → 081-234-5678 */
export function formatPhone(phone: string | null | undefined) {
  if (!phone) return "-"
  const d = phone.replace(/\D/g, "")
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  if (d.length === 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
  return phone
}

export function formatThaiDate(date: Date | string | null | undefined) {
  if (!date) return "-"
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(date))
}

/** URL รูปโปรไฟล์ผ่าน proxy (webViewLink ของ Drive ใช้ใน <img> ไม่ได้) */
export function profileImageUrl(profileId: string | null | undefined) {
  return profileId ? `/api/drive-image/${encodeURIComponent(profileId)}` : undefined
}
