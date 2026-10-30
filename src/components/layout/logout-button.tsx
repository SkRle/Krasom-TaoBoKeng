import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
          className,
        )}
      >
        <LogOut className="size-[18px]" />
        ออกจากระบบ
      </button>
    </form>
  );
}
