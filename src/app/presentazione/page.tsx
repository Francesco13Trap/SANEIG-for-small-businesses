import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageSquare, Repeat, Sun, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/landing/feature-card";
import { DEMO_ACCOUNT_EMAIL } from "@/lib/oggi/demo-account";

export const metadata: Metadata = {
  title: "Impresa Viva — Il gestionale semplice per piccoli business italiani",
  description:
    "Tieni sotto controllo clienti, pagamenti, scadenze e messaggi senza fogli sparsi o promemoria dimenticati.",
};

const features = [
  {
    icon: Users,
    title: "Clienti",
    description: "Tieni in ordine contatti, note e informazioni utili.",
  },
  {
    icon: Wallet,
    title: "Pagamenti",
    description:
      "Vedi cosa è pagato, cosa è da controllare e cosa va sollecitato.",
  },
  {
    icon: Repeat,
    title: "Abbonamenti e scadenze",
    description: "Non perdere rinnovi e date importanti.",
  },
  {
    icon: Sun,
    title: "Oggi",
    description: "Vedi subito cosa controllare prima.",
  },
  {
    icon: MessageSquare,
    title: "Messaggi",
    description:
      "Prepara testi pronti da copiare, senza inviare nulla automaticamente.",
  },
];

const trustPoints = [
  "Nessun messaggio parte da solo.",
  "I dati degli account restano separati.",
  "Pensato per piccoli business italiani.",
  "Semplice da usare anche da telefono.",
];

export default function PresentazionePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-base font-semibold text-foreground">
            Impresa Viva
          </span>
          <Button asChild variant="outline" size="sm">
            <Link href="/accedi">Accedi</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-4 py-14 text-center sm:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Il gestionale semplice per piccoli business italiani
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Tieni sotto controllo clienti, pagamenti, scadenze e messaggi
              senza fogli sparsi o promemoria dimenticati.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/accedi">Prova la demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/accedi">Accedi</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Troppe cose da tenere a mente
            </h2>
            <p className="text-base text-muted-foreground">
              Clienti, pagamenti, rinnovi e promemoria finiscono spesso
              sparsi tra WhatsApp, appunti, carta e memoria. Quando le cose
              sono tante, qualcosa rischia di sfuggire.
            </p>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <FeatureCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col gap-4 p-6">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="px-4 py-12">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <p className="text-base text-foreground">
                Puoi provare Impresa Viva con dati di esempio, così capisci
                subito come funziona.
              </p>
              <p className="text-sm text-muted-foreground">
                Account demo: {DEMO_ACCOUNT_EMAIL}
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/accedi">Entra nella demo</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="px-4 py-14 text-center sm:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Vuoi tenere tutto più ordinato?
            </h2>
            <p className="text-base text-muted-foreground">
              Prova Impresa Viva e guarda come può aiutarti a controllare
              clienti, pagamenti e scadenze.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/accedi">Prova la demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/accedi">Accedi</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          Impresa Viva — Gestionale semplice per piccoli business italiani.
        </p>
      </footer>
    </div>
  );
}
