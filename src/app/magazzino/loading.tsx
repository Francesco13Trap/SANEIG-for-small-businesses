import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function MagazzinoLoading() {
  return (
    <div>
      <PageHeader
        title="Magazzino"
        description="Cosa hai in magazzino e cosa sta per finire."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento magazzino…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
