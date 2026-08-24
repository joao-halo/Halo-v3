import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Card — 02-componentes/cards-e-blocos.md §1
 * Fundo branco, raio md (8px), sombra md, padding 32px.
 * Hover: eleva para shadow-lg.
 *
 * Anatomia: [ícone/imagem] → overline → título (H3) → texto → link/CTA.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevação inicial. */
  elevation?: "sm" | "md" | "lg";
  /** Desliga a elevação no hover (cards estáticos). */
  interactive?: boolean;
  /** Padding interno; `none` para cards que embutem grades. */
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "li" | "a";
}

const ELEVATION = { sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" } as const;
const PADDING = { none: "p-0", sm: "p-5", md: "p-6", lg: "p-7" } as const;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevation = "md", interactive = true, padding = "md", as: Tag = "div", className, ...props },
  ref,
) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cn(
        "bg-surface rounded-md",
        ELEVATION[elevation],
        PADDING[padding],
        "transition-shadow duration-halo ease-halo",
        interactive && "hover:shadow-lg",
        className,
      )}
      {...props}
    />
  );
});
