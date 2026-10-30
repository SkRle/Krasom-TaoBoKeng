"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";

const loginSchema = z.object({
  username: z.string().trim().min(1, "กรุณากรอกชื่อผู้ใช้").max(50),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน").max(200),
  next: z.string().optional(),
});

// ใช้เทียบเมื่อไม่พบชื่อผู้ใช้ เพื่อให้เวลาตอบสนองเท่ากัน (ไม่บอกใบ้ว่าชื่อผู้ใช้มีอยู่จริงหรือไม่)
const DUMMY_HASH = "$2b$12$jQMnrSHaxoTzU6LIeWC6gepXSNpRjEKQ3GH6xY.X1zc2S4HVbEMUy";

export async function login(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { username, password, next } = parsed.data;

  let admin;
  try {
    admin = await prisma.admin.findUnique({ where: { username } });
  } catch (error) {
    console.error("[login] database error", error);
    return { ok: false, message: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ" };
  }

  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) return { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };

  const token = await signSession({ adminId: admin.id, username: admin.username });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } }).catch(() => {});

  // ป้องกัน open redirect: อนุญาตเฉพาะ path ภายในระบบ
  redirect(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
