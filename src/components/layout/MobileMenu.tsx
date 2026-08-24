import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ButtonLink, HaloWordmark } from "../ui";
import { header as headerContent } from "../../data/content";
import { navItems, waLink } from "../../data/site";
import { cn } from "../../lib/cn";
import { ICON, LOGO } from "../../lib/icons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId: string;
}

/**
 * Drawer de navegação em tela cheia.
 * Fecha com Esc, devolve o foco ao gatilho e mantém o foco preso
 * enquanto está aberto (Tab e Shift+Tab circulam dentro do painel).
 */
export function MobileMenu({ open, onClose, activeId }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={headerContent.menuTitle}
      className="on-inverted fixed inset-0 z-modal bg-surface-dark text-ink-inverse overflow-y-auto lg:hidden"
    >
      <div className="flex items-center justify-between h-nav px-6">
        <span className="inline-flex items-center gap-3">
          <img src="/brand/halo-mark.svg" alt="" aria-hidden width={LOGO.mark.menu} height={LOGO.mark.menu} />
          <HaloWordmark tone="light" size={LOGO.word.menu} />
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={headerContent.menuCloseLabel}
          className="grid place-items-center w-[var(--btn-height-md)] h-[var(--btn-height-md)] rounded-full bg-transparent cursor-pointer text-ink-inverse"
        >
          <X size={ICON.lg} strokeWidth={ICON.stroke} aria-hidden />
        </button>
      </div>

      <nav aria-label={headerContent.menuTitle} className="px-6 pb-9">
        <ul className="list-none m-0 p-0 flex flex-col">
          {navItems.map((item) => {
            const active = `#${activeId}` === item.href;
            return (
              <li key={item.href} className="border-b border-ink-inverse/10">
                <a
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "block py-5 font-display text-xl no-underline",
                    active ? "text-accent" : "text-ink-inverse",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <ButtonLink
          variant="accent"
          size="lg"
          block
          href={waLink(headerContent.ctaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="mt-6"
        >
          {headerContent.ctaLabel}
        </ButtonLink>
      </nav>
    </div>
  );
}
