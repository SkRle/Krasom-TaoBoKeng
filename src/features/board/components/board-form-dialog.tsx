"use client";

import Link from "next/link";
import { AvatarUpload } from "@/components/shared/avatar-upload";
import { EntityFormDialog } from "@/components/shared/entity-form-dialog";
import { FormField } from "@/components/shared/form-field";
import { FormSection, PersonNameFields } from "@/components/shared/person-fields";
import { ComboboxField } from "@/components/shared/combobox-field";
import type { Option } from "@/lib/constants";
import { NONE_VALUE } from "@/lib/form";
import { createBoardMember, updateBoardMember } from "../actions";
import type { BoardRow } from "../types";

type Props = {
  member?: BoardRow;
  positionOptions: Option[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function BoardFormDialog({ member, positionOptions, ...dialogProps }: Props) {
  return (
    <EntityFormDialog
      {...dialogProps}
      title={member ? "แก้ไขข้อมูลกรรมการ" : "เพิ่มกรรมการ"}
      description="ข้อมูลที่มีเครื่องหมาย * จำเป็นต้องกรอก"
      action={member ? updateBoardMember.bind(null, member.id) : createBoardMember}
    >
      {({ fieldErrors: errors }) => (
        <div className="space-y-6">
          <FormSection title="รูปโปรไฟล์">
            <AvatarUpload profileId={member?.profileId} />
            {errors?.image && <p className="text-xs text-primary">{errors.image[0]}</p>}
          </FormSection>

          <FormSection title="ข้อมูลส่วนตัว">
            <PersonNameFields defaults={member} errors={errors} include={["nickName"]} />
          </FormSection>

          <FormSection title="ตำแหน่ง">
            <FormField
              label="ตำแหน่งในคณะกรรมการ"
              htmlFor="positionId"
              error={errors?.positionId}
              hint={positionOptions.length === 0 ? undefined : "ไม่มีตำแหน่งที่ต้องการ? เพิ่มได้ที่เมนู “ตำแหน่ง”"}
            >
              {positionOptions.length === 0 ? (
                <p className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                  ยังไม่มีตำแหน่ง —{" "}
                  <Link href="/positions" className="text-primary underline underline-offset-4">
                    เพิ่มตำแหน่ง
                  </Link>
                </p>
              ) : (
                <ComboboxField
                  id="positionId"
                  name="positionId"
                  placeholder="เลือกตำแหน่ง"
                  searchPlaceholder="พิมพ์ชื่อตำแหน่ง…"
                  emptyText="ไม่พบตำแหน่งที่ค้นหา"
                  defaultValue={member?.positionId != null ? String(member.positionId) : undefined}
                  options={[{ value: NONE_VALUE, label: "ไม่ระบุ" }, ...positionOptions]}
                />
              )}
            </FormField>
          </FormSection>
        </div>
      )}
    </EntityFormDialog>
  );
}
