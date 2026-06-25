import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PromemoriaLoading() {
  return (
    <div>
      <PageHeader
        title="Promemoria"
        description="Le cose da non dimenticare, in ordine di importanza."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento promemoria…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
