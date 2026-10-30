import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-6xl font-semibold text-primary">404</p>
      <h1 className="text-xl font-medium">ไม่พบหน้าที่ต้องการ</h1>
      <Button asChild className="mt-2">
        <Link href="/">กลับหน้าหลัก</Link>
      </Button>
    </div>
  );
}
