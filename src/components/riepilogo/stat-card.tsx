import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-5">
        <span className="text-3xl font-semibold text-foreground">
          {value.toLocaleString("it-IT")}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
