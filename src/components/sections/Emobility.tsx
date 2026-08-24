import {
  ButtonLink,
  Container,
  Grid,
  NumberedItem,
  Overline,
  Reveal,
  Section,
  SectionHeader,
  Text,
} from "../ui";
import { emobility } from "../../data/content";
import { waLink } from "../../data/site";

/** 7. Eletromobilidade — #eletromobilidade (fundo invertido) */
export function Emobility() {
  return (
    <Section id={emobility.id} tone="dark">
      <Container width="max">
        <Reveal>
          <SectionHeader
            tone="inverse"
            overline={emobility.eyebrow}
            title={emobility.title}
            description={emobility.subtitle}
          />
          <Text size="lg" measure className="text-ink-inverse-muted">
            {emobility.paragraph}
          </Text>
        </Reveal>

        <div className="mt-9">
          <Reveal>
            <Overline tone="accent">{emobility.chargersLabel}</Overline>
          </Reveal>
          <Grid cols="quarters" className="mt-5">
            {emobility.chargers.map((charger, index) => (
              <Reveal key={charger.title} index={index}>
                <article className="h-full border border-ink-inverse/20 rounded-md p-5">
                  <h3 className="font-display font-semibold text-[length:var(--text-card-title)] text-ink-inverse">
                    {charger.title}
                  </h3>
                  <Text size="sm" className="mt-2 text-ink-inverse-muted">
                    {charger.description}
                  </Text>
                </article>
              </Reveal>
            ))}
          </Grid>
        </div>

        <div className="mt-9">
          <Reveal>
            <Overline tone="accent">{emobility.scopeLabel}</Overline>
          </Reveal>
          <Grid cols="quarters" className="mt-5">
            {emobility.scope.map((item, index) => (
              <Reveal key={item.number} index={index}>
                <NumberedItem
                  tone="inverse"
                  titleSize="md"
                  number={item.number}
                  title={item.title}
                  description={item.description}
                />
              </Reveal>
            ))}
          </Grid>
        </div>

        <div className="mt-9">
          <Reveal>
            <Overline tone="accent">{emobility.scopeLabel}</Overline>
          </Reveal>
          <Grid cols="quarters" className="mt-5">
            {emobility.scope.map((item, index) => (
              <Reveal key={item.number} index={index}>
                <article className="border-t border-ink-inverse/20 pt-5">
                  <p
                    aria-hidden
                    className="font-display font-bold text-[length:var(--text-step-number)] leading-none text-accent"
                  >
                    {item.number}
                  </p>
                  <h3 className="font-display font-semibold text-[length:var(--text-team-name)] text-ink-inverse mt-4">
                    {item.title}
                  </h3>
                  <Text size="sm" className="mt-2 text-ink-inverse-muted">
                    {item.description}
                  </Text>
                </article>
              </Reveal>
            ))}
          </Grid>
        </div>

        <Reveal>
          <ButtonLink
            variant="accent"
            size="md"
            href={waLink(emobility.cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9"
          >
            {emobility.cta.label}
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
