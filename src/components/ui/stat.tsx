import * as React from "react";
import { cn } from "../../lib/cn";
import { Card } from "./card";
import { Text } from "./typography";

/**
 * Bloco de estatística — 02-componentes/cards-e-blocos.md §2
 * Número-herói em Fraunces 700 (--text-3xl), rótulo MAIÚSCULO em ouro.
 * Use em trios, variando a cor do número: verde · azul · ouro.
 */
export type StatTone = "primary" | "secondary" | "accent";

const TONE: Record<StatTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  tone?: StatTone;
  /** Envolve em Card (padrão do showcase) ou renderiza solto. */
  bare?: boolean;
}

export function Stat({ value, label, description, tone = "primary", bare, className, ...props }: StatProps) {
  const body = (
    <>
      <span className={cn("block font-display font-bold text-3xl leading-none", TONE[tone])}>{value}</span>
      <span className="block font-brand text-overline font-semibold tracking-overline uppercase text-accent-on-light mt-3 mb-2">
        {label}
      </span>
      {description && <Text size="sm" tone="muted">{description}</Text>}
    </>
  );

  if (bare) {
    return <div className={cn(className)} {...props}>{body}</div>;
  }
  return <Card className={className} {...props}>{body}</Card>;
}
