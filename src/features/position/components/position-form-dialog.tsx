"use client";

import { EntityFormDialog } from "@/components/shared/entity-form-dialog";
import { FormField } from "@/components/shared/form-field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { BELONG_IN_OPTIONS } from "@/lib/constants";
import { createPosition, updatePosition } from "../actions";
import type { PositionRow } from "../types";

type Props = {
  position?: PositionRow;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function PositionFormDialog({ position, ...dialogProps }: Props) {
  return (
    <EntityFormDialog
      {...dialogProps}
      title={position ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่ง"}
      action={position ? updatePosition.bind(null, position.id) : createPosition}
    >
      {({ fieldErrors: errors }) => (
        <div className="grid gap-4">
          <FormField label="ชื่อตำแหน่ง" htmlFor="name" required error={errors?.name}>
            <Input id="name" name="name" defaultValue={position?.name ?? ""} placeholder="เช่น ประธานกรรมการ" className="h-10" autoFocus />
          </FormField>
          <FormField label="สังกัด" htmlFor="belongIn" error={errors?.belongIn} hint="ตำแหน่งนี้ใช้กับบุคคลกลุ่มใด">
            <SelectField id="belongIn" name="belongIn" defaultValue={position?.belongIn ?? "board"} options={BELONG_IN_OPTIONS} />
          </FormField>
        </div>
      )}
    </EntityFormDialog>
  );
}
