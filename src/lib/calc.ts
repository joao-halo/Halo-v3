/**
 * Cálculos dos simuladores — funções puras, sem dependência de React.
 *
 * Todas as constantes são premissas de referência declaradas em tela
 * junto ao disclaimer. Nenhuma delas é promessa de resultado.
 */

/* ============================================================
   Simulador A — economia com geração solar
   ============================================================ */

/** Parcela da conta passível de compensação pela geração própria. */
export const COMPENSATION_RATE = 0.8;

/** Geração específica de referência para a região. */
export const SPECIFIC_YIELD = 4.7; // kWh por kWp por dia
export const DAYS_PER_MONTH = 30;

/**
 * Preço de referência do projeto, em R$ por Wp instalado.
 * Equivale a R$ 2.300 por kWp.
 */
export const PRICE_PER_WP = 2.3;

/**
 * Faixa de retorno do investimento apresentada na simulação.
 * É uma faixa declarada, não um número calculado: o payback real depende do
 * preço fechado, da tarifa da distribuidora e do perfil de consumo.
 */
export const PAYBACK_MIN_YEARS = 2.5;
export const PAYBACK_MAX_YEARS = 3;

/** Limites do slider de conta média. */
export const BILL_MIN = 200;
export const BILL_MAX = 2_000;
export const BILL_STEP = 50;
export const BILL_DEFAULT = 800;

/** Tarifa de energia usada por padrão nos dois simuladores. */
export const TARIFF_DEFAULT = 0.95; // R$/kWh
export const TARIFF_MIN = 0.3;
export const TARIFF_MAX = 2;

export interface SavingsInput {
  /** Conta média mensal em reais. */
  bill: number;
  /** Tarifa de energia em R$/kWh. */
  tariff: number;
}

export interface SavingsResult {
  /** Economia mensal estimada, em reais. */
  monthly: number;
  /** Consumo mensal implícito na conta informada, em kWh. */
  monthlyKwh: number;
  /** Potência estimada do sistema, em kWp. */
  powerKwp: number;
  /** Valor de referência do projeto, em reais. */
  projectValue: number;
}

/** Mantém a entrada dentro dos limites do slider. */
export function clampBill(bill: number): number {
  // NaN não tem ordem: cai no mínimo. ±Infinity é ordenável e satura normalmente.
  if (Number.isNaN(bill)) return BILL_MIN;
  return Math.min(BILL_MAX, Math.max(BILL_MIN, bill));
}

/** Tarifa fora de faixa distorce a potência estimada; satura nos limites. */
export function clampTariff(tariff: number): number {
  if (Number.isNaN(tariff)) return TARIFF_DEFAULT;
  return Math.min(TARIFF_MAX, Math.max(TARIFF_MIN, tariff));
}

export function calculateSavings({ bill, tariff }: SavingsInput): SavingsResult {
  const safeBill = clampBill(bill);
  const safeTariff = clampTariff(tariff);

  const monthly = safeBill * COMPENSATION_RATE;
  const monthlyKwh = safeBill / safeTariff;
  const powerKwp = monthlyKwh / (SPECIFIC_YIELD * DAYS_PER_MONTH);
  // R$/Wp × 1000 Wp/kWp × kWp
  const projectValue = PRICE_PER_WP * 1_000 * powerKwp;

  return { monthly, monthlyKwh, powerKwp, projectValue };
}

/* ============================================================
   Simulador B — recarga de veículo elétrico
   ============================================================ */

export type VehicleId = "compact" | "sedan" | "suv" | "pickup";

/** Consumo de referência em kWh por 100 km. */
export const VEHICLE_CONSUMPTION: Record<VehicleId, number> = {
  compact: 14,
  sedan: 17,
  suv: 20,
  pickup: 24,
};

export const DISTANCE_MIN = 200;
export const DISTANCE_MAX = 4_000;
export const DISTANCE_STEP = 50;
export const DISTANCE_DEFAULT = 1_200;

