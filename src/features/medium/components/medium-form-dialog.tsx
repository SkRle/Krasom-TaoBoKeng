"use client";

import { AvatarUpload } from "@/components/shared/avatar-upload";
import { EntityFormDialog } from "@/components/shared/entity-form-dialog";
import { FormField } from "@/components/shared/form-field";
import { FormSection, PersonNameFields } from "@/components/shared/person-fields";
import { SelectField } from "@/components/shared/select-field";
import { TagInput } from "@/components/shared/tag-input";
import { SEX_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { createMedium, updateMedium } from "../actions";
import type { MediumRow } from "../types";

type Props = {
  medium?: MediumRow;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MediumFormDialog({ medium, ...dialogProps }: Props) {
  const isEdit = Boolean(medium);

  return (
    <EntityFormDialog
      {...dialogProps}
      title={isEdit ? "แก้ไขข้อมูลม้าทรง" : "เพิ่มม้าทรง"}
      description="ข้อมูลที่มีเครื่องหมาย * จำเป็นต้องกรอก"
      action={medium ? updateMedium.bind(null, medium.id) : createMedium}
    >
      {({ fieldErrors: errors }) => (
        <div className="space-y-6">
          <FormSection title="รูปโปรไฟล์">
            <AvatarUpload profileId={medium?.profileId} />
            {errors?.image && <p className="text-xs text-primary">{errors.image[0]}</p>}
          </FormSection>

          <FormSection title="ข้อมูลส่วนตัว">
            <PersonNameFields defaults={medium} errors={errors} include={["nickName", "address"]} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="เพศ" htmlFor="sex" required error={errors?.sex} hint="ใช้แยกโฟลเดอร์รูปใน Google Drive">
                <SelectField id="sex" name="sex" defaultValue={normalizeSex(medium?.sex)} options={SEX_OPTIONS} invalid={!!errors?.sex} />
              </FormField>
              <FormField label="สถานะ" htmlFor="status" error={errors?.status}>
                <SelectField id="status" name="status" defaultValue={medium?.status ?? "active"} options={STATUS_OPTIONS} />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="องค์เทพ">
            <FormField
              label="ชื่อองค์เทพที่ประทับทรง"
              htmlFor="godName"
              error={errors?.godName}
              hint="พิมพ์ชื่อแล้วกด Enter เพื่อเพิ่ม (เพิ่มได้หลายองค์)"
            >
              <TagInput id="godName" name="godName" defaultValue={medium?.godName} placeholder="เช่น เจ้าพ่อกวนอู" />
            </FormField>
          </FormSection>
        </div>
      )}
    </EntityFormDialog>
  );
}

function normalizeSex(sex: string | null | undefined) {
  if (sex === "หญิง") return "female";
  if (sex === "ชาย") return "male";
  return sex ?? undefined;
}
