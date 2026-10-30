import Image from "next/image";
import { SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/40">
        <Image src="/brand/logo.png" alt="ตราศาลเจ้า" fill sizes="44px" className="object-contain" priority />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-light opacity-80">ศาลเจ้า</p>
        <p className="font-semibold">{SITE_SHORT_NAME}</p>
      </div>
    </div>
  );
}
