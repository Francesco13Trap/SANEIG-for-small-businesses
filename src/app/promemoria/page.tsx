import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { PromemoriaList } from "@/components/promemoria/promemoria-list";
import { promemoria } from "@/lib/mock-data";

export default function PromemoriaPage() {
  return (
    <div>
      <PageHeader
        title="Promemoria"
        description="Le cose da non dimenticare, in ordine di importanza."
      />

      <PromemoriaList promemoria={promemoria} />

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
