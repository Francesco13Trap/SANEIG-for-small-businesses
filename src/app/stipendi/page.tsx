import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { StipendiTable } from "@/components/stipendi/stipendi-table";
import { stipendi } from "@/lib/mock-data";

export default function StipendiPage() {
  return (
    <div>
      <PageHeader
        title="Stipendi"
        description="Un riferimento semplice per gli stipendi da pagare e quelli già pagati."
      />

      <Card>
        <CardContent className="p-0">
          <StipendiTable stipendi={stipendi} />
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Saneig non sostituisce il commercialista.
      </TrustNote>
    </div>
  );
}
