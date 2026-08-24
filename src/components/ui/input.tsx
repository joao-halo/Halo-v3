import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Campos de formulário — [EXT] registrada em DESIGN-TOKENS.md.
 * Altura igual à do botão md, raio `sm` (o raio que o design system
 * destina a "inputs, tags"), borda neutro 300, foco em verde 500.
 */

const BASE = cn(
  "w-full font-body text-base text-ink",
  "bg-[var(--input-bg)] border border-[var(--input-border)] rounded-sm",
  "px-4 transition-colors duration-halo ease-halo",
  "placeholder:text-[var(--input-placeholder)]",
  "hover:border-line-strong",
  "focus:border-[var(--input-border-focus)]",
  "disabled:bg-[var(--input-bg-disabled)] disabled:cursor-not-allowed disabled:opacity-45",
  "aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-soft",
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input ref={ref} className={cn(BASE, "h-[var(--input-height-md)]", className)} {...props} />
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cn(BASE, "py-3 leading-normal", className)} {...props} />;
});

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(BASE, "h-[var(--input-height-md)] cursor-pointer appearance-none", className)}
      {...props}
    >
      {children}
    </select>
  );
});
