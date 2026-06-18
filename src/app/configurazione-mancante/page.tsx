import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfigurazioneMancantePage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Configurazione non completata</CardTitle>
        <CardDescription>
          Le impostazioni di collegamento non sono ancora state configurate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Controlla le variabili Supabase su Vercel.
        </p>
      </CardContent>
    </Card>
  );
}
