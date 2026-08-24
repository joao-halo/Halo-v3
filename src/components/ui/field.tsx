import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Rótulo, dica e mensagem de erro de um campo de formulário.
 * [EXT] O design system não cobre formulários; ver "Lacunas".
 * Rótulo em Outfit 500 (o peso de "rótulos de UI" da tipografia §4).
 */
export interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "inverse";
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
  tone = "default",
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "font-body text-sm font-medium",
          tone === "inverse" ? "text-ink-inverse" : "text-neutral-700",
        )}
      >
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={hintId} className="font-body text-sm text-ink-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="font-body text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Ids de `aria-describedby` coerentes com o que o Field renderiza. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}
