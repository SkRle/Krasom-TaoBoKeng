/**
 * เพิ่ม/เปลี่ยนรหัสผ่านผู้ดูแลระบบ (รันด้วย `npm run admin:create`)
 *
 *   npm run admin:create                  → ถามชื่อผู้ใช้และรหัสผ่าน
 *   npm run admin:create -- admin-krasom  → ถามเฉพาะรหัสผ่าน
 *
 * ถ้ามีชื่อผู้ใช้อยู่แล้ว จะเปลี่ยนรหัสผ่านให้ใหม่
 * ต้องรัน prisma/sql/002_admin.sql ใน Supabase ก่อน
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: [".env.local", ".env"], quiet: true });

// อ่านทีละบรรทัดจาก stdin (รองรับทั้งพิมพ์เองและ pipe เข้ามา)
const rl = createInterface({ input: stdin, output: stdout, terminal: stdin.isTTY });
const lines = rl[Symbol.asyncIterator]();

async function ask(question: string, hidden = false) {
  if (!stdin.isTTY) {
    stdout.write(question + "\n");
    return String((await lines.next()).value ?? "");
  }
  // ซ่อนตัวอักษรรหัสผ่านขณะพิมพ์
  const out = rl as unknown as { _writeToOutput: (s: string) => void };
  const write = out._writeToOutput;
  if (hidden) {
    out._writeToOutput = (s: string) => write.call(rl, s.startsWith(question) ? s : s.includes("\n") ? "\n" : "");
  }
  const answer = await rl.question(question);
  out._writeToOutput = write;
  return answer;
}

async function main() {
  const username = (process.argv[2] ?? (await ask("ชื่อผู้ใช้: "))).trim();
  if (!/^[a-zA-Z0-9._-]{3,50}$/.test(username)) {
    throw new Error("ชื่อผู้ใช้ต้องเป็น a-z, 0-9, . _ - ความยาว 3-50 ตัวอักษร");
  }
  const password = await ask("รหัสผ่าน: ", true);
  if (password.length < 8) throw new Error("รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร");
  const confirm = await ask("ยืนยันรหัสผ่าน: ", true);
  if (password !== confirm) throw new Error("รหัสผ่านไม่ตรงกัน");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }) });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.upsert({
      where: { username },
      create: { username, passwordHash },
      update: { passwordHash },
    });
    console.log(`\nบันทึกผู้ดูแลระบบ "${admin.username}" เรียบร้อย (id ${admin.id})`);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main().catch((error) => {
  console.error("\nไม่สำเร็จ:", error instanceof Error ? error.message : error);
  process.exit(1);
});
