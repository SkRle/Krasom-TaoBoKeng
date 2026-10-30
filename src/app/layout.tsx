import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `ระบบจัดการ | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `ระบบหลังบ้านสำหรับจัดการข้อมูล${SITE_NAME}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors={false} />
      </body>
    </html>
  );
}
