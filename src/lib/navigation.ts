import type { LucideIcon } from "lucide-react";
import {
  Sun,
  Users,
  Bell,
  MessageSquare,
  Repeat,
  Wallet,
  CalendarRange,
  Megaphone,
  Star,
  FileText,
  Briefcase,
  Receipt,
  Banknote,
  Truck,
  Package,
  ClipboardList,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Da fare oggi",
    items: [
      { label: "Oggi", href: "/", icon: Sun },
      { label: "Promemoria", href: "/promemoria", icon: Bell },
      { label: "Messaggi", href: "/messaggi", icon: MessageSquare },
      {
        label: "Riepilogo settimana",
        href: "/riepilogo-settimana",
        icon: CalendarRange,
      },
    ],
  },
  {
    title: "Clienti e vendite",
    items: [
      { label: "Clienti", href: "/clienti", icon: Users },
      { label: "Abbonamenti", href: "/abbonamenti", icon: Repeat },
      { label: "Promozioni", href: "/promozioni", icon: Megaphone },
      { label: "Recensioni", href: "/recensioni", icon: Star },
    ],
  },
  {
    title: "Soldi e scadenze",
    items: [
      { label: "Pagamenti", href: "/pagamenti", icon: Wallet },
      { label: "IVA e incassi", href: "/iva-e-incassi", icon: Receipt },
      { label: "Commercialista", href: "/commercialista", icon: Briefcase },
      { label: "Stipendi", href: "/stipendi", icon: Banknote },
    ],
  },
  {
    title: "Gestione attività",
    items: [
      { label: "Preventivi", href: "/preventivi", icon: FileText },
      { label: "Fornitori", href: "/fornitori", icon: Truck },
      { label: "Magazzino", href: "/magazzino", icon: Package },
      {
        label: "Scadenze attività",
        href: "/scadenze-attivita",
        icon: ClipboardList,
      },
    ],
  },
];
