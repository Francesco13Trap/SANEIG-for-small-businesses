import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/app/registrati/signup-form";

export default function RegistratiPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crea il tuo account</CardTitle>
        <CardDescription>
          Bastano pochi dati per iniziare a usare Impresa Viva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Hai già un account?{" "}
          <Link
            href="/accedi"
            className="font-medium text-primary hover:underline"
          >
            Accedi
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
