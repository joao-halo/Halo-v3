import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Logotipo HALO — 01-fundamentos/logotipo-e-marca.md
 *
 * Símbolo: anel aberto percorrido pelo gradiente Aurora
 * (ouro → verde → azul). Geometria idêntica a assets/halo-logo.svg.
 * Wordmark: "Halo" — só o H maiúsculo, Outfit 600, tracking −0.01em.
 * Tamanho mínimo do símbolo: 24px (§4).
 */

/**
 * Geometria do anel, copiada de public/brand/halo-mark.svg (viewBox 100×100).
 * Coordenadas de traçado não são tokenizáveis — vivem aqui, nomeadas, para não
 * aparecerem soltas dentro do JSX.
 */
const RING_ARCS = [
  "M17.96 31.5A37 37 0 0 1 86.86 46.77",
  "M86.86 46.77A37 37 0 0 1 40.42 85.74",
  "M40.42 85.74A37 37 0 0 1 13 50",
] as const;

/** Espessura do traço no sistema de coordenadas do viewBox. */
const RING_STROKE = 13;

/** Gradiente Aurora, na ordem fixa ouro → verde → azul (logotipo §5). */
const RING_STOPS = [
  ["var(--halo-gold)", "var(--halo-green)"],
  ["var(--halo-green)", "var(--halo-blue)"],
  ["var(--halo-blue)", "var(--halo-ring-tip)"],
] as const;

export interface HaloMarkProps extends React.SVGProps<SVGSVGElement> {
  /** `gradient` (Aurora) ou `mono` (uma cor via currentColor). */
  tone?: "gradient" | "mono";
  /** Altura/largura em px. Mínimo permitido pelo DS: 24. */
  size?: number;
}

export function HaloMark({ tone = "gradient", size = 48, className, ...props }: HaloMarkProps) {
  // ids únicos e estáveis entre servidor e cliente (vários anéis por página).
  const uid = React.useId().replace(/:/g, "");

  if (tone === "mono") {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label="Halo"
        className={cn("shrink-0", className)}
        {...props}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          d={RING_ARCS.join(" ")}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Halo"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${uid}-1`} gradientUnits="userSpaceOnUse" x1="17.96" y1="31.5" x2="86.86" y2="46.77">
          <stop offset="0" stopColor={RING_STOPS[0][0]} />
          <stop offset="1" stopColor={RING_STOPS[0][1]} />
        </linearGradient>
        <linearGradient id={`${uid}-2`} gradientUnits="userSpaceOnUse" x1="86.86" y1="46.77" x2="40.42" y2="85.74">
          <stop offset="0" stopColor={RING_STOPS[1][0]} />
          <stop offset="1" stopColor={RING_STOPS[1][1]} />
        </linearGradient>
        <linearGradient id={`${uid}-3`} gradientUnits="userSpaceOnUse" x1="40.42" y1="85.74" x2="13" y2="50">
          <stop offset="0" stopColor={RING_STOPS[2][0]} />
          <stop offset="1" stopColor={RING_STOPS[2][1]} />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth={RING_STROKE} strokeLinecap="round">
        {RING_ARCS.map((d, i) => (
          <path key={d} d={d} stroke={`url(#${uid}-${i + 1})`} />
        ))}
      </g>
    </svg>
  );
}

export interface HaloWordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `dark` = verde 700 (fundo claro) · `light` = branco (fundo escuro). */
  tone?: "dark" | "light";
  /** Tamanho em px do wordmark. */
  size?: number;
}

export function HaloWordmark({ tone = "dark", size = 32, className, style, ...props }: HaloWordmarkProps) {
  return (
    <span
      className={cn(
        "font-brand font-semibold tracking-brand leading-none",
        tone === "dark" ? "text-green-700" : "text-ink-inverse",
        className,
      )}
      style={{ fontSize: size, ...style }}
      {...props}
    >
      Halo
    </span>
  );
}

export interface HaloLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Empilhado (showcase) ou lado a lado. */
  orientation?: "horizontal" | "vertical";
  /** Fundo claro (wordmark verde) ou escuro (wordmark branco). */
  tone?: "dark" | "light";
  /** Só o símbolo — avatar, favicon, selo (§3). */
  markOnly?: boolean;
  /** Anel monocromático — gravação, carimbo (§3). */
  mono?: boolean;
  size?: number;
}

/**
 * Lockup completo = símbolo + wordmark.
 * A área de proteção (altura do anel ÷ 2) é aplicada como padding,
 * conforme §4 — nada deve invadir essa zona.
 */
export function HaloLogo({
  orientation = "horizontal",
  tone = "dark",
  markOnly = false,
  mono = false,
  size = 48,
  className,
  style,
  ...props
}: HaloLogoProps) {
  const clearSpace = size / 2;
  return (
    <div
      className={cn(
        "inline-flex items-center",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      style={{
        gap: orientation === "vertical" ? clearSpace * 0.29 : clearSpace * 0.42,
        ...style,
      }}
      {...props}
    >
      <HaloMark
        size={size}
        tone={mono ? "mono" : "gradient"}
        className={mono ? (tone === "dark" ? "text-green-700" : "text-ink-inverse") : undefined}
      />
      {!markOnly && <HaloWordmark tone={tone} size={size * 0.66} />}
    </div>
  );
}
