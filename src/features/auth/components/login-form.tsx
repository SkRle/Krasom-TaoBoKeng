"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionResult } from "@/lib/form";
import { login } from "../actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, action, isPending] = useActionState(login, initialActionResult);
  const errors = state.fieldErrors;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
      <FormField label="ชื่อผู้ใช้" htmlFor="username" error={errors?.username}>
        <Input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} className="h-11" required autoFocus />
      </FormField>
      <FormField label="รหัสผ่าน" htmlFor="password" error={errors?.password}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck={false}
            className="h-11 pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
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
