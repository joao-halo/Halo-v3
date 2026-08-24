import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Card de imagem com caixa de texto sobreposta.
 * Deriva de "Imagem dominante — imagem + caixa de texto sobreposta"
 * (espacamento-e-layout.md §2) e da capa de padroes-de-slide.md §1:
 * imagem reta (raio 0), scrim grafite, overline sobre título.
 */
export interface MediaCardProps extends React.HTMLAttributes<HTMLElement> {
  image: string;
  alt: string;
  category: string;
  title: string;
  width?: number;
  height?: number;
  /** A primeira dobra não usa lazy loading. */
  eager?: boolean;
}

export function MediaCard({
  image,
  alt,
  category,
  title,
  width = 800,
  height = 600,
  eager = false,
  className,
  ...props
}: MediaCardProps) {
  return (
    <figure className={cn("relative overflow-hidden rounded-none m-0 group", className)} {...props}>
      <img
        src={image}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "block w-full h-full object-cover aspect-card",
          "transition-transform duration-halo ease-halo group-hover:scale-zoom",
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[image:var(--overlay-scrim)]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-brand text-overline font-semibold tracking-overline uppercase text-accent">
          {category}
        </p>
        <p className="font-display font-semibold text-[length:var(--text-card-title)] text-ink-inverse mt-2">
          {title}
        </p>
      </figcaption>
    </figure>
  );
}
