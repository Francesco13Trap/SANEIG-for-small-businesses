"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyMessageButton({
  message,
  label = "Copia messaggio",
}: {
  message: string;
  label?: string;
}) {
  const [copiato, setCopiato] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(message);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);
    } catch {
      setCopiato(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      {copiato ? (
        <>
          <Check className="h-4 w-4" />
          Copiato
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
