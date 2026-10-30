"use client";

import { FormField } from "@/components/shared/form-field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TITLE_NAME_OPTIONS } from "@/lib/constants";
import type { ActionResult } from "@/lib/form";

export type PersonDefaults = {
  titleName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  nickName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
};

type Field = "nickName" | "address";

/** ช่องกรอกชื่อ-นามสกุล เบอร์โทร (และชื่อเล่น/ที่อยู่ ถ้าระบุ) ใช้ร่วมทุกฟอร์มบุคคล */
export function PersonNameFields({
  defaults = {},
  errors,
  include = ["nickName"],
}: {
  defaults?: PersonDefaults;
  errors: ActionResult["fieldErrors"];
  include?: Field[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
      <FormField label="คำนำหน้า" htmlFor="titleName" error={errors?.titleName} className="sm:col-span-2">
        <SelectField id="titleName" name="titleName" defaultValue={defaults.titleName} options={TITLE_NAME_OPTIONS} />
      </FormField>
      <FormField label="ชื่อ" htmlFor="firstName" required error={errors?.firstName} className="sm:col-span-4">
        <Input id="firstName" name="firstName" defaultValue={defaults.firstName ?? ""} className="h-10" autoFocus />
      </FormField>
      <FormField label="ชื่อกลาง" htmlFor="middleName" error={errors?.middleName} className="sm:col-span-2">
        <Input id="middleName" name="middleName" defaultValue={defaults.middleName ?? ""} className="h-10" />
      </FormField>
      <FormField label="นามสกุล" htmlFor="lastName" error={errors?.lastName} className="sm:col-span-4">
        <Input id="lastName" name="lastName" defaultValue={defaults.lastName ?? ""} className="h-10" />
      </FormField>
      {include.includes("nickName") && (
        <FormField label="ชื่อเล่น" htmlFor="nickName" error={errors?.nickName} className="sm:col-span-2">
          <Input id="nickName" name="nickName" defaultValue={defaults.nickName ?? ""} className="h-10" />
        </FormField>
      )}
      <FormField
        label="เบอร์โทรศัพท์"
        htmlFor="phoneNumber"
        error={errors?.phoneNumber}
        className={include.includes("nickName") ? "sm:col-span-4" : "sm:col-span-6"}
      >
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          inputMode="tel"
          placeholder="08x-xxx-xxxx"
          defaultValue={defaults.phoneNumber ?? ""}
          className="h-10"
        />
      </FormField>
      {include.includes("address") && (
        <FormField label="ที่อยู่" htmlFor="address" error={errors?.address} className="sm:col-span-6">
          <Textarea id="address" name="address" rows={3} defaultValue={defaults.address ?? ""} />
        </FormField>
      )}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-b border-border pb-6 last:border-none last:pb-0 [&+&]:pt-6">
      <h3 className="text-sm font-medium text-primary">{title}</h3>
      {children}
    </section>
  );
}
