import * as React from "react";
import { cn } from "../../lib/cn";
import { Card } from "./card";
import { Heading, Text } from "./typography";

/**
 * Bloco de feature — 02-componentes/cards-e-blocos.md §4
 * Ícone em círculo de 64px + título + texto curto.
 * Variação `gradient`: fundo esmeralda e ícone branco (destaque).
 */
export interface FeatureIconProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "soft" | "gradient";
}

export function FeatureIcon({ tone = "soft", className, ...props }: FeatureIconProps) {
  return (
    <div
      className={cn(
        "w-[var(--icon-circle-size)] h-[var(--icon-circle-size)] grid place-items-center rounded-full",
        tone === "soft" ? "bg-primary-soft text-primary" : "bg-gradient-emerald text-ink-on-brand",
        className,
      )}
      {...props}
    />
  );
}

export interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  iconTone?: "soft" | "gradient";
  /** Link/CTA no fim da anatomia do card. */
  footer?: React.ReactNode;
}

export function FeatureCard({ icon, title, description, iconTone = "soft", footer, className, children, ...props }: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      {icon && <FeatureIcon tone={iconTone} className="mb-[var(--icon-circle-gap)]">{icon}</FeatureIcon>}
      <Heading level="h3" as="h3" className="text-[length:var(--text-card-title)] mb-2">{title}</Heading>
      {description && <Text size="sm" tone="muted" className="text-[length:var(--text-card-body)]">{description}</Text>}
      {children}
      {footer && <div className="mt-5">{footer}</div>}
    </Card>
  );
}
