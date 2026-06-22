import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function MessaggiLoading() {
  return (
    <div>
      <PageHeader
        title="Messaggi"
        description="Messaggi pronti da copiare, preparati dai pagamenti e dagli abbonamenti reali."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Caricamento messaggi…</p>
        </CardContent>
      </Card>
    </div>
  );
}
