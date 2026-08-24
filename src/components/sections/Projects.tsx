import { Container, Grid, MediaCard, Reveal, Section, SectionHeader } from "../ui";
import { projects } from "../../data/content";

/** 2. Projetos — #projetos */
export function Projects() {
  return (
    <Section id={projects.id} tone="default">
      <Container width="max">
        <Reveal>
          <SectionHeader
            overline={projects.eyebrow}
            title={projects.title}
            description={projects.subtitle}
          />
        </Reveal>

        <Grid cols="thirds">
          {projects.items.map((project, index) => (
            <Reveal key={project.image} index={index % 3}>
              <MediaCard
                image={project.image}
                alt={project.alt}
                category={project.category}
                title={project.title}
                width={project.width}
                height={project.height}
              />
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
