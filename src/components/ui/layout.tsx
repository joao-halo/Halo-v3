import * as React from "react";
import { cn } from "../../lib/cn";
import { Heading, Overline, Text } from "./typography";

/**
 * Layout — 01-fundamentos/espacamento-e-layout.md
 * Grade de 12 colunas, gutter 24px, container 1200px.
 * Seções com 80px de respiro vertical (medido no showcase).
 */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `wrap` = 1120px do showcase · `max` = 1200px da grade documentada. */
  width?: "wrap" | "max";
}

export function Container({ width = "wrap", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        width === "wrap" ? "max-w-wrap" : "max-w-container",
        className,
      )}
      {...props}
    />
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Fundo da faixa. `dark` usa o charcoal do template. */
  tone?: "default" | "subtle" | "dark";
  /** Fio de 1px separando das seções vizinhas (padrão do showcase). */
  divided?: boolean;
  as?: "section" | "div" | "footer" | "header";
}

export function Section({ tone = "default", divided = false, as: Tag = "section", className, ...props }: SectionProps) {
  return (
    <Tag
      className={cn(
        "py-section-rhythm",
        tone === "default" && "bg-canvas",
        tone === "subtle" && "bg-canvas-subtle",
        tone === "dark" && "on-inverted bg-surface-dark text-ink-inverse",
        divided && tone !== "dark" && "border-b border-line",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Grades recorrentes do template (§2):
 *  halves  → meio a meio (6 + 6)
 *  thirds  → 3 cards (estatísticas, features, equipe)
 *  quarters→ 4 cards (ícones de serviço)
 * Todas colapsam para 1 coluna na quebra de 780px.
 */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: "halves" | "thirds" | "quarters";
}

const GRID: Record<NonNullable<GridProps["cols"]>, string> = {
  halves: "grid-cols-1 md:grid-cols-2",
  thirds: "grid-cols-1 md:grid-cols-3",
  quarters: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({ cols = "thirds", className, ...props }: GridProps) {
  return <div className={cn("grid gap-gutter", GRID[cols], className)} {...props} />;
}

/**
 * Cabeçalho de seção no padrão "Overline + Título + Descrição"
 * (tipografia.md §3). Descrição limitada a 62ch e em neutro 500.
 */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Nível visual do título. */
  level?: "display" | "h1" | "h2" | "h3";
  /** Em bloco escuro: overline em ouro e texto claro. */
  tone?: "default" | "inverse";
}

export function SectionHeader({
  overline,
  title,
  description,
  level = "h2",
  tone = "default",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-7", className)} {...props}>
      {overline && <Overline tone={tone === "inverse" ? "accent" : "primary"}>{overline}</Overline>}
      <Heading level={level} className={cn("mt-2 mb-2", tone === "inverse" && "text-ink-inverse")}>
        {title}
      </Heading>
      {description && (
        <Text measure tone={tone === "inverse" ? "inverse" : "muted"} className={tone === "inverse" ? "text-ink-inverse-muted" : undefined}>
          {description}
        </Text>
      )}
    </div>
  );
}
