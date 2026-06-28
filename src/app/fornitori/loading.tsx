import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function FornitoriLoading() {
  return (
    <div>
      <PageHeader
        title="Fornitori"
        description="I fornitori dell'attività e i loro contatti."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento fornitori…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
