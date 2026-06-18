import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { MagazzinoTable } from "@/components/magazzino/magazzino-table";
import { magazzino } from "@/lib/mock-data";

export default function MagazzinoPage() {
  return (
    <div>
      <PageHeader
        title="Magazzino"
        description="Cosa hai in magazzino e cosa sta per finire."
      />

      <Card>
        <CardContent className="p-0">
          <MagazzinoTable articoli={magazzino} />
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
