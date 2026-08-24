import { ButtonLink, Hero as HeroShell } from "../ui";
import { hero } from "../../data/content";
import { waLink } from "../../data/site";

/** 1. Capa — #inicio */
export function Hero() {
  return (
    <HeroShell
      id={hero.id}
      eyebrowLeft={hero.eyebrow}
      title={hero.title}
      subtitle={hero.paragraph}
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
    >
      <ul className="list-none m-0 p-0 mt-9 pt-6 border-t border-ink-inverse/20 grid gap-5 md:grid-cols-3">
        {hero.proofs.map((proof) => (
          <li
            key={proof}
            className="font-brand text-overline font-semibold tracking-overline uppercase text-ink-inverse/70"
          >
            {proof}
          </li>
        ))}
      </ul>
    </HeroShell>
  );
}
