import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemoRequestForm } from "@/components/richiedi-demo/demo-request-form";

export const metadata: Metadata = {
  title: "Richiedi una demo — Impresa Viva",
  description:
    "Lascia i tuoi dati e ti ricontatteremo per mostrarti come funziona Impresa Viva con clienti, pagamenti e scadenze.",
};

export default function RichiediDemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/presentazione"
            className="text-base font-semibold text-foreground"
          >
            Impresa Viva
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/accedi">Accedi</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-14 sm:py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Vuoi provare Impresa Viva per la tua attività?
            </CardTitle>
            <CardDescription>
              Lascia i tuoi dati e ti ricontatteremo per mostrarti come
              funziona con clienti, pagamenti e scadenze.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemoRequestForm />
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          Impresa Viva — Gestionale semplice per piccoli business italiani.
        </p>
      </footer>
    </div>
  );
}
