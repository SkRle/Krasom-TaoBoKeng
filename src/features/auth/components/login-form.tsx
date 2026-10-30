"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionResult } from "@/lib/form";
import { login } from "../actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, action, isPending] = useActionState(login, initialActionResult);
  const errors = state.fieldErrors;

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
      <FormField label="ชื่อผู้ใช้" htmlFor="username" error={errors?.username}>
        <Input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} className="h-11" required autoFocus />
      </FormField>
      <FormField label="รหัสผ่าน" htmlFor="password" error={errors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" className="h-11" required />
      </FormField>
      {state.message && (
        <p role="alert" className="rounded-lg bg-accent px-3 py-2 text-sm text-primary">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="mt-2 h-11 text-base">
        {isPending && <Loader2 className="animate-spin" />}
        เข้าสู่ระบบ
      </Button>
    </form>
  );
}
