-- เพิ่มคอลัมน์ profile_id ให้ตาราง board_direct (เหมือน medium / medium_helper)
-- เพื่อให้ลบ/เปลี่ยนรูปใน Google Drive ได้ ไม่กระทบข้อมูลเดิม
-- รันครั้งเดียวใน Supabase > SQL Editor
ALTER TABLE public.board_direct ADD COLUMN IF NOT EXISTS profile_id varchar;
