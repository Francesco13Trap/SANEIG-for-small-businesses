"use client";

import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";

export function AccountantNoteField() {
  const [nota, setNota] = useState("");

  return (
    <Textarea
      value={nota}
      onChange={(e) => setNota(e.target.value)}
      placeholder="Scrivi qui eventuali domande o promemoria per il commercialista..."
    />
  );
}
