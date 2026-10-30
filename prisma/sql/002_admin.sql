-- ตารางผู้ดูแลระบบสำหรับเข้าสู่ระบบหลังบ้าน
-- รันครั้งเดียวใน Supabase > SQL Editor แล้วเพิ่มผู้ใช้ด้วย `npm run admin:create`
-- (ห้ามเก็บรหัสผ่านจริงในตาราง — เก็บเฉพาะ bcrypt hash)
CREATE TABLE IF NOT EXISTS public.admin (
  id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(50) NOT NULL UNIQUE,
  password_hash varchar NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

-- ตารางนี้ใช้ผ่านเซิร์ฟเวอร์ (Prisma) เท่านั้น: เปิด RLS โดยไม่มี policy
-- เพื่อไม่ให้อ่าน hash ได้ผ่าน Supabase REST API ด้วย publishable key
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
