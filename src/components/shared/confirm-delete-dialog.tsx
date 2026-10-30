"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/form";

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (result.ok) {
        toast.success(result.message ?? "ลบข้อมูลเรียบร้อย");
        onOpenChange(false);
      } else {
        toast.error(result.message ?? "ลบข้อมูลไม่สำเร็จ");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !isPending && onOpenChange(o)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
          <AlertDialogDescription>
            ต้องการลบ “{itemName}” ใช่หรือไม่? ข้อมูลและรูปโปรไฟล์จะถูกลบถาวร ไม่สามารถกู้คืนได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>ยกเลิก</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            ลบข้อมูล
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
