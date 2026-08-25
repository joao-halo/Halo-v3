import { describe, expect, it } from "vitest";
import {
  BILL_DEFAULT,
  BILL_MAX,
  BILL_MIN,
  CHARGER_THRESHOLDS,
  COMPENSATION_RATE,
  DAYS_PER_MONTH,
  DISTANCE_MAX,
  DISTANCE_MIN,
  PRICE_PER_WP,
  SPECIFIC_YIELD,
  TARIFF_DEFAULT,
  TARIFF_MAX,
  TARIFF_MIN,
  calculateEv,
  calculateSavings,
  clampBill,
  clampDistance,
  clampTariff,
  recommendCharger,
} from "./calc";

/* ============================================================
   Simulador A — economia com geração solar
   ============================================================ */

describe("clampBill", () => {
  it("mantém valores dentro da faixa", () => {
    expect(clampBill(BILL_DEFAULT)).toBe(BILL_DEFAULT);
  });

  it("trava no mínimo do slider", () => {
    expect(clampBill(0)).toBe(BILL_MIN);
    expect(clampBill(-500)).toBe(BILL_MIN);
    expect(clampBill(BILL_MIN - 1)).toBe(BILL_MIN);
  });

  it("trava no máximo do slider", () => {
    expect(clampBill(BILL_MAX + 1)).toBe(BILL_MAX);
    expect(clampBill(1_000_000)).toBe(BILL_MAX);
  });

  it("devolve o mínimo para entrada não numérica e satura no infinito", () => {
    expect(clampBill(Number.NaN)).toBe(BILL_MIN);
    expect(clampBill(Number.POSITIVE_INFINITY)).toBe(BILL_MAX);
    expect(clampBill(Number.NEGATIVE_INFINITY)).toBe(BILL_MIN);
  });
});

describe("clampTariff", () => {
  it("mantém a tarifa informada dentro da faixa", () => {
    expect(clampTariff(TARIFF_DEFAULT)).toBe(TARIFF_DEFAULT);
    expect(clampTariff(1.4)).toBe(1.4);
  });

  it("trava nos extremos", () => {
    expect(clampTariff(0)).toBe(TARIFF_MIN);
    expect(clampTariff(99)).toBe(TARIFF_MAX);
  });

  it("cai no padrão quando a entrada não é numérica", () => {
    expect(clampTariff(Number.NaN)).toBe(TARIFF_DEFAULT);
  });
});

describe("calculateSavings", () => {
  it("aplica a taxa única de compensação sobre a conta", () => {
    const r = calculateSavings({ bill: 1_000, tariff: TARIFF_DEFAULT });
    expect(r.monthly).toBeCloseTo(1_000 * COMPENSATION_RATE, 6);
  });

  it("converte a conta em consumo pela tarifa informada", () => {
    const r = calculateSavings({ bill: 950, tariff: 0.95 });
    expect(r.monthlyKwh).toBeCloseTo(1_000, 6);
  });

  it("estima a potência pela geração específica de referência", () => {
    const r = calculateSavings({ bill: 800, tariff: TARIFF_DEFAULT });
    expect(r.powerKwp).toBeCloseTo(
      800 / TARIFF_DEFAULT / (SPECIFIC_YIELD * DAYS_PER_MONTH),
      6,
    );
  });

  it("calcula o valor do projeto a R$/Wp sobre a potência", () => {
    const r = calculateSavings({ bill: 800, tariff: TARIFF_DEFAULT });
    expect(r.projectValue).toBeCloseTo(PRICE_PER_WP * 1_000 * r.powerKwp, 6);
  });

  it("o valor do projeto fica em ordem de grandeza de milhares de reais", () => {
    const r = calculateSavings({ bill: BILL_DEFAULT, tariff: TARIFF_DEFAULT });
    expect(r.projectValue).toBeGreaterThan(5_000);
    expect(r.projectValue).toBeLessThan(50_000);
  });

  it("tarifa menor implica sistema maior para a mesma conta", () => {
    const barata = calculateSavings({ bill: 800, tariff: 0.6 });
    const cara = calculateSavings({ bill: 800, tariff: 1.2 });
    expect(barata.powerKwp).toBeGreaterThan(cara.powerKwp);
    expect(barata.projectValue).toBeGreaterThan(cara.projectValue);
  });

  it("a economia mensal não depende da tarifa, só da conta", () => {
    const a = calculateSavings({ bill: 800, tariff: 0.6 });
    const b = calculateSavings({ bill: 800, tariff: 1.2 });
    expect(a.monthly).toBeCloseTo(b.monthly, 6);
  });

  it("cresce de forma monotônica com a conta", () => {
    const baixa = calculateSavings({ bill: BILL_MIN, tariff: TARIFF_DEFAULT });
    const alta = calculateSavings({ bill: BILL_MAX, tariff: TARIFF_DEFAULT });
    expect(alta.monthly).toBeGreaterThan(baixa.monthly);
    expect(alta.powerKwp).toBeGreaterThan(baixa.powerKwp);
    expect(alta.projectValue).toBeGreaterThan(baixa.projectValue);
  });

  it("trava nos extremos do slider", () => {
    expect(calculateSavings({ bill: 0, tariff: TARIFF_DEFAULT })).toEqual(
      calculateSavings({ bill: BILL_MIN, tariff: TARIFF_DEFAULT }),
    );
    expect(calculateSavings({ bill: 99_999, tariff: TARIFF_DEFAULT })).toEqual(
      calculateSavings({ bill: BILL_MAX, tariff: TARIFF_DEFAULT }),
    );
  });

  it("trava a tarifa fora de faixa em vez de estourar a potência", () => {
    const zero = calculateSavings({ bill: 800, tariff: 0 });
    const minima = calculateSavings({ bill: 800, tariff: TARIFF_MIN });
    expect(zero).toEqual(minima);
    expect(Number.isFinite(zero.powerKwp)).toBe(true);
  });
});

