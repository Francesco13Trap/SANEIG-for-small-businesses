"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ALIQUOTE_IVA = [22, 10, 5, 4, 0] as const;

export function AliquotaSelect({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(Number(v))}
    >
      <SelectTrigger id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALIQUOTE_IVA.map((aliquota) => (
          <SelectItem key={aliquota} value={String(aliquota)}>
            {aliquota}%
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
