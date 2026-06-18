import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/app/accedi/login-form";

export default function AccediPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Accedi a Impresa Viva</CardTitle>
        <CardDescription>
          Inserisci le tue credenziali per continuare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Non hai un account?{" "}
          <Link
            href="/registrati"
            className="font-medium text-primary hover:underline"
          >
            Registrati
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
