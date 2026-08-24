import type { LucideIcon } from "lucide-react";
import { BatteryCharging, PlugZap, SunMedium } from "lucide-react";

export interface Solution {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

/** Três frentes de peso igual — Soluções (#solucoes). */
export const solutions: Solution[] = [
  {
    number: "01",
    icon: SunMedium,
    title: "Sistemas fotovoltaicos",
    description:
      "Geração solar dimensionada pelo consumo real, com projeto elétrico, estruturas e proteções especificadas por engenharia. Residencial, comercial, industrial e rural.",
    href: "#fotovoltaico",
    linkLabel: "Ver detalhes ↓",
  },
  {
    number: "02",
    icon: BatteryCharging,
    title: "Armazenamento de energia",
    description:
      "Baterias e sistemas BESS para backup, autoconsumo e gestão de demanda. O banco é dimensionado pela criticidade das cargas, não por catálogo.",
    href: "#armazenamento",
    linkLabel: "Ver detalhes ↓",
  },
  {
    number: "03",
    icon: PlugZap,
    title: "Eletromobilidade",
    description:
      "Infraestrutura de recarga para veículos elétricos: carregadores AC e DC, projeto elétrico, gestão de carga e rateio em condomínios e frotas.",
    href: "#eletromobilidade",
    linkLabel: "Ver detalhes ↓",
  },
];
