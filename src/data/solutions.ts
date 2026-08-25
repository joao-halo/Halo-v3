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
      "Energia solar para reduzir a conta de luz da sua casa ou empresa. Projeto, instalação e homologação de sistemas fotovoltaicos em Belo Horizonte, dimensionados pelo consumo real.",
    href: "#fotovoltaico",
    linkLabel: "Ver detalhes ↓",
  },
  {
    number: "02",
    icon: BatteryCharging,
    title: "Armazenamento de energia",
    description:
      "Baterias e sistemas BESS que mantêm as cargas críticas em operação durante apagões e deslocam consumo do horário de ponta. O banco é dimensionado pela criticidade de cada carga.",
    href: "#armazenamento",
    linkLabel: "Ver detalhes ↓",
  },
  {
    number: "03",
    icon: PlugZap,
    title: "Eletromobilidade",
    description:
      "Eletropostos e carregadores para carros elétricos, com projeto elétrico, gestão de carga e rateio. Para condomínios, frotas e empresas em Belo Horizonte.",
    href: "#eletromobilidade",
    linkLabel: "Ver detalhes ↓",
  },
];
