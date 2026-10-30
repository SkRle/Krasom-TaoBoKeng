-- เพิ่มคอลัมน์ชื่อเล่นให้ตาราง board_direct (ชื่อเดียวกับ medium / medium_helper)
-- รันครั้งเดียวใน Supabase > SQL Editor ไม่กระทบข้อมูลเดิม
ALTER TABLE public.board_direct ADD COLUMN IF NOT EXISTS nick_name varchar;
