import {
  ButtonLink,
  Container,
  Hero as HeroShell,
  Overline,
  Reveal,
  Section,
  Text,
} from "../ui";
import { hero, heroSummary } from "../../data/content";
import { waLink } from "../../data/site";

/**
 * 1. Capa — #inicio
 *
 * A capa carrega o mínimo: título e as duas ações. Tudo que antes competia com
 * o fundo — rótulo, parágrafo e micro-provas — desceu para a faixa logo abaixo,
 * que continua na primeira dobra e permanece legível para busca e para IA.
 */
export function Hero() {
  return (
    <>
      <HeroShell
        id={hero.id}
        title={hero.title}
        video={hero.video}
        height={hero.video ? "screen" : "auto"}
        className="on-inverted pt-nav"
        actions={
          <>
            <ButtonLink
              variant="primary"
              size="lg"
              href={waLink(hero.primaryCta.message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink variant="accent" size="lg" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </ButtonLink>
          </>
        }
      />

      <Section tone="default" className="py-7">
        <Container width="max">
          <Reveal>
            <Overline>{heroSummary.eyebrow}</Overline>
            <Text size="lg" measure className="mt-4">
              {heroSummary.paragraph}
            </Text>

            <ul className="list-none m-0 p-0 mt-6 pt-5 border-t border-line grid gap-5 md:grid-cols-3">
              {heroSummary.proofs.map((proof) => (
                <li
                  key={proof}
                  className="font-brand text-overline font-semibold tracking-overline uppercase text-ink-muted"
                >
                  {proof}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
