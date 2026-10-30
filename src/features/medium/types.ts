export type MediumRow = {
  id: number;
  titleName: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  nickName: string | null;
  godName: string[];
  address: string | null;
  phoneNumber: string | null;
  status: string | null;
  sex: string | null;
  profileId: string | null;
  profilePath: string | null;
};

/** พี่เลี้ยงที่ดูแลม้าทรง (แสดงในหน้าต่างดูข้อมูล) */
export type MediumHelperSummary = {
  id: number;
  titleName: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  nickName: string | null;
  phoneNumber: string | null;
  status: string | null;
  profileId: string | null;
};

export type MediumListRow = MediumRow & { helpers: MediumHelperSummary[] };

/** god_name เป็น json — รองรับทั้ง array, string และ null */
export function parseGodName(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.trim() !== "");
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}
