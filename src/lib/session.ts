import { jwtVerify, SignJWT } from "jose";

/** cookie เก็บ session แบบ JWT ที่เซ็นด้วย SESSION_SECRET (ใช้ได้ทั้งใน proxy และ server) */
export const SESSION_COOKIE = "krasom_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 วัน

export type SessionPayload = { adminId: number; username: string };

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET ต้องตั้งค่าและยาวอย่างน้อย 32 ตัวอักษร");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** คืน payload ถ้า token ถูกต้องและยังไม่หมดอายุ ไม่งั้นคืน null */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (typeof payload.adminId !== "number" || typeof payload.username !== "string") return null;
    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