export const FUEL_PRICE_DEFAULT = 6.2; // R$/L
export const FUEL_EFFICIENCY_DEFAULT = 11; // km/L

/** Potência de carregador sugerida a partir da energia reposta por dia. */
export type ChargerId = "wallbox-7.4" | "wallbox-22" | "rapido";

export const CHARGER_THRESHOLDS = {
  /** Até 8 kWh/dia → wallbox de 7,4 kW. */
  low: 8,
  /** Até 20 kWh/dia → wallbox de 22 kW (11 kW por veículo). */
  medium: 20,
} as const;

export const CHARGERS: Record<ChargerId, { label: string; detail: string }> = {
  "wallbox-7.4": {
    label: "Wallbox 7,4 kW",
    detail: "Reposição noturna em 220 V dá conta da rotina informada.",
  },
  "wallbox-22": {
    label: "Wallbox 22 kW",
    detail:
      "Trifásico 380 V, com autotransformador na maioria das instalações. Entrega 11 kW por veículo, em duas saídas.",
  },
  rapido: {
    label: "Carregador rápido",
    detail:
      "Demanda diária alta. A escolha entre wallbox de 22 kW e recarga em corrente contínua depende do tempo de parada disponível.",
  },
};

export interface EvInput {
  /** Quilometragem mensal. */
  distanceKm: number;
  /** Consumo do veículo em kWh por 100 km. */
  consumptionKwh100: number;
  /** Tarifa de energia em R$/kWh. */
  tariff: number;
  /** Preço do combustível em R$/L. */
  fuelPrice: number;
  /** Eficiência do carro a combustão em km/L. */
  fuelEfficiency: number;
}

export interface EvResult {
  /** Energia consumida por mês, em kWh. */
  monthlyEnergyKwh: number;
  /** Energia reposta por dia, em kWh. */
  dailyEnergyKwh: number;
  /** Custo mensal rodando elétrico. */
  electricCost: number;
  /** Custo mensal rodando a combustão. */
  combustionCost: number;
  /** Diferença mensal entre os dois. Negativo quando o elétrico custa mais. */
  savings: number;
  electricCostPerKm: number;
  combustionCostPerKm: number;
  charger: { id: ChargerId; label: string; detail: string };
}

export function clampDistance(distance: number): number {
  if (Number.isNaN(distance)) return DISTANCE_MIN;
  return Math.min(DISTANCE_MAX, Math.max(DISTANCE_MIN, distance));
}

/** Regra de recomendação a partir da energia reposta por dia. */
export function recommendCharger(dailyEnergyKwh: number): ChargerId {
  if (dailyEnergyKwh <= CHARGER_THRESHOLDS.low) return "wallbox-7.4";
  if (dailyEnergyKwh <= CHARGER_THRESHOLDS.medium) return "wallbox-22";
  return "rapido";
}

export function calculateEv({
  distanceKm,
  consumptionKwh100,
  tariff,
  fuelPrice,
  fuelEfficiency,
}: EvInput): EvResult {
  const distance = clampDistance(distanceKm);

  const monthlyEnergyKwh = (distance * consumptionKwh100) / 100;
  const dailyEnergyKwh = monthlyEnergyKwh / DAYS_PER_MONTH;

  const electricCost = monthlyEnergyKwh * tariff;
  // Eficiência zero ou negativa não descreve um veículo: custo indefinido vira 0.
  const litres = fuelEfficiency > 0 ? distance / fuelEfficiency : 0;
  const combustionCost = litres * fuelPrice;

  const chargerId = recommendCharger(dailyEnergyKwh);

  return {
    monthlyEnergyKwh,
    dailyEnergyKwh,
    electricCost,
    combustionCost,
    savings: combustionCost - electricCost,
    electricCostPerKm: distance > 0 ? electricCost / distance : 0,
    combustionCostPerKm: distance > 0 ? combustionCost / distance : 0,
    charger: { id: chargerId, ...CHARGERS[chargerId] },
  };
}
