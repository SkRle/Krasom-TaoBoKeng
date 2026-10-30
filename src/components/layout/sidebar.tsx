import { Brand } from "@/components/layout/brand";
import { LogoutButton } from "@/components/layout/logout-button";
import { NavLinks } from "@/components/layout/nav-links";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
      <Brand className="px-1" />
      <div className="my-6 h-px bg-sidebar-border" />
      <p className="mb-2 px-4 text-xs font-light tracking-wide text-sidebar-foreground/60">เมนูหลัก</p>
      <NavLinks />
      <div className="mt-auto border-t border-sidebar-border pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
