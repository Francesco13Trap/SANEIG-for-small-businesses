import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordDimenticataForm } from "@/app/password-dimenticata/password-dimenticata-form";

export default function PasswordDimenticataPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recupera la password</CardTitle>
        <CardDescription>
          Inserisci la tua email: se è registrata, ti invieremo un link per
          reimpostare la password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordDimenticataForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link
            href="/accedi"
            className="font-medium text-primary hover:underline"
          >
            Torna ad accedere
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
