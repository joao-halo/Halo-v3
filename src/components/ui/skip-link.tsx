import { ButtonLink } from "./button";
import { cn } from "../../lib/cn";

/**
 * Link "pular para o conteúdo": invisível até receber foco pelo teclado.
 *
 * A aparência é a do botão sólido do design system — reaproveitada de
 * `ButtonLink`, não reescrita. Aqui só ficam o posicionamento e a lógica de
 * revelar no foco.
 */
export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <ButtonLink
      variant="solid"
      size="md"
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-toast",
        className,
      )}
    >
      {children}
    </ButtonLink>
  );
}
