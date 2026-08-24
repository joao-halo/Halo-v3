import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Tipografia — 01-fundamentos/tipografia.md
 * Fraunces (serif) nos títulos · Outfit (sans) no corpo e rótulos.
 */

/**
 * Overline — o rótulo MAIÚSCULO espaçado que antecede o título.
 * "A marca registrada do template" (§3). Outfit 600, 12px, 0.18em.
 * Cor: verde (padrão) ou ouro (sobre bloco escuro).
 */
export interface OverlineProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: "primary" | "accent" | "inverse";
  as?: "p" | "span" | "div";
}

export function Overline({ tone = "primary", as: Tag = "p", className, ...props }: OverlineProps) {
  return (
    <Tag
      className={cn(
        "font-brand text-overline font-semibold tracking-overline uppercase",
        tone === "primary" && "text-primary",
        tone === "accent" && "text-accent",
        tone === "inverse" && "text-ink-inverse",
        className,
      )}
      {...props}
    />
  );
}

export type HeadingLevel = "display" | "h1" | "h2" | "h3";

const HEADING: Record<HeadingLevel, string> = {
  display: "text-4xl font-bold",   // 56px / 700
  h1: "text-3xl font-bold",        // 40px / 700
  h2: "text-2xl font-semibold",    // 32px / 600
  h3: "text-xl font-semibold",     // 24px / 600
};

const DEFAULT_TAG: Record<HeadingLevel, "h1" | "h2" | "h3"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Nível visual da escala tipográfica. */
  level?: HeadingLevel;
  /** Tag semântica, quando diferente do nível visual (1 H1 por tela). */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export function Heading({ level = "h2", as, className, ...props }: HeadingProps) {
  const Tag = (as ?? DEFAULT_TAG[level]) as React.ElementType;
  return (
    <Tag
      className={cn("font-display [font-optical-sizing:auto]", HEADING[level], className)}
      {...props}
    />
  );
}

export type TextSize = "lg" | "base" | "sm" | "caption";

const TEXT: Record<TextSize, string> = {
  lg: "text-lg",       // 18px — texto de abertura
  base: "text-base",   // 16px — padrão
  sm: "text-sm",       // 14px — legendas, notas
  caption: "text-caption", // 12px — rodapés, créditos
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  tone?: "default" | "muted" | "inverse";
  /** Limita a 60–80 caracteres por linha (§6). */
  measure?: boolean;
  as?: "p" | "span" | "div" | "li";
}

export function Text({ size = "base", tone = "default", measure, as = "p", className, ...props }: TextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        "font-body leading-normal",
        TEXT[size],
        tone === "muted" && "text-ink-muted",
        tone === "inverse" && "text-ink-inverse",
        measure && "max-w-measure",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Fio — a linha-régua de 1px do template (espacamento-e-layout.md §5.3).
 * 64px, neutro 300 ou ouro.
 */
export interface RuleProps extends React.HTMLAttributes<HTMLHRElement> {
  tone?: "line" | "accent" | "inverse";
  /** `short` = 64px de marca · `full` = largura do contêiner. */
  width?: "short" | "full";
}

export function Rule({ tone = "line", width = "short", className, ...props }: RuleProps) {
  return (
    <hr
      className={cn(
        "h-px border-0 my-[var(--rule-gap)]",
        width === "short" ? "w-rule" : "w-full",
        tone === "line" && "bg-line-strong",
        tone === "accent" && "bg-accent",
        tone === "inverse" && "bg-ink-inverse/90",
        className,
      )}
      {...props}
    />
  );
}
