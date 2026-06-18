import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Stars({ punteggio }: { punteggio: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < punteggio
              ? "fill-warning text-warning"
              : "fill-none text-border"
          )}
        />
      ))}
    </div>
  );
}
