"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavList } from "@/components/layout/nav-list";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/supabase/actions";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
      <span className="text-lg font-semibold text-foreground">Impresa Viva</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Apri il menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex h-16 items-center border-b border-border px-5">
            <SheetTitle>Impresa Viva</SheetTitle>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
          <form action={signOut} className="border-t border-border p-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Esci
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </header>
  );
}
