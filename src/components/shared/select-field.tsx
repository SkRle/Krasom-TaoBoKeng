"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Option } from "@/lib/constants";

/** Select ที่ส่งค่าไปกับฟอร์ม (Radix สร้าง <select> ซ่อนไว้ให้เมื่อมี name) */
export function SelectField({
  id,
  name,
  defaultValue,
  placeholder = "เลือก",
  options,
  invalid,
}: {
  id?: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  options: Option[];
  invalid?: boolean;
}) {
  return (
    <Select name={name} defaultValue={defaultValue ?? undefined}>
      <SelectTrigger id={id} className="h-10! w-full" aria-invalid={invalid || undefined}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
