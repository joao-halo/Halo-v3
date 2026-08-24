import { useMemo, useState } from "react";
import { ButtonLink, Card, Field, Input, Select, Slider, Text } from "../ui";
import { simulators } from "../../data/content";
import { waLink } from "../../data/site";
import {
  DISTANCE_DEFAULT,
  DISTANCE_MAX,
  DISTANCE_MIN,
  DISTANCE_STEP,
  FUEL_EFFICIENCY_DEFAULT,
  FUEL_PRICE_DEFAULT,
  TARIFF_DEFAULT,
  calculateEv,
} from "../../lib/calc";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatKm,
  formatKwh,
} from "../../lib/format";

const content = simulators.ev;

/** Coluna de comparação: elétrico contra combustão. */
function CompareColumn({
  title,
  cost,
  perKm,
  perKmLabel,
  costLabel,
  highlight,
}: {
  title: string;
  cost: number;
  perKm: number;
  perKmLabel: string;
  costLabel: string;
  highlight: boolean;
}) {
  return (
    <div className={highlight ? "text-primary" : "text-ink"}>
      <span className="block font-brand text-overline font-semibold tracking-overline uppercase text-accent-on-light">
        {title}
      </span>
      <span className="block font-display font-bold text-3xl leading-none mt-3" aria-live="polite">
        {formatCurrency(cost)}
      </span>
      <Text size="sm" tone="muted" className="mt-2">
        {costLabel}
      </Text>
      <Text size="sm" tone="muted" className="mt-3">
        {perKmLabel}: {formatCurrencyPrecise(perKm)}
      </Text>
    </div>
  );
}

/** 9b. Simulador de recarga de veículo elétrico. */
export function EvSimulator() {
  const [distanceKm, setDistanceKm] = useState(DISTANCE_DEFAULT);
  const [vehicleId, setVehicleId] = useState(content.vehicles[1].id);
  const [tariff, setTariff] = useState(TARIFF_DEFAULT);
  const [fuelPrice, setFuelPrice] = useState(FUEL_PRICE_DEFAULT);
  const [fuelEfficiency, setFuelEfficiency] = useState(FUEL_EFFICIENCY_DEFAULT);

  const consumption =
    content.vehicles.find((vehicle) => vehicle.id === vehicleId)?.consumption ??
    content.vehicles[1].consumption;

  const result = useMemo(
    () =>
      calculateEv({
        distanceKm,
        consumptionKwh100: consumption,
        tariff,
        fuelPrice,
        fuelEfficiency,
      }),
    [distanceKm, consumption, tariff, fuelPrice, fuelEfficiency],
  );

  return (
    <div className="grid gap-gutter lg:grid-cols-2 items-start">
      <Card padding="lg" interactive={false}>
        <h3 className="font-display font-semibold text-xl">{content.title}</h3>

        <div className="mt-6">
          <label htmlFor="ev-distance" className="font-body text-sm font-medium text-neutral-700">
            {content.distanceLabel}
          </label>
          <p className="font-display font-bold text-2xl text-primary mt-2">
            {formatKm(distanceKm)}
          </p>
          <Slider
            id="ev-distance"
            className="mt-4"
            value={distanceKm}
            min={DISTANCE_MIN}
            max={DISTANCE_MAX}
            step={DISTANCE_STEP}
            aria-label={content.distanceLabel}
            valueText={formatKm(distanceKm)}
            onChange={(event) => setDistanceKm(Number(event.target.value))}
          />
          <div className="flex justify-between mt-2">
            <span className="font-body text-caption text-ink-muted">{formatKm(DISTANCE_MIN)}</span>
            <span className="font-body text-caption text-ink-muted">{formatKm(DISTANCE_MAX)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field id="ev-vehicle" label={content.vehicleLabel} className="sm:col-span-2">
            <Select
              id="ev-vehicle"
              value={vehicleId}
              onChange={(event) => setVehicleId(event.target.value as typeof vehicleId)}
            >
              {content.vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field id="ev-tariff" label={content.tariffLabel}>
            <Input
              id="ev-tariff"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.01}
              value={tariff}
              onChange={(event) => setTariff(Number(event.target.value))}
            />
          </Field>

          <Field id="ev-fuel-price" label={content.fuelPriceLabel}>
            <Input
              id="ev-fuel-price"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.01}
              value={fuelPrice}
              onChange={(event) => setFuelPrice(Number(event.target.value))}
            />
          </Field>

          <Field id="ev-efficiency" label={content.fuelEfficiencyLabel} className="sm:col-span-2">
            <Input
              id="ev-efficiency"
              type="number"
              inputMode="decimal"
              min={1}
              step={0.1}
              value={fuelEfficiency}
              onChange={(event) => setFuelEfficiency(Number(event.target.value))}
            />
          </Field>
        </div>
      </Card>

      <Card padding="lg" interactive={false}>
        <div className="grid gap-gutter sm:grid-cols-2">
          <CompareColumn
            title={content.electricLabel}
            cost={result.electricCost}
            perKm={result.electricCostPerKm}
            perKmLabel={content.perKmLabel}
            costLabel={content.costLabel}
            highlight
          />
          <CompareColumn
            title={content.combustionLabel}
            cost={result.combustionCost}
            perKm={result.combustionCostPerKm}
            perKmLabel={content.perKmLabel}
            costLabel={content.costLabel}
            highlight={false}
          />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 mt-7 pt-6 border-t border-line">
          <div>
            <dt className="font-body text-sm text-ink-muted">{content.savingsLabel}</dt>
            <dd className="font-display font-semibold text-xl text-primary m-0 mt-1">
              {formatCurrency(result.savings)}
            </dd>
          </div>
          <div>
            <dt className="font-body text-sm text-ink-muted">{content.energyLabel}</dt>
            <dd className="font-display font-semibold text-xl m-0 mt-1">
              {formatKwh(result.monthlyEnergyKwh)}
            </dd>
          </div>
          <div>
            <dt className="font-body text-sm text-ink-muted">{content.dailyEnergyLabel}</dt>
            <dd className="font-display font-semibold text-xl m-0 mt-1">
              {formatKwh(result.dailyEnergyKwh)}
            </dd>
          </div>
          <div>
            <dt className="font-body text-sm text-ink-muted">{content.chargerLabel}</dt>
            <dd className="font-display font-semibold text-xl text-secondary m-0 mt-1">
              {result.charger.label}
            </dd>
          </div>
        </dl>

        <Text size="sm" tone="muted" className="mt-4">
          {result.charger.detail}
        </Text>

        <ButtonLink
          variant="primary"
          size="md"
          block
          href={waLink(content.cta.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7"
        >
          {content.cta.label}
        </ButtonLink>
      </Card>
    </div>
  );
}
