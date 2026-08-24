import { describe, expect, it } from "vitest";
import {
  ANNUAL_ADJUSTMENT,
  BILL_DEFAULT,
  BILL_MAX,
  BILL_MIN,
  CHARGER_THRESHOLDS,
  COMPENSATION_RATES,
  DAYS_PER_MONTH,
  DISTANCE_MAX,
  DISTANCE_MIN,
  HORIZON_YEARS,
  REFERENCE_TARIFF,
  SPECIFIC_YIELD,
  calculateEv,
  calculateSavings,
  clampBill,
  clampDistance,
  geometricSum,
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

  it("devolve o mínimo para entrada não numérica", () => {
    expect(clampBill(Number.NaN)).toBe(BILL_MIN);
    expect(clampBill(Number.POSITIVE_INFINITY)).toBe(BILL_MAX);
  });
});

describe("geometricSum", () => {
  it("soma uma progressão geométrica de duas parcelas", () => {
    // 100 + 108 = 208
    expect(geometricSum(100, 0.08, 2)).toBeCloseTo(208, 6);
  });

  it("vira soma simples quando a razão é zero", () => {
    expect(geometricSum(100, 0, 5)).toBe(500);
  });

  it("é zero para horizonte não positivo", () => {
    expect(geometricSum(100, 0.08, 0)).toBe(0);
    expect(geometricSum(100, 0.08, -3)).toBe(0);
  });
});

describe("calculateSavings", () => {
  it("aplica a taxa de compensação de cada perfil", () => {
    const bill = 1_000;
    expect(calculateSavings({ bill, profile: "residential" }).monthly).toBeCloseTo(800, 6);
    expect(calculateSavings({ bill, profile: "commercial" }).monthly).toBeCloseTo(750, 6);
    expect(calculateSavings({ bill, profile: "industrial" }).monthly).toBeCloseTo(700, 6);
  });

  it("deriva a economia anual da mensal", () => {
    const result = calculateSavings({ bill: 800, profile: "residential" });
    expect(result.yearly).toBeCloseTo(result.monthly * 12, 6);
  });

  it("acumula 25 anos com reajuste composto de 8%", () => {
    const result = calculateSavings({ bill: 800, profile: "residential" });
    const expected =
      (result.yearly * (Math.pow(1 + ANNUAL_ADJUSTMENT, HORIZON_YEARS) - 1)) / ANNUAL_ADJUSTMENT;
    expect(result.horizon).toBeCloseTo(expected, 6);
  });

  it("o horizonte de 25 anos supera a soma sem reajuste", () => {
    const result = calculateSavings({ bill: 800, profile: "residential" });
    expect(result.horizon).toBeGreaterThan(result.yearly * HORIZON_YEARS);
  });

  it("estima a potência pela tarifa e pela geração específica de referência", () => {
    const bill = 950; // 1.000 kWh/mês na tarifa de referência
    const result = calculateSavings({ bill, profile: "residential" });
    expect(result.monthlyKwh).toBeCloseTo(bill / REFERENCE_TARIFF, 6);
    expect(result.powerKwp).toBeCloseTo(
      bill / REFERENCE_TARIFF / (SPECIFIC_YIELD * DAYS_PER_MONTH),
      6,
    );
  });

  it("cresce de forma monotônica com a conta", () => {
    const low = calculateSavings({ bill: BILL_MIN, profile: "residential" });
    const high = calculateSavings({ bill: BILL_MAX, profile: "residential" });
    expect(high.monthly).toBeGreaterThan(low.monthly);
    expect(high.powerKwp).toBeGreaterThan(low.powerKwp);
  });

  it("trava nos extremos do slider", () => {
    const belowMin = calculateSavings({ bill: 0, profile: "residential" });
    const atMin = calculateSavings({ bill: BILL_MIN, profile: "residential" });
    expect(belowMin).toEqual(atMin);

    const aboveMax = calculateSavings({ bill: 99_999, profile: "industrial" });
    const atMax = calculateSavings({ bill: BILL_MAX, profile: "industrial" });
    expect(aboveMax).toEqual(atMax);
  });

  it("no máximo residencial devolve os valores esperados", () => {
    const result = calculateSavings({ bill: BILL_MAX, profile: "residential" });
    expect(result.monthly).toBeCloseTo(BILL_MAX * COMPENSATION_RATES.residential, 6);
    expect(result.yearly).toBeCloseTo(BILL_MAX * COMPENSATION_RATES.residential * 12, 6);
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
  it("recomenda 7,4 kW até o limite baixo, inclusive", () => {
    expect(recommendCharger(0)).toBe("ac-7.4");
    expect(recommendCharger(CHARGER_THRESHOLDS.low)).toBe("ac-7.4");
  });

  it("recomenda 11 kW na faixa intermediária, inclusive o limite", () => {
    expect(recommendCharger(CHARGER_THRESHOLDS.low + 0.1)).toBe("ac-11");
    expect(recommendCharger(CHARGER_THRESHOLDS.medium)).toBe("ac-11");
  });

  it("recomenda 22 kW ou DC acima do limite intermediário", () => {
    expect(recommendCharger(CHARGER_THRESHOLDS.medium + 0.1)).toBe("ac-22-or-dc");
    expect(recommendCharger(100)).toBe("ac-22-or-dc");
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

  it("no mínimo do slider recomenda o carregador de 7,4 kW", () => {
    const result = calculateEv({ ...base, distanceKm: DISTANCE_MIN, consumptionKwh100: 14 });
    // 200 km × 14 / 100 = 28 kWh/mês ≈ 0,93 kWh/dia
    expect(result.dailyEnergyKwh).toBeLessThan(CHARGER_THRESHOLDS.low);
    expect(result.charger.id).toBe("ac-7.4");
  });

  it("no máximo do slider com picape recomenda 22 kW ou DC", () => {
    const result = calculateEv({ ...base, distanceKm: DISTANCE_MAX, consumptionKwh100: 24 });
    // 4.000 km × 24 / 100 = 960 kWh/mês = 32 kWh/dia
    expect(result.dailyEnergyKwh).toBeCloseTo(32, 6);
    expect(result.charger.id).toBe("ac-22-or-dc");
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
