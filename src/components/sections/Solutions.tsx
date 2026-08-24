import {
  Card,
  Container,
  FeatureIcon,
  Grid,
  Heading,
  Reveal,
  Section,
  SectionHeader,
  Text,
} from "../ui";
import { solutionsSection } from "../../data/content";
import { solutions } from "../../data/solutions";
import { ICON } from "../../lib/icons";

/** 4. Soluções — #solucoes */
export function Solutions() {
  return (
    <Section id={solutionsSection.id} tone="default">
      <Container width="max">
        <Reveal>
          <SectionHeader
            overline={solutionsSection.eyebrow}
            title={solutionsSection.title}
            description={solutionsSection.subtitle}
          />
        </Reveal>

        <Grid cols="thirds">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <Reveal key={solution.number} index={index}>
                <Card as="article" padding="lg" className="h-full flex flex-col">
                  <p
                    aria-hidden
                    className="font-display font-bold text-[length:var(--text-step-number)] leading-none text-step"
                  >
                    {solution.number}
                  </p>

                  <FeatureIcon tone="gradient" className="mt-5 mb-[var(--icon-circle-gap)]">
                    <Icon size={ICON.xl} strokeWidth={ICON.stroke} aria-hidden />
                  </FeatureIcon>

                  <Heading level="h3" as="h3">
                    {solution.title}
                  </Heading>
                  <Text tone="muted" className="mt-3 flex-1">
                    {solution.description}
                  </Text>

                  <a
                    href={solution.href}
                    className="mt-5 font-brand text-base font-semibold text-green-700 no-underline hover:text-primary transition-colors duration-halo ease-halo"
                  >
                    {solution.linkLabel}
                  </a>
                </Card>
              </Reveal>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}
