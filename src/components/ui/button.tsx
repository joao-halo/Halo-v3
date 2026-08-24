import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Botão — 02-componentes/botoes.md
 *
 * Pílula (--radius-full), Outfit semibold, borda de 2px transparente
 * para que o contorno não desloque o layout entre variantes.
 *
 * Estados (§3):
 *  hover    → escurece um tom + shadow-md
 *  active   → sem sombra, desloca 1px para baixo
 *  focus    → outline 2px blue-400, offset 2px
 *  disabled → opacidade 45%, cursor not-allowed
 *
 * Acessibilidade: no botão `accent` (ouro) o texto é SEMPRE escuro.
 */

export type ButtonVariant =
  | "primary"    // gradiente esmeralda — 1 por tela
  | "solid"      // verde 500
  | "secondary"  // azul 500
  | "accent"     // ouro 500 + texto neutro 900
  | "outline"    // borda verde, texto verde 700
  | "ghost";     // transparente, texto verde 700

export type ButtonSize = "sm" | "md" | "lg";

/**
 * A borda de 2px existe em todas as variantes (transparente nas sólidas) para
 * que trocar de variante não desloque o layout. A cor da borda é declarada
 * aqui, e não na base: `border-transparent` na base venceria
 * `border-green-500` da variante `outline` na cascata do Tailwind, deixando o
 * contorno invisível.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-gradient-emerald-cta text-ink-on-brand hover:brightness-dim hover:shadow-md",
  solid:
    "border-transparent bg-primary text-ink-on-brand hover:bg-primary-hover hover:shadow-md",
  secondary:
    "border-transparent bg-secondary text-ink-on-brand hover:bg-secondary-hover hover:shadow-md",
  accent:
    "border-transparent bg-accent text-ink-on-accent hover:bg-accent-hover hover:shadow-md",
  outline:
    "bg-transparent border-green-500 text-green-700 hover:bg-primary-soft hover:shadow-md",
  ghost:
    "border-transparent bg-transparent text-green-700 hover:bg-primary-soft",
};

/** Alturas e paddings da tabela §2 (sm 32 · md 44 · lg 56). */
const SIZES: Record<ButtonSize, string> = {
  sm: "h-[var(--btn-height-sm)] px-4 py-2 text-sm",
  md: "h-[var(--btn-height-md)] px-5 py-3 text-base",
  lg: "h-[var(--btn-height-lg)] px-6 py-4 text-lg",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa toda a largura disponível. */
  block?: boolean;
  /** Ícone antes do rótulo. */
  iconLeft?: React.ReactNode;
  /** Ícone depois do rótulo (seta de CTA, etc.). */
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", block, iconLeft, iconRight, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "font-brand font-semibold leading-none",
        "rounded-full border-btn cursor-pointer",
        "transition-all duration-halo ease-halo",
        "active:translate-y-px active:shadow-none",
        "disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none disabled:brightness-100 disabled:translate-y-0",
        SIZES[size],
        VARIANTS[variant],
        block && "w-full",
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
});

/** Mesma aparência do Button, para navegação (<a>). */
export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant = "primary", size = "md", block, iconLeft, iconRight, className, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap no-underline",
        "font-brand font-semibold leading-none",
        "rounded-full border-btn cursor-pointer",
        "transition-all duration-halo ease-halo",
        "active:translate-y-px active:shadow-none",
        SIZES[size],
        VARIANTS[variant],
        block && "w-full",
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </a>
  );
});
