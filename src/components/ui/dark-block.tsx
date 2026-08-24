import * as React from "react";
import { cn } from "../../lib/cn";
import { Heading, Overline, Text } from "./typography";

/**
 * Bloco escuro — 02-componentes/cards-e-blocos.md §5
 * A "caixa charcoal" do template: cria ritmo e destaca chamadas.
 * `solid` = neutro 800 (documentado) · `gradient` = grafite → verde
 * escuro (variação premium, usada no showcase).
 * O overline dentro do bloco é SEMPRE ouro.
 */
export interface DarkBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  surface?: "solid" | "gradient";
  overline?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** CTA(s) ao pé do bloco. */
  actions?: React.ReactNode;
}

export function DarkBlock({
  surface = "gradient",
  overline,
  title,
  description,
  actions,
  className,
  children,
  ...props
}: DarkBlockProps) {
  return (
    <div
      className={cn(
        "p-7 rounded-lg text-ink-inverse",
        surface === "solid" ? "bg-surface-dark" : "bg-gradient-dark",
        className,
      )}
      {...props}
    >
      {overline && <Overline tone="accent">{overline}</Overline>}
      {title && <Heading level="h2" className="text-[length:var(--text-block-title)] mt-2 mb-2 text-ink-inverse">{title}</Heading>}
      {description && (
        <Text className="max-w-measure-narrow text-ink-inverse-muted">{description}</Text>
      )}
      {children}
      {actions && <div className="mt-5 flex flex-wrap gap-4">{actions}</div>}
    </div>
  );
}
