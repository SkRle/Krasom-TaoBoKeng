"use client";

import Link from "next/link";
import { HandHeart, Pencil, Phone } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isFemale } from "@/lib/constants";
import { formatFullName, formatPhone } from "@/lib/utils";
import type { MediumListRow } from "../types";

type Props = {
  medium: MediumListRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
};

function InfoItem({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

/** หน้าต่างดูข้อมูลม้าทรง พร้อมรายชื่อพี่เลี้ยงที่ดูแล */
export function MediumDetailDialog({ medium, open, onOpenChange, onEdit }: Props) {
  const name = formatFullName(medium);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <PersonAvatar {...medium} className="size-16 text-lg ring-accent" />
            <div className="min-w-0 space-y-1.5">
              <DialogTitle className="truncate text-lg">{name}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                {medium.nickName && <span>ชื่อเล่น: {medium.nickName}</span>}
                <StatusBadge status={medium.status} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-primary">ข้อมูลม้าทรง</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="เพศ">{medium.sex ? (isFemale(medium.sex) ? "หญิง" : "ชาย") : "-"}</InfoItem>
              <InfoItem label="เบอร์โทรศัพท์">
                <span className="tabular-nums">{formatPhone(medium.phoneNumber)}</span>
              </InfoItem>
              <InfoItem label="องค์เทพ" className="sm:col-span-2">
                {medium.godName.length ? (
                  <div className="flex flex-wrap gap-1">
                    {medium.godName.map((g) => (
                      <span key={g} className="rounded-md bg-accent px-2 py-0.5 text-xs text-primary">
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </InfoItem>
              <InfoItem label="ที่อยู่" className="sm:col-span-2">
                <span className="whitespace-pre-line">{medium.address || "-"}</span>
              </InfoItem>
            </dl>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-primary">พี่เลี้ยงที่ดูแล ({medium.helpers.length} คน)</h3>
            {medium.helpers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
                  <HandHeart className="size-5" />
                </span>
                <p className="text-sm text-muted-foreground">ยังไม่มีพี่เลี้ยงดูแลม้าทรงท่านนี้</p>
              </div>
            ) : (
              <ul className="divide-y divide-border rounded-xl border border-border">
                {medium.helpers.map((h) => (
                  <li key={h.id}>
                    <Link
                      href={`/helpers?q=${encodeURIComponent(h.firstName ?? "")}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                    >
                      <PersonAvatar {...h} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{formatFullName(h)}</p>
                        <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                          {h.nickName && <span>ชื่อเล่น: {h.nickName}</span>}
                          {h.phoneNumber && (
                            <span className="inline-flex items-center gap-1 tabular-nums">
                              <Phone className="size-3" />
                              {formatPhone(h.phoneNumber)}
                            </span>
                          )}
                        </p>
                      </div>
                      <StatusBadge status={h.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 border-t border-border bg-muted/50 px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ปิด
          </Button>
          <Button type="button" onClick={onEdit}>
            <Pencil />
            แก้ไขข้อมูล
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