/* ============================================================
   Simulador B — recarga de veículo elétrico
   ============================================================ */

describe("clampDistance", () => {
  it("trava nos extremos do slider", () => {
    expect(clampDistance(0)).toBe(DISTANCE_MIN);
    expect(clampDistance(DISTANCE_MAX + 1_000)).toBe(DISTANCE_MAX);
    expect(clampDistance(Number.NaN)).toBe(DISTANCE_MIN);
  });
});

describe("recommendCharger", () => {
  it("recomenda o wallbox de 7,4 kW até o limite baixo, inclusive", () => {
    expect(recommendCharger(0)).toBe("wallbox-7.4");
    expect(recommendCharger(CHARGER_THRESHOLDS.low)).toBe("wallbox-7.4");
  });

  it("recomenda o wallbox de 22 kW na faixa intermediária, inclusive o limite", () => {
    expect(recommendCharger(CHARGER_THRESHOLDS.low + 0.1)).toBe("wallbox-22");
    expect(recommendCharger(CHARGER_THRESHOLDS.medium)).toBe("wallbox-22");
  });

  it("recomenda carregador rápido acima do limite intermediário", () => {
    expect(recommendCharger(CHARGER_THRESHOLDS.medium + 0.1)).toBe("rapido");
    expect(recommendCharger(100)).toBe("rapido");
  });
});

describe("calculateEv", () => {
  const base = {
    distanceKm: 1_000,
    consumptionKwh100: 17,
    tariff: 0.95,
    fuelPrice: 6.2,
    fuelEfficiency: 11,
  };

  it("converte quilometragem em energia mensal e diária", () => {
    const result = calculateEv(base);
    expect(result.monthlyEnergyKwh).toBeCloseTo(170, 6); // 1000 × 17 / 100
    expect(result.dailyEnergyKwh).toBeCloseTo(170 / DAYS_PER_MONTH, 6);
  });

  it("calcula o custo elétrico pela tarifa", () => {
    const result = calculateEv(base);
    expect(result.electricCost).toBeCloseTo(170 * 0.95, 6);
  });

  it("calcula o custo de combustão pelo consumo em litros", () => {
    const result = calculateEv(base);
    expect(result.combustionCost).toBeCloseTo((1_000 / 11) * 6.2, 6);
  });

  it("a economia é a diferença entre combustão e elétrico", () => {
    const result = calculateEv(base);
    expect(result.savings).toBeCloseTo(result.combustionCost - result.electricCost, 6);
    expect(result.savings).toBeGreaterThan(0);
  });

  it("calcula o custo por quilômetro dos dois", () => {
    const result = calculateEv(base);
    expect(result.electricCostPerKm).toBeCloseTo(result.electricCost / 1_000, 6);
    expect(result.combustionCostPerKm).toBeCloseTo(result.combustionCost / 1_000, 6);
  });

  it("aceita economia negativa quando a tarifa é alta", () => {
    const result = calculateEv({ ...base, tariff: 5 });
    expect(result.savings).toBeLessThan(0);
  });

  it("não divide por zero quando a eficiência é inválida", () => {
    const result = calculateEv({ ...base, fuelEfficiency: 0 });
    expect(result.combustionCost).toBe(0);
    expect(Number.isFinite(result.combustionCostPerKm)).toBe(true);
  });

  it("no mínimo do slider recomenda o wallbox de 7,4 kW", () => {
    const result = calculateEv({ ...base, distanceKm: DISTANCE_MIN, consumptionKwh100: 14 });
    // 200 km × 14 / 100 = 28 kWh/mês ≈ 0,93 kWh/dia
    expect(result.dailyEnergyKwh).toBeLessThan(CHARGER_THRESHOLDS.low);
    expect(result.charger.id).toBe("wallbox-7.4");
  });

  it("no máximo do slider com picape recomenda carregador rápido", () => {
    const result = calculateEv({ ...base, distanceKm: DISTANCE_MAX, consumptionKwh100: 24 });
    // 4.000 km × 24 / 100 = 960 kWh/mês = 32 kWh/dia
    expect(result.dailyEnergyKwh).toBeCloseTo(32, 6);
    expect(result.charger.id).toBe("rapido");
  });

  it("trava a quilometragem fora da faixa do slider", () => {
    const below = calculateEv({ ...base, distanceKm: 10 });
    const atMin = calculateEv({ ...base, distanceKm: DISTANCE_MIN });
    expect(below).toEqual(atMin);

    const above = calculateEv({ ...base, distanceKm: 50_000 });
    const atMax = calculateEv({ ...base, distanceKm: DISTANCE_MAX });
    expect(above).toEqual(atMax);
  });

  it("cada tipo de veículo consome proporcionalmente ao seu perfil", () => {
    const compact = calculateEv({ ...base, consumptionKwh100: 14 });
    const pickup = calculateEv({ ...base, consumptionKwh100: 24 });
    expect(pickup.monthlyEnergyKwh / compact.monthlyEnergyKwh).toBeCloseTo(24 / 14, 6);
  });
});
