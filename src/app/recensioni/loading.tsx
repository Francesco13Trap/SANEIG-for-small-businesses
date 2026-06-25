import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function RecensioniLoading() {
  return (
    <div>
      <PageHeader
        title="Recensioni"
        description="Le recensioni lasciate dai clienti, da leggere e da ringraziare."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento recensioni…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
