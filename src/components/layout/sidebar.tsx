import Link from "next/link";

import { NavList } from "@/components/layout/nav-list";

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/" className="text-lg font-semibold text-foreground">
          Impresa Viva
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavList />
      </div>
    </aside>
  );
}
