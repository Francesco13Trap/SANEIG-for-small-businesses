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

export default async function NuovaAttivitaPage() {
  const supabase = await createClient();
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
