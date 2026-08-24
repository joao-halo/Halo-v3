import { Card, Container, ProcessSteps, Reveal, Section, SectionHeader } from "../ui";
import { process } from "../../data/content";

/** 8. Como funciona — #processo */
export function Process() {
  return (
    <Section id={process.id} tone="default">
      <Container width="max">
        <Reveal>
          <SectionHeader
            overline={process.eyebrow}
            title={process.title}
            description={process.subtitle}
          />
        </Reveal>

        <Reveal index={1}>
          <Card padding="sm" interactive={false}>
            <ProcessSteps steps={process.steps} />
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}
