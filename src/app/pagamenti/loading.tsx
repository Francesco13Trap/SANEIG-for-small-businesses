import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PagamentiLoading() {
  return (
    <div>
      <PageHeader
        title="Pagamenti"
        description="I pagamenti da controllare o da sollecitare ai clienti."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento pagamenti…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
