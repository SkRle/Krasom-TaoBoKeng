"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** กรอกหลายค่า (เช่น ชื่อองค์เทพ) กด Enter หรือ , เพื่อเพิ่ม — ส่งเป็น JSON array ในช่อง `name` */
export function TagInput({
  id,
  name,
  defaultValue = [],
  placeholder,
  invalid,
}: {
  id?: string;
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim().replace(/,$/, "");
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        invalid && "border-destructive",
      )}
    >
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-sm text-primary">
          {tag}
          <button
            type="button"
            onClick={() => setTags(tags.filter((t) => t !== tag))}
            className="rounded-sm opacity-70 hover:opacity-100"
            aria-label={`ลบ ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && tags.length) {
            setTags(tags.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-32 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
    </div>
  );
}
