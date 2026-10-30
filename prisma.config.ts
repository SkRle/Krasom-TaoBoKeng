import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// อ่าน .env.local ก่อน (ถ้ามี) แล้วตามด้วย .env — ลำดับเดียวกับ Next.js
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // CLI (db pull / generate) ใช้ direct connection พอร์ต 5432
    url: process.env.DIRECT_URL,
  },
});
