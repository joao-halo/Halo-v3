import { Check } from "lucide-react";
import {
  Badge,
  ButtonLink,
  Container,
  Grid,
  Overline,
  Reveal,
  Section,
  SectionHeader,
  Text,
} from "../ui";
import { photovoltaic } from "../../data/content";
import { waLink } from "../../data/site";
import { ICON } from "../../lib/icons";

/** 5. Fotovoltaico — #fotovoltaico (texto à esquerda, imagem à direita) */
export function Photovoltaic() {
  return (
    <Section id={photovoltaic.id} tone="subtle">
      <Container width="max">
        <Grid cols="halves" className="items-start">
          <Reveal>
            <SectionHeader
              overline={photovoltaic.eyebrow}
              title={photovoltaic.title}
              description={photovoltaic.subtitle}
              className="mb-5"
            />

            <Text size="lg" measure>
              {photovoltaic.paragraph}
            </Text>

            <div className="mt-6">
              <Overline>{photovoltaic.applicationsLabel}</Overline>
              <ul className="list-none m-0 p-0 mt-3 flex flex-wrap gap-2">
                {photovoltaic.applications.map((application) => (
                  <li key={application}>
                    <Badge tone="primary">{application}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="list-none m-0 p-0 mt-6 flex flex-col gap-5">
              {photovoltaic.items.map((item) => (
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
              href={waLink(photovoltaic.cta.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7"
            >
              {photovoltaic.cta.label}
            </ButtonLink>
          </Reveal>

          <Reveal index={1}>
            <img
              src={photovoltaic.image}
              alt={photovoltaic.imageAlt}
              width={photovoltaic.imageWidth}
              height={photovoltaic.imageHeight}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover rounded-none"
            />
          </Reveal>
        </Grid>
      </Container>
    </Section>
  );
}
