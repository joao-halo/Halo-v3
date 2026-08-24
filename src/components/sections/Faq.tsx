import { MessageCircle, Phone } from "lucide-react";
import {
  Accordion,
  ButtonLink,
  Container,
  Heading,
  Overline,
  Reveal,
  Section,
  Text,
} from "../ui";
import { faqSection } from "../../data/content";
import { faq } from "../../data/faq";
import { site, waLink } from "../../data/site";
import { ICON } from "../../lib/icons";

/** 10. Dúvidas frequentes — #duvidas */
export function Faq() {
  return (
    <Section id={faqSection.id} tone="default">
      <Container width="max">
        <div className="grid gap-gutter lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start">
          <Reveal>
            <Overline>{faqSection.eyebrow}</Overline>
            <Heading level="h2" className="mt-2 mb-2">
              {faqSection.title}
            </Heading>
            <Text tone="muted" measure>
              {faqSection.subtitle}
            </Text>

            <Text className="mt-7">{faqSection.contactIntro}</Text>

            <ul className="list-none m-0 p-0 mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center gap-3 font-body text-base no-underline text-ink hover:text-primary transition-colors duration-halo ease-halo"
                >
                  <Phone size={ICON.md} strokeWidth={ICON.stroke} aria-hidden className="text-primary" />
                  <span>
                    <span className="sr-only">{faqSection.phoneLabel}: </span>
                    {site.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={waLink(faqSection.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-base no-underline text-ink hover:text-primary transition-colors duration-halo ease-halo"
                >
                  <MessageCircle size={ICON.md} strokeWidth={ICON.stroke} aria-hidden className="text-primary" />
                  {faqSection.whatsappLabel}
                </a>
              </li>
            </ul>

            <ButtonLink
              variant="outline"
              size="md"
              href={waLink(faqSection.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              {faqSection.whatsappCta}
            </ButtonLink>
          </Reveal>

          <Reveal index={1}>
            <Accordion items={faq} idPrefix="faq" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
