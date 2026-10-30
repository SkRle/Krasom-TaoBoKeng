"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav({ footer }: { footer?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon-lg" className="bg-card lg:hidden" aria-label="เปิดเมนู">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-none bg-sidebar p-5 text-sidebar-foreground">
        <SheetTitle className="sr-only">เมนู</SheetTitle>
        <Brand className="px-1" />
        <div className="my-6 h-px bg-sidebar-border" />
        <NavLinks onNavigate={() => setOpen(false)} />
        <div className="mt-auto border-t border-sidebar-border pt-4">{footer}</div>
      </SheetContent>
    </Sheet>
  );
}
