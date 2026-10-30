"use client";

import { AvatarUpload } from "@/components/shared/avatar-upload";
import { EntityFormDialog } from "@/components/shared/entity-form-dialog";
import { FormField } from "@/components/shared/form-field";
import { FormSection, PersonNameFields } from "@/components/shared/person-fields";
import { ComboboxField } from "@/components/shared/combobox-field";
import { SelectField } from "@/components/shared/select-field";
import { SEX_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { NONE_VALUE } from "@/lib/form";
import { createHelper, updateHelper } from "../actions";
import type { HelperRow, MediumOption } from "../types";

type Props = {
  helper?: HelperRow;
  mediumOptions: MediumOption[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function HelperFormDialog({ helper, mediumOptions, ...dialogProps }: Props) {
  return (
    <EntityFormDialog
      {...dialogProps}
      title={helper ? "แก้ไขข้อมูลพี่เลี้ยง" : "เพิ่มพี่เลี้ยง"}
      description="ข้อมูลที่มีเครื่องหมาย * จำเป็นต้องกรอก"
      action={helper ? updateHelper.bind(null, helper.id) : createHelper}
    >
      {({ fieldErrors: errors }) => (
        <div className="space-y-6">
          <FormSection title="รูปโปรไฟล์">
            <AvatarUpload profileId={helper?.profileId} />
            {errors?.image && <p className="text-xs text-primary">{errors.image[0]}</p>}
          </FormSection>

          <FormSection title="ข้อมูลส่วนตัว">
            <PersonNameFields defaults={helper} errors={errors} include={["nickName", "address"]} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="เพศ" htmlFor="sex" error={errors?.sex}>
                <SelectField id="sex" name="sex" defaultValue={helper?.sex} options={SEX_OPTIONS} />
              </FormField>
              <FormField label="สถานะ" htmlFor="status" error={errors?.status}>
                <SelectField id="status" name="status" defaultValue={helper?.status ?? "active"} options={STATUS_OPTIONS} />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="การดูแล">
            <FormField label="ดูแลม้าทรง" htmlFor="mediumId" error={errors?.mediumId}>
              <ComboboxField
                id="mediumId"
                name="mediumId"
                placeholder="เลือกม้าทรง"
                searchPlaceholder="พิมพ์ชื่อหรือชื่อเล่นม้าทรง…"
                emptyText="ไม่พบม้าทรงที่ค้นหา"
                defaultValue={helper?.mediumId != null ? String(helper.mediumId) : undefined}
                options={[{ value: NONE_VALUE, label: "ไม่ระบุ" }, ...mediumOptions]}
              />
            </FormField>
          </FormSection>
        </div>
      )}
    </EntityFormDialog>
  );
}
