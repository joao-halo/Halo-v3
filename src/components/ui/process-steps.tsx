import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Linha de processo — 02-componentes/cards-e-blocos.md §6
 * Sequência 01 → 02 → 03: número em Fraunces 700 (verde 200),
 * seta em ouro, título em verde 700. Máximo de 3–5 etapas.
 */
export interface ProcessStep {
  /** Se omitido, é gerado a partir da posição: 01, 02, 03… */
  number?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface ProcessStepsProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: ProcessStep[];
  /**
   * Nível semântico do título de cada etapa. O showcase usa `h4`, mas o nível
   * certo depende de onde o componente é usado: dentro de uma seção cujo título
   * é `h2`, pular para `h4` abre um buraco na hierarquia. O estilo visual é o
   * mesmo em qualquer nível.
   */
  headingLevel?: "h3" | "h4" | "h5";
}

export function ProcessSteps({ steps, headingLevel = "h3", className, ...props }: ProcessStepsProps) {
  const Heading = headingLevel as React.ElementType;
  return (
    <ol className={cn("flex flex-col md:flex-row md:flex-wrap items-stretch list-none m-0 p-0", className)} {...props}>
      {steps.map((step, i) => (
        <li key={i} className="relative flex-1 min-w-[var(--step-min-width)] p-5">
          <div aria-hidden className="font-display font-bold text-[length:var(--text-step-number)] leading-none text-step">
            {step.number ?? String(i + 1).padStart(2, "0")}
          </div>
          <Heading className="font-display font-semibold text-[length:var(--text-step-title)] text-green-700 mt-2 mb-2">
            {step.title}
          </Heading>
          {step.description && <p className="font-body text-sm text-ink-muted">{step.description}</p>}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="hidden md:inline absolute -right-2 top-[var(--step-arrow-top)] text-accent-on-light text-[length:var(--text-step-arrow)] font-bold leading-none"
            >
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
