import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NuovaPasswordForm } from "@/app/nuova-password/nuova-password-form";
import { createClient } from "@/lib/supabase/server";

export default async function NuovaPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Link non valido</CardTitle>
          <CardDescription>
            Il link per reimpostare la password non è valido o è scaduto.
            Richiedine uno nuovo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/password-dimenticata"
            className="text-sm font-medium text-primary hover:underline"
          >
            Richiedi un nuovo link
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crea una nuova password</CardTitle>
        <CardDescription>
          Scegli una nuova password per il tuo account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NuovaPasswordForm />
      </CardContent>
    </Card>
  );
}
