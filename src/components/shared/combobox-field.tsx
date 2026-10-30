"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "cn";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Option } from "@/lib/constants";

// ค้นหาแบบ "มีคำนี้อยู่ในชื่อ" (ตรงไปตรงมากว่า fuzzy ของ cmdk และใช้กับภาษาไทยได้ดี)
function filterOption(_value: string, search: string, keywords?: string[]) {
  const q = search.trim().toLowerCase();
  if (!q) return 1;
  return keywords?.some((k) => k.toLowerCase().includes(q)) ? 1 : 0;
}

/** Dropdown ที่พิมพ์ค้นหาได้ ส่งค่าไปกับฟอร์มผ่าน hidden input (ใช้แทน SelectField เมื่อรายการยาว) */
export function ComboboxField({
  id,
  name,
  defaultValue,
  placeholder = "เลือก",
  searchPlaceholder = "พิมพ์เพื่อค้นหา…",
  emptyText = "ไม่พบรายการที่ค้นหา",
  options,
  invalid,
}: {
  id?: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: Option[];
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <input type="hidden" name={name} value={value} />
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-left text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            !selected && "text-muted-foreground",
          )}
        >
          <span className="line-clamp-1">{selected?.label ?? placeholder}</span>
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command filter={filterOption}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((o) => (
              <CommandItem
                key={o.value}
                value={o.value}
                keywords={[o.label]}
                data-checked={o.value === value}
                onSelect={() => {
                  setValue(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
