import { CopyMessageButton } from "@/components/copy-message-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReminderMessage } from "@/lib/messaggi/reminders";

export function ReminderMessageCard({ message }: { message: ReminderMessage }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{message.cliente}</CardTitle>
        <CardDescription>
          {message.motivo} · {message.dettaglio}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="rounded-lg bg-secondary p-3 text-sm text-foreground">
          {message.testo}
        </p>
      </CardContent>
      <CardFooter>
        <CopyMessageButton message={message.testo} />
      </CardFooter>
    </Card>
  );
}
