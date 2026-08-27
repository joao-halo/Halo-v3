import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "../../lib/cn";
import { Container } from "./layout";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ICON } from "../../lib/icons";

/**
 * Capa / Hero — 02-componentes/padroes-de-slide.md §1 + showcase
 *
 * Fundo grafite com dois halos radiais (azul no alto à direita, ouro embaixo à
 * esquerda), dois fios brancos de 2px emoldurando o título e subtítulo em
 * maiúsculas espaçadas.
 *
 * Aceita três fundos, nesta ordem de precedência:
 *   `video`  → vídeo em laço, mudo, atrás de um véu grafite
 *   `image`  → foto estática sob o mesmo véu (§1: "overlay grafite a ~70%")
 *   nenhum   → só o grafite com os halos
 */

export interface HeroVideo {
  /** WebM primeiro: o navegador escolhe o primeiro formato que suporta. */
  webm?: string;
  mp4: string;
  /** Quadro exibido antes de carregar, em conexão limitada e com movimento reduzido. */
  poster: string;
  label: string;
  pauseLabel: string;
  playLabel: string;
}

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrowLeft?: React.ReactNode;
  eyebrowRight?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  video?: HeroVideo | null;
  actions?: React.ReactNode;
  /** Altura mínima da capa. `screen` preenche a dobra — usado com vídeo. */
  height?: "auto" | "screen";
}

/**
 * Vídeo de fundo.
 *
 * A reprodução é decidida no cliente, nunca por atributo `autoplay`: assim o
 * HTML renderizado no servidor e o do navegador são idênticos, e a decisão de
 * tocar leva em conta preferência de movimento reduzido e economia de dados.
 */
function BackgroundVideo({ video }: { video: HeroVideo }) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    // Respeita quem pediu menos movimento e quem está no modo de economia de
    // dados: nesses casos fica só o pôster, sem baixar o vídeo.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setAllowed(!reduced && !connection?.saveData);
  }, [reduced]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!allowed) {
      el.pause();
      setPlaying(false);
      return;
    }
    // play() devolve uma promessa que o navegador pode rejeitar por política
    // de reprodução automática. Rejeição não é erro: fica o pôster.
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [allowed]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.label}
        tabIndex={-1}
      >
        {allowed && video.webm && <source src={video.webm} type="video/webm" />}
        {allowed && <source src={video.mp4} type="video/mp4" />}
      </video>

      {/*
        Véu grafite a 70% (--overlay-dark). Não é estética: garante que o texto
        branco por cima mantenha pelo menos 5,2:1 mesmo sobre um quadro branco
        do vídeo, o que nenhum gradiente parcial garantiria.
      */}
      <div aria-hidden className="absolute inset-0 bg-[color:var(--overlay-dark)]" />

      {/*
        WCAG 2.2.2: conteúdo em movimento que começa sozinho e dura mais de
        cinco segundos precisa de um controle para parar.
      */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? video.pauseLabel : video.playLabel}
        className={cn(
          "absolute right-5 bottom-5 z-base grid place-items-center",
          "w-[var(--btn-height-sm)] h-[var(--btn-height-sm)] rounded-full",
          "bg-ink-inverse/10 text-ink-inverse backdrop-blur",
          "transition-colors duration-halo ease-halo hover:bg-ink-inverse/20",
        )}
      >
        {playing ? (
          <Pause size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden />
        ) : (
          <Play size={ICON.sm} strokeWidth={ICON.stroke} aria-hidden />
        )}
      </button>
    </>
  );
}

export function Hero({
  eyebrowLeft,
  eyebrowRight,
  title,
  subtitle,
  image,
  video,
  actions,
  height = "auto",
  className,
  children,
  ...props
}: HeroProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden bg-surface-dark text-ink-inverse",
        height === "screen" && "min-h-[100svh] flex items-center",
        className,
      )}
      {...props}
    >
      {video ? (
        <BackgroundVideo video={video} />
      ) : (
        image && (
          <>
            <img src={image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
            <div aria-hidden className="absolute inset-0 bg-[color:var(--overlay-dark)]" />
          </>
        )
      )}

      <div aria-hidden className="absolute inset-0 bg-hero-halos" />

      <Container className="relative z-base py-9">
        {(eyebrowLeft || eyebrowRight) && (
          <div className="flex justify-between items-center font-brand text-caption tracking-topbar uppercase text-ink-inverse/70">
            <span>{eyebrowLeft}</span>
            <span>{eyebrowRight}</span>
          </div>
        )}
        <div className="h-[var(--hero-line-height)] w-[var(--hero-line-width)] bg-ink-inverse/90 mt-[var(--hero-line-mt)] mb-[var(--hero-line-mb)]" aria-hidden />
        <h1 className="font-display font-bold text-[length:var(--hero-title-size)] leading-[var(--hero-title-leading)] tracking-heading [font-optical-sizing:auto]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-lg text-ink-inverse/80 tracking-hero-sub mt-[var(--hero-sub-mt)]">{subtitle}</p>
        )}
        <div className="h-[var(--hero-line-height)] w-[var(--hero-line-width)] bg-ink-inverse/90 mt-[var(--hero-line-mt-end)]" aria-hidden />
        {actions && <div className="mt-6 flex flex-wrap gap-4">{actions}</div>}
        {children}
      </Container>
    </header>
  );
}
