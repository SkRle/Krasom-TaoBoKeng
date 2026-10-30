"use client";

import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { initialActionResult, type ActionResult } from "@/lib/form";

type FormAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

type Props = {
  title: string;
  description?: string;
  submitLabel?: string;
  action: FormAction;
  /** ปุ่มเปิด (ใช้กับปุ่ม "เพิ่ม") — ถ้าไม่ส่งให้ควบคุมด้วย open/onOpenChange */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: (state: ActionResult) => React.ReactNode;
};

/** Dialog ฟอร์มเพิ่ม/แก้ไขข้อมูล ใช้ร่วมกันทุกหน้า */
export function EntityFormDialog({ open: controlledOpen, onOpenChange, trigger, ...props }: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    // เปิดใหม่ทุกครั้ง = ฟอร์มใหม่ (ล้างค่า error เดิม)
    if (next) setFormKey((k) => k + 1);
    onOpenChange?.(next);
    if (controlledOpen === undefined) setUncontrolledOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="flex max-h-[92svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-5">
          <DialogTitle className="text-lg">{props.title}</DialogTitle>
          {props.description && <DialogDescription>{props.description}</DialogDescription>}
        </DialogHeader>
        <EntityForm key={formKey} {...props} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EntityForm({
  action,
  submitLabel = "บันทึก",
  children,
  onSuccess,
}: Pick<Props, "action" | "submitLabel" | "children"> & { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(action, initialActionResult);
  const handled = useRef(state);
  // ช่องที่แก้ไขแล้วหลังส่งฟอร์มครั้งล่าสุด → ซ่อน error ของช่องนั้น
  const [edited, setEdited] = useState<Set<string>>(new Set());
  const visibleState: ActionResult = {
    ...state,
    fieldErrors: state.fieldErrors
      ? Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !edited.has(k)))
      : undefined,
  };

  useEffect(() => {
    if (state === handled.current) return;
    handled.current = state;
    if (state.ok) {
      toast.success(state.message ?? "บันทึกข้อมูลเรียบร้อย");
      onSuccess();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form
      noValidate
      // ใช้ onSubmit แทน action={...} เพื่อไม่ให้ React ล้างค่าในฟอร์มเมื่อบันทึกไม่ผ่าน
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setEdited(new Set());
        startTransition(() => formAction(formData));
      }}
      onChange={(e) => {
        const name = (e.target as unknown as HTMLInputElement).name;
        if (name && state.fieldErrors?.[name] && !edited.has(name)) setEdited(new Set(edited).add(name));
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <fieldset disabled={isPending} className="min-w-0">
          {children(visibleState)}
        </fieldset>
      </div>
      <DialogFooter className="mx-0 mb-0 shrink-0 border-t border-border bg-muted/50 px-6 py-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-24">
          {isPending && <Loader2 className="animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
