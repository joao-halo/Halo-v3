import * as React from "react";
import { cn } from "../../lib/cn";
import { Text } from "./typography";

/**
 * Pilar numerado: `01` grande em Fraunces sobre um fio de topo, título e texto.
 *
 * É o mesmo padrão que `ProcessSteps` usa na horizontal, aqui em coluna, para
 * as listas de pilares e de escopo. Existia duplicado em Engineering.tsx e
 * Emobility.tsx antes da auditoria.
 *
 * O número é decorativo: repete a ordem que o documento já expressa, por isso
 * fica com `aria-hidden` e não é lido duas vezes.
 */
export interface NumberedItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  number: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** `inverse` para uso sobre superfície grafite. */
  tone?: "default" | "inverse";
  /** Tamanho do título: `xl` (24px) ou `md` (18px). */
  titleSize?: "xl" | "md";
}

export function NumberedItem({
  number,
  title,
  description,
  tone = "default",
  titleSize = "xl",
  className,
  ...props
}: NumberedItemProps) {
  const inverse = tone === "inverse";
  return (
    <article
      className={cn("border-t pt-5", inverse ? "border-ink-inverse/20" : "border-line", className)}
      {...props}
    >
      <p
        aria-hidden
        className={cn(
          "font-display font-bold text-[length:var(--text-step-number)] leading-none",
          inverse ? "text-accent" : "text-step",
        )}
      >
        {number}
      </p>
      <h3
        className={cn(
          "font-display font-semibold mt-4",
          titleSize === "xl" ? "text-xl" : "text-[length:var(--text-team-name)]",
          inverse && "text-ink-inverse",
        )}
      >
        {title}
      </h3>
      {description && (
        <Text
          size={titleSize === "xl" ? "base" : "sm"}
          tone={inverse ? undefined : "muted"}
          className={cn("mt-3", inverse && "text-ink-inverse-muted")}
        >
          {description}
        </Text>
      )}
    </article>
  );
}
