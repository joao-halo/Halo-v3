import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Badge / tag — [EXT] registrada em DESIGN-TOKENS.md.
 * Pílula de 24px, rótulo em Outfit 600 com tracking `wide`.
 * Usa os pares soft/forte já existentes na paleta.
 */
export type BadgeTone = "primary" | "secondary" | "accent" | "neutral" | "inverse";

const TONES: Record<BadgeTone, string> = {
  primary: "bg-primary-soft text-green-700",
  secondary: "bg-secondary-soft text-blue-700",
  accent: "bg-accent-soft text-gold-900",
  neutral: "bg-canvas-subtle text-ink-muted",
  inverse: "bg-ink-inverse/10 text-ink-inverse",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-[var(--badge-height)] px-3 rounded-full",
        "font-brand text-caption font-semibold tracking-wide uppercase",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
