"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_SIZE } from "@/lib/constants";
import { profileImageUrl } from "@/lib/utils";

const MAX_DIMENSION = 1200;

/**
 * เลือกรูปโปรไฟล์ → ย่อขนาดในเบราว์เซอร์ → ส่งไปกับฟอร์มในช่อง `image`
 * กดลบรูป → ส่ง `removeImage=1`
 */
export function AvatarUpload({ profileId }: { profileId?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(profileImageUrl(profileId) ?? null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const original = input.files?.[0];
    if (!original) return;
    if (!original.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      input.value = "";
      return;
    }

    const file = await resizeImage(original).catch(() => original);
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("ไฟล์รูปต้องมีขนาดไม่เกิน 5MB");
      input.value = "";
      return;
    }
    if (file !== original) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
    }
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  }

  function handleRemove() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setRemoved(Boolean(profileId));
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-primary ring-2 ring-border transition hover:ring-primary"
        aria-label="เลือกรูปโปรไฟล์"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <Camera className="size-6" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
          <Camera className="size-5" />
        </span>
      </button>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {preview ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
          </Button>
          {preview && (
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-primary">
              <Trash2 />
              ลบรูป
            </Button>
          )}
        </div>
        <p className="text-xs font-light text-muted-foreground">JPG, PNG หรือ WEBP ไม่เกิน 5MB</p>
      </div>
      <input ref={inputRef} type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
      {removed && <input type="hidden" name="removeImage" value="1" />}
    </div>
  );
}

/** ย่อรูปให้ด้านยาวไม่เกิน 1200px เพื่ออัปโหลดเร็วขึ้น */
async function resizeImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1024 * 1024) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
