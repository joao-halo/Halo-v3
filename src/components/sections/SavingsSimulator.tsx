import { useMemo, useState } from "react";
import { ButtonLink, Card, Field, Grid, Input, Slider, Text } from "../ui";
import { simulators } from "../../data/content";
import { waLink } from "../../data/site";
import {
  BILL_DEFAULT,
  BILL_MAX,
  BILL_MIN,
  BILL_STEP,
  PAYBACK_MAX_YEARS,
  PAYBACK_MIN_YEARS,
  TARIFF_DEFAULT,
  calculateSavings,
} from "../../lib/calc";
import { formatCurrency, formatDecimal, formatKwp } from "../../lib/format";
import { useCountUp } from "../../hooks/useCountUp";

const content = simulators.savings;

/** Um número-herói com contagem crescente. */
function AnimatedStat({
  value,
  label,
  format,
  tone,
}: {
  value: number;
  label: string;
  format: (value: number) => string;
  tone: "primary" | "secondary" | "accent";
}) {
  const animated = useCountUp(value);
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "secondary"
        ? "text-secondary"
        : "text-accent-on-light";

  return (
    <div>
      <span
        className={`block font-display font-bold text-3xl leading-none ${toneClass}`}
        aria-live="polite"
      >
        {format(animated)}
      </span>
      <span className="block font-brand text-overline font-semibold tracking-overline uppercase text-accent-on-light mt-3">
        {label}
      </span>
    </div>
  );
}

/** Indicador de valor fixo — não conta, porque não é número calculado. */
function StaticStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <span className="block font-display font-bold text-3xl leading-none text-secondary">
        {value}
      </span>
      <span className="block font-brand text-overline font-semibold tracking-overline uppercase text-accent-on-light mt-3">
        {label}
      </span>
    </div>
  );
}

/** 9a. Simulador de economia com geração solar. */
export function SavingsSimulator() {
  const [bill, setBill] = useState(BILL_DEFAULT);
  const [tariff, setTariff] = useState(TARIFF_DEFAULT);

  const result = useMemo(() => calculateSavings({ bill, tariff }), [bill, tariff]);

  // inteiro sai sem casa decimal: "2,5 a 3 anos", não "2,5 a 3,0 anos"
  const anos = (n: number) => (Number.isInteger(n) ? String(n) : formatDecimal(n));
  const paybackRange = `${anos(PAYBACK_MIN_YEARS)} a ${anos(PAYBACK_MAX_YEARS)}`;

  return (
    <div className="grid gap-gutter lg:grid-cols-2 items-start">
      <Card padding="lg" interactive={false}>
        <h3 className="font-display font-semibold text-xl">{content.title}</h3>

        <div className="mt-6">
          <label htmlFor="savings-bill" className="font-body text-sm font-medium text-neutral-700">
            {content.billLabel}
          </label>
          <p className="font-display font-bold text-2xl text-primary mt-2">
            {formatCurrency(bill)}
          </p>
          <Slider
            id="savings-bill"
            className="halo-slider--heat mt-4"
            value={bill}
            min={BILL_MIN}
            max={BILL_MAX}
            step={BILL_STEP}
            aria-label={content.billLabel}
            valueText={formatCurrency(bill)}
            onChange={(event) => setBill(Number(event.target.value))}
          />
          <div className="flex justify-between mt-2">
            <span className="font-body text-caption text-ink-muted">{formatCurrency(BILL_MIN)}</span>
            <span className="font-body text-caption text-ink-muted">{formatCurrency(BILL_MAX)}</span>
          </div>
          <Text size="sm" tone="muted" className="mt-3">
            {content.billHint}
          </Text>
        </div>

        <Field
          id="savings-tariff"
          label={content.tariffLabel}
          hint={content.tariffHint}
          className="mt-7"
        >
          <Input
            id="savings-tariff"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={tariff}
            onChange={(event) => setTariff(Number(event.target.value))}
          />
        </Field>
      </Card>

      <Card padding="lg" interactive={false}>
        <Grid cols="halves">
          <AnimatedStat
            value={result.monthly}
            label={content.results.monthly}
            format={formatCurrency}
            tone="primary"
          />
          <StaticStat value={`${paybackRange} anos`} label={content.results.payback} />
          <AnimatedStat
            value={result.powerKwp}
            label={content.results.power}
            format={formatKwp}
            tone="primary"
          />
          <AnimatedStat
            value={result.projectValue}
            label={content.results.projectValue}
            format={formatCurrency}
            tone="accent"
          />
        </Grid>

        <div className="mt-7 border-l-btn border-secondary bg-secondary-soft rounded-sm p-4">
          <Text size="sm" className="text-blue-800">
            {content.notice}
          </Text>
        </div>

        <ButtonLink
          variant="primary"
          size="md"
          block
          href={waLink(content.cta.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5"
        >
          {content.cta.label}
        </ButtonLink>
      </Card>
    </div>
  );
}
