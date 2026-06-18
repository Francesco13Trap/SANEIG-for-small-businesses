import Link from "next/link";
import { LogOut } from "lucide-react";

import { NavList } from "@/components/layout/nav-list";
import { signOut } from "@/lib/supabase/actions";

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
      <form action={signOut} className="border-t border-border p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Esci
        </button>
      </form>
    </aside>
  );
}
