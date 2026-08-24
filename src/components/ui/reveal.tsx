import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";
import { EASE_OUT, REVEAL_DISTANCE, REVEAL_DURATION_S, STAGGER_S } from "../../lib/motion";

/**
 * Revelação no scroll — fade + deslocamento vertical curto.
 *
 * [EXT] O design system define motion só para micro-interação (200ms).
 * Duração, distância e curva de entrada vivem em --motion-* / --ease-out.
 * Com `prefers-reduced-motion` o conteúdo aparece sem animação alguma.
 */

const variants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  visible: (delayIndex: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_S, ease: EASE_OUT, delay: delayIndex * STAGGER_S },
  }),
};

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Posição na sequência; multiplica o atraso de entrada. */
  index?: number;
  as?: "div" | "li" | "section" | "article" | "header";
}

export function Reveal({ index = 0, as = "div", className, children, ...props }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduced) {
    const Static = as as React.ElementType;
    return (
      <Static className={className} {...props}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={index}
      variants={variants}
      {...(props as object)}
    >
      {children}
    </Component>
  );
}
