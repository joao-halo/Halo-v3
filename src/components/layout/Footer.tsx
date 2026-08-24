import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Container, HaloWordmark, Overline, Text } from "../ui";
import { footer as footerContent } from "../../data/content";
import { navItems, site } from "../../data/site";
import { ICON, LOGO } from "../../lib/icons";

/** Rodapé em quatro colunas + barra inferior com dados legais. */
export function Footer() {
  return (
    <footer className="on-inverted bg-surface-dark text-ink-inverse">
      <Container width="max" className="py-section-rhythm">
        <div className="grid gap-gutter grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="inline-flex items-center gap-3">
              <img src="/brand/halo-mark.svg" alt="" aria-hidden width={LOGO.mark.footer} height={LOGO.mark.footer} />
              <HaloWordmark tone="light" size={LOGO.word.footer} />
            </span>
            <Text className="mt-5 text-ink-inverse-muted max-w-measure-narrow">
              {footerContent.positioning}
            </Text>
          </div>

          <nav aria-label={footerContent.navTitle}>
            <Overline tone="accent">{footerContent.navTitle}</Overline>
            <ul className="list-none m-0 p-0 mt-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-body text-sm no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footerContent.solutionsTitle}>
            <Overline tone="accent">{footerContent.solutionsTitle}</Overline>
            <ul className="list-none m-0 p-0 mt-4 flex flex-col gap-3">
              {footerContent.solutionLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-body text-sm no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Overline tone="accent">{footerContent.contactTitle}</Overline>
            <ul className="list-none m-0 p-0 mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center gap-2 font-body text-sm no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
                >
                  <Phone size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden className="text-accent" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 font-body text-sm no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
                >
                  <Mail size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden className="text-accent" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
                >
                  <Instagram size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden className="text-accent" />
                  {site.instagramHandle}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 font-body text-sm text-neutral-300">
                <MapPin size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden className="text-accent" />
                {site.city}, {site.stateName}
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-ink-inverse/10">
        <Container width="max" className="py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-caption text-neutral-300">
            {site.legalName} · CNPJ {site.cnpj} · {footerContent.copyright}
          </p>
          <a
            href="#inicio"
            className="font-body text-caption no-underline text-neutral-300 hover:text-ink-inverse transition-colors duration-halo ease-halo"
          >
            {footerContent.backToTop}
          </a>
        </Container>
      </div>
    </footer>
  );
}
