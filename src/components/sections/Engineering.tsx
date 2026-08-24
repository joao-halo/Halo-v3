import { Container, Grid, NumberedItem, Reveal, Section, SectionHeader } from "../ui";
import { engineering } from "../../data/content";

/** 3. Engenharia — #engenharia (fundo invertido) */
export function Engineering() {
  return (
    <Section id={engineering.id} tone="dark">
      <Container width="max">
        <Reveal>
          <SectionHeader
            tone="inverse"
            overline={engineering.eyebrow}
            title={engineering.title}
            description={engineering.subtitle}
          />
        </Reveal>

        <Grid cols="thirds" className="mt-7">
          {engineering.items.map((item, index) => (
            <Reveal key={item.number} index={index}>
              <NumberedItem
                tone="inverse"
                number={item.number}
                title={item.title}
                description={item.description}
              />
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
