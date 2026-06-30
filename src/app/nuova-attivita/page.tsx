import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { NuovaAttivitaForm } from "@/app/nuova-attivita/nuova-attivita-form";

// Reads the session via Supabase on every request — must never be
// prerendered at build time, when env vars/cookies aren't available.
export const dynamic = "force-dynamic";

export default async function NuovaAttivitaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/accedi");
  }

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (membership) {
    redirect("/");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crea la tua attività</CardTitle>
        <CardDescription>
          Dai un nome alla tua attività per iniziare a usare Impresa Viva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NuovaAttivitaForm />
      </CardContent>
    </Card>
  );
}
