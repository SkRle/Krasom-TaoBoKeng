import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/** ตรวจสิทธิ์ซ้ำฝั่งเซิร์ฟเวอร์ (proxy เป็นแค่ด่านแรก) — ใช้ใน Server Action และ Route Handler */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
