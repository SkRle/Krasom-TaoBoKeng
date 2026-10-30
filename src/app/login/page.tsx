import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/features/auth/components/login-form";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src="/brand/temple.jpg" alt="ภาพศาลเจ้า" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-sm font-light opacity-90">ระบบหลังบ้าน</p>
          <p className="text-3xl font-semibold">{SITE_NAME}</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 size-24 overflow-hidden rounded-full bg-white shadow-sm ring-4 ring-white">
              <Image src="/brand/logo.png" alt="ตราศาลเจ้า" fill sizes="96px" className="object-contain" priority />
            </div>
            <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>
            <p className="mt-1 text-sm font-light text-muted-foreground">สำหรับผู้ดูแลระบบ{SITE_NAME}</p>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
