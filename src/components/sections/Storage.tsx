import { Check } from "lucide-react";
import {
  ButtonLink,
  Card,
  Container,
  Grid,
  Heading,
  Overline,
  Reveal,
  Section,
  SectionHeader,
  Text,
} from "../ui";
import { storage } from "../../data/content";
import { waLink } from "../../data/site";
import { ICON } from "../../lib/icons";

/** 6. Armazenamento — #armazenamento (colunas invertidas: imagem à esquerda) */
export function Storage() {
  return (
    <Section id={storage.id} tone="default">
      <Container width="max">
        <Grid cols="halves" className="items-start">
          <Reveal className="order-2 md:order-1">
            <img
              src={storage.image}
              alt={storage.imageAlt}
              width={storage.imageWidth}
              height={storage.imageHeight}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover rounded-none"
            />
          </Reveal>

          <Reveal index={1} className="order-1 md:order-2">
            <SectionHeader
              overline={storage.eyebrow}
              title={storage.title}
              description={storage.subtitle}
              className="mb-5"
            />

            <Text size="lg" measure>
              {storage.paragraph}
            </Text>

            <ul className="list-none m-0 p-0 mt-6 flex flex-col gap-5">
              {storage.items.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <Check
                    size={ICON.md}
                    strokeWidth={ICON.stroke}
                    aria-hidden
                    className="shrink-0 mt-1 text-primary"
                  />
                  <div>
                    <h3 className="font-display font-semibold text-[length:var(--text-team-name)]">
                      {item.title}
                    </h3>
                    <Text size="sm" tone="muted" className="mt-1">
                      {item.description}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>

            <ButtonLink
              variant="primary"
              size="md"
              href={waLink(storage.cta.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7"
            >
              {storage.cta.label}
            </ButtonLink>
          </Reveal>
        </Grid>

        <div className="mt-9">
          <Reveal>
            <Overline>{storage.useCasesLabel}</Overline>
          </Reveal>
          <Grid cols="quarters" className="mt-5">
            {storage.useCases.map((useCase, index) => (
              <Reveal key={useCase.title} index={index}>
                <Card as="article" className="h-full">
                  <Heading level="h3" as="h3" className="text-[length:var(--text-card-title)]">
                    {useCase.title}
                  </Heading>
                  <Text size="sm" tone="muted" className="mt-3">
                    {useCase.description}
                  </Text>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </div>
      </Container>
    </Section>
  );
}
