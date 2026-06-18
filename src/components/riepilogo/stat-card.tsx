import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-5">
        <span className="text-3xl font-semibold text-foreground">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
