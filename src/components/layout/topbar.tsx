import { Suspense } from "react";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur md:px-8">
      <MobileNav footer={<LogoutButton />} />
      <div className="ml-auto">
        <Suspense fallback={<Skeleton className="h-10 w-48 rounded-full" />}>
          <CurrentUser />
        </Suspense>
      </div>
    </header>
  );
}

async function CurrentUser() {
  const user = await getCurrentUser();
  const username = user?.username ?? "";

  return (
    <div className="flex items-center gap-3 rounded-full bg-card py-1 pr-4 pl-1 shadow-xs ring-1 ring-border">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground uppercase">
        {username.charAt(0) || "?"}
      </span>
      <div className="hidden leading-tight sm:block">
        <p className="text-xs text-muted-foreground">ผู้ดูแลระบบ</p>
        <p className="max-w-48 truncate text-sm font-medium">{username}</p>
      </div>
    </div>
  );
}
