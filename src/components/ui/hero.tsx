import * as React from "react";
import { cn } from "../../lib/cn";
import { Container } from "./layout";

/**
 * Capa / Hero — 02-componentes/padroes-de-slide.md §1 + showcase
 *
 * Fundo grafite com dois halos radiais (azul no alto à direita, ouro
 * embaixo à esquerda), barra superior de rótulos, dois fios brancos de
 * 2px emoldurando o título e subtítulo em maiúsculas espaçadas.
 *
 * Com `image`, a foto entra em tela cheia sob o overlay grafite a 70%
 * (§1: "overlay grafite a ~70%").
 */
export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Rótulo à esquerda da barra superior. */
  eyebrowLeft?: React.ReactNode;
  /** Rótulo à direita da barra superior. */
  eyebrowRight?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** URL da imagem de fundo (urbana/industrial). */
  image?: string;
  actions?: React.ReactNode;
}

export function Hero({
  eyebrowLeft,
  eyebrowRight,
  title,
  subtitle,
  image,
  actions,
  className,
  children,
  ...props
}: HeroProps) {
  return (
    <header
      className={cn("relative overflow-hidden bg-surface-dark text-ink-inverse", className)}
      {...props}
    >
      {image && (
        <>
          <img src={image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-800/70" aria-hidden />
        </>
      )}
      <div aria-hidden className="absolute inset-0 bg-hero-halos" />
      <Container className="relative z-base py-9">
        {(eyebrowLeft || eyebrowRight) && (
          <div className="flex justify-between items-center font-brand text-caption tracking-topbar uppercase text-ink-inverse/70">
            <span>{eyebrowLeft}</span>
            <span>{eyebrowRight}</span>
          </div>
        )}
        <div className="h-[var(--hero-line-height)] w-[var(--hero-line-width)] bg-ink-inverse/90 mt-[var(--hero-line-mt)] mb-[var(--hero-line-mb)]" aria-hidden />
        <h1 className="font-display font-bold text-[length:var(--hero-title-size)] leading-[var(--hero-title-leading)] tracking-heading [font-optical-sizing:auto]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-lg text-ink-inverse/80 tracking-hero-sub mt-[var(--hero-sub-mt)]">{subtitle}</p>
        )}
        <div className="h-[var(--hero-line-height)] w-[var(--hero-line-width)] bg-ink-inverse/90 mt-[var(--hero-line-mt-end)]" aria-hidden />
        {actions && <div className="mt-6 flex flex-wrap gap-4">{actions}</div>}
        {children}
      </Container>
    </header>
  );
}
