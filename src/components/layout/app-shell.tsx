"use client";

import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

// Auth pages render without the sidebar/header chrome — there is no
// signed-in business to navigate yet.
const NO_CHROME_PATHS = [
  "/accedi",
  "/registrati",
  "/nuova-attivita",
  "/configurazione-mancante",
  "/password-dimenticata",
  "/nuova-password",
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (NO_CHROME_PATHS.includes(pathname)) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
