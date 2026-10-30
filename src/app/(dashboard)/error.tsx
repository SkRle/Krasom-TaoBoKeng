"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-16 text-center ring-1 ring-border">
      <h2 className="text-lg font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
      <p className="text-sm font-light text-muted-foreground">กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล แล้วลองใหม่อีกครั้ง</p>
      <Button onClick={reset} className="mt-2">
        ลองใหม่
      </Button>
    </div>
  );
}
