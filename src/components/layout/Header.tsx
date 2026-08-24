import { useState } from "react";
import { Menu } from "lucide-react";
import { ButtonLink, Container, HaloWordmark } from "../ui";
import { MobileMenu } from "./MobileMenu";
import { header as headerContent } from "../../data/content";
import { navItems, sectionIds, waLink } from "../../data/site";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { useScrolledPast } from "../../hooks/useScrollPosition";
import { HEADER_SCROLL_THRESHOLD } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { ICON, LOGO } from "../../lib/icons";

/**
 * Cabeçalho fixo. Ganha fundo e fio inferior depois de 40px de rolagem;
 * a navegação marca a seção ativa via scroll-spy.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolledPast(HEADER_SCROLL_THRESHOLD);
  const activeId = useScrollSpy(sectionIds);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-sticky transition-all duration-halo ease-halo",
          scrolled
            ? "bg-[color:var(--nav-bg-scrolled)] border-b border-line shadow-sm backdrop-blur"
            : // no topo o cabeçalho flutua sobre a capa grafite: inverte as cores
              "on-inverted bg-transparent border-b border-transparent",
        )}
      >
        <Container width="max" className="flex items-center justify-between h-nav">
          <a
            href="#inicio"
            aria-label={headerContent.homeLabel}
            className="inline-flex items-center gap-3 no-underline shrink-0"
          >
            <img
              src="/brand/halo-mark.svg"
              alt={headerContent.logoAlt}
              width={LOGO.mark.header}
              height={LOGO.mark.header}
            />
            <HaloWordmark tone={scrolled ? "dark" : "light"} size={LOGO.word.header} />
          </a>

          <nav aria-label={headerContent.menuTitle} className="hidden lg:block">
            <ul className="list-none m-0 p-0 flex items-center gap-5">
              {navItems.map((item) => {
                const active = `#${activeId}` === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "font-body text-sm no-underline transition-colors duration-halo ease-halo",
                        scrolled
                          ? active
                            ? "text-[color:var(--nav-link-active)] font-medium"
                            : "text-[color:var(--nav-link-color)] hover:text-primary"
                          : active
                            ? "text-accent font-medium"
                            : "text-ink-inverse/80 hover:text-ink-inverse",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              variant="primary"
              size="sm"
              href={waLink(headerContent.ctaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              {headerContent.ctaLabel}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={headerContent.menuOpenLabel}
              aria-expanded={menuOpen}
              className={cn(
                "lg:hidden grid place-items-center w-[var(--btn-height-md)] h-[var(--btn-height-md)]",
                "rounded-full bg-transparent cursor-pointer",
                scrolled ? "text-ink" : "text-ink-inverse",
              )}
            >
              <Menu size={ICON.lg} strokeWidth={ICON.stroke} aria-hidden />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={activeId} />
    </>
  );
}
