import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PreventiviLoading() {
  return (
    <div>
      <PageHeader
        title="Preventivi"
        description="I preventivi proposti ai clienti e il loro stato."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento preventivi…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
