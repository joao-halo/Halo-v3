import { useMemo, useState } from "react";
import { Button, ButtonLink, Card, Grid, Overline, Slider, Text } from "../ui";
import { simulators } from "../../data/content";
import { waLink } from "../../data/site";
import {
  BILL_DEFAULT,
  BILL_MAX,
  BILL_MIN,
  BILL_STEP,
  calculateSavings,
  type ConsumerProfile,
} from "../../lib/calc";
import { formatCurrency, formatKwp } from "../../lib/format";
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
    tone === "primary" ? "text-primary" : tone === "secondary" ? "text-secondary" : "text-accent-on-light";

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

/** 9a. Simulador de economia com geração solar. */
export function SavingsSimulator() {
  const [bill, setBill] = useState(BILL_DEFAULT);
  const [profile, setProfile] = useState<ConsumerProfile>("residential");

  const result = useMemo(() => calculateSavings({ bill, profile }), [bill, profile]);

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
            className="mt-4"
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

        <div className="mt-7">
          <Overline as="div" id="savings-profile-label">
            {content.profileLabel}
          </Overline>
          <div
            role="group"
            aria-labelledby="savings-profile-label"
            className="flex flex-wrap gap-3 mt-3"
          >
            {content.profiles.map((option) => {
              const selected = option.id === profile;
              return (
                <Button
                  key={option.id}
                  size="sm"
                  variant={selected ? "solid" : "outline"}
                  aria-pressed={selected}
                  onClick={() => setProfile(option.id as ConsumerProfile)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card padding="lg" interactive={false}>
        <Grid cols="halves">
          <AnimatedStat
            value={result.monthly}
            label={content.results[0].label}
            format={formatCurrency}
            tone="primary"
          />
          <AnimatedStat
            value={result.yearly}
            label={content.results[1].label}
            format={formatCurrency}
            tone="secondary"
          />
          <AnimatedStat
            value={result.horizon}
            label={content.results[2].label}
            format={formatCurrency}
            tone="accent"
          />
          <AnimatedStat
            value={result.powerKwp}
            label={content.results[3].label}
            format={formatKwp}
            tone="primary"
          />
        </Grid>

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
