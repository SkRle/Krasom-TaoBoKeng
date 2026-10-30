import {
  BadgeCheck,
  Contact,
  HandHeart,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SITE_NAME = "ศาลเจ้ากระโสมเต้าโบ้เก้ง";
export const SITE_SHORT_NAME = "กระโสมเต้าโบ้เก้ง";

export const PAGE_SIZE = 10;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** โฟลเดอร์ Google Drive แยกตามประเภทบุคคล */
export const DRIVE_FOLDERS = {
  mediumMale: "12ngxq_R0jY_RSMCIIMfk5yFTNQMEMIK3",
  mediumFemale: "1KVi0yGHET_OGu_3acpnHIRqi6BAzr2wP",
  helper: "1TTlsRDN4wjW-4s39t22Pvx-ONIR-gMBj",
  board: "1_Hf7E53Rw2yOhkFk6DYJ0APvFT6xsQkh",
} as const;

export type DriveFolderKey = keyof typeof DRIVE_FOLDERS;

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/mediums", label: "ม้าทรง", icon: Users },
  { href: "/helpers", label: "พี่เลี้ยง", icon: HandHeart },
  { href: "/board", label: "คณะกรรมการ", icon: Contact },
  { href: "/positions", label: "ตำแหน่ง", icon: BadgeCheck },
];

export type Option = { value: string; label: string };

export const TITLE_NAME_OPTIONS: Option[] = [
  { value: "นาย", label: "นาย" },
  { value: "นาง", label: "นาง" },
  { value: "นางสาว", label: "นางสาว" },
  { value: "เด็กชาย", label: "เด็กชาย" },
  { value: "เด็กหญิง", label: "เด็กหญิง" },
];

export const SEX_OPTIONS: Option[] = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

export const STATUS_OPTIONS: Option[] = [
  { value: "active", label: "ปฏิบัติงาน" },
  { value: "inactive", label: "พักงาน" },
  { value: "retired", label: "ยุติ" },
];

export const BELONG_IN_OPTIONS: Option[] = [
  { value: "board", label: "คณะกรรมการ" },
  { value: "medium", label: "ม้าทรง" },
  { value: "helper", label: "พี่เลี้ยง" },
];

/** แปลงค่าที่เก็บในฐานข้อมูลเป็นข้อความภาษาไทย (ถ้าไม่รู้จักจะแสดงค่าเดิม) */
export function optionLabel(options: Option[], value: string | null | undefined) {
  if (!value) return "-";
  return options.find((o) => o.value === value)?.label ?? value;
}

/** รองรับข้อมูลเก่าที่อาจเก็บเพศเป็นภาษาไทย */
export function isFemale(sex: string | null | undefined) {
  return sex === "female" || sex === "หญิง";
}
