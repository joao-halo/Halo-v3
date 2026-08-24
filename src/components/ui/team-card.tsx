import * as React from "react";
import { cn } from "../../lib/cn";
import { Card } from "./card";
import { Heading, Overline, Text } from "./typography";

/**
 * Card de equipe — 02-componentes/cards-e-blocos.md §3
 * Foto retangular (raio md), nome (H3), cargo em overline verde, bio curta.
 * Grade de 3 ou 4 colunas, enquadramento consistente entre as fotos.
 */
export interface TeamCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  name: React.ReactNode;
  role: React.ReactNode;
  bio?: React.ReactNode;
  /** URL da foto. Sem foto, cai no avatar de gradiente do showcase. */
  photo?: string;
  photoAlt?: string;
  /** Gradiente do avatar de reserva. */
  fallbackGradient?: "sun" | "emerald" | "gold" | "brand";
}

const FALLBACK = {
  sun: "bg-gradient-sun",
  emerald: "bg-gradient-emerald",
  gold: "bg-gradient-gold",
  brand: "bg-gradient-brand",
} as const;

export function TeamCard({
  name,
  role,
  bio,
  photo,
  photoAlt,
  fallbackGradient = "sun",
  className,
  ...props
}: TeamCardProps) {
  return (
    <Card className={className} {...props}>
      {photo ? (
        <img
          src={photo}
          alt={photoAlt ?? String(name)}
          className="w-full aspect-portrait object-cover rounded-md mb-5"
        />
      ) : (
        <div className={cn("w-[var(--avatar-size)] h-[var(--avatar-size)] rounded-md mb-[var(--avatar-gap)]", FALLBACK[fallbackGradient])} aria-hidden />
      )}
      <Heading level="h3" as="h3" className="text-[length:var(--text-team-name)]">{name}</Heading>
      <Overline className="mt-1">{role}</Overline>
      {bio && <Text size="sm" tone="muted" className="mt-2">{bio}</Text>}
    </Card>
  );
}
