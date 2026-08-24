import { MessageCircle } from "lucide-react";
import { ButtonLink } from "../ui";
import { floatingCta } from "../../data/content";
import { waLink } from "../../data/site";
import { useScrolledPast } from "../../hooks/useScrollPosition";
import { FAB_REVEAL_SCROLL } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { ICON } from "../../lib/icons";

/** Botão flutuante de WhatsApp, visível depois de 600px de rolagem. */
export function WhatsAppFab() {
  const visible = useScrolledPast(FAB_REVEAL_SCROLL);

  return (
    <ButtonLink
      variant="solid"
      size="md"
      href={waLink(floatingCta.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={floatingCta.ariaLabel}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      iconLeft={<MessageCircle size={ICON.md} strokeWidth={ICON.stroke} aria-hidden />}
      className={cn(
        "fixed right-[var(--fab-offset)] bottom-[var(--fab-offset)] z-overlay shadow-lg",
        "transition-all duration-halo ease-halo",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      {floatingCta.label}
    </ButtonLink>
  );
}
