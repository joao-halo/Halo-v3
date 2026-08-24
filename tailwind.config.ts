import type { Config } from "tailwindcss";

/**
 * HALO — Tailwind theme
 *
 * Regra: NENHUM valor bruto aqui. Todo token aponta para uma CSS
 * custom property de `src/styles/tokens.css`, que é a única fonte
 * de verdade. Cores usam canais RGB (`--*-ch`) para que os
 * modificadores de opacidade do Tailwind (`bg-primary/60`)
 * continuem funcionando.
 *
 * ATENÇÃO — a escala numérica de `spacing`, `borderRadius` e
 * `boxShadow` é SOBRESCRITA pelos valores HALO (grade de 8px).
 * `p-5` = 24px, `p-6` = 32px, `p-7` = 48px, `p-8` = 64px.
 * Ver DESIGN-TOKENS.md §"Divergências com o padrão Tailwind".
 */

/** rgb(var(--x) / <alpha-value>) — mantém opacidade utilitária. */
const ch = (name: string) => `rgb(var(--${name}-ch) / <alpha-value>)`;
/** Cor semântica já resolvida (sem suporte a alpha utilitário). */
const v = (name: string) => `var(--${name})`;

const scale = (prefix: string, steps: readonly string[]) =>
  Object.fromEntries(steps.map((s) => [s, ch(`${prefix}-${s}`)]));

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
const NEUTRAL_STEPS = ["0", ...STEPS, "950"] as const;

export default {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    /**
     * ÚNICA exceção à regra "sem valor bruto": `@media` não resolve CSS
     * custom properties, então os breakpoints precisam ser literais.
     * Espelham --bp-* de tokens.css — mantenha os dois em sincronia.
     * Fora de `extend` para substituir o conjunto padrão do Tailwind:
     * o design system tem UMA quebra documentada (780px, showcase.html).
     */
    screens: {
      sm: "640px",   // [derivado]
      md: "780px",   // [showcase] quebra do design system
      lg: "1024px",  // [derivado]
      xl: "1280px",  // [derivado]
    },
    extend: {
      colors: {
        /* --- escalas de marca --- */
        green: scale("green", STEPS),
        blue: scale("blue", STEPS),
        gold: scale("gold", STEPS),
        neutral: scale("neutral", NEUTRAL_STEPS),

        /* --- núcleo da marca --- */
        brand: {
          green: ch("green-500"),
          blue: ch("blue-500"),
          gold: ch("gold-500"),
          DEFAULT: ch("green-500"),
        },

        /* --- papéis semânticos --- */
        primary: {
          DEFAULT: ch("green-500"),
          hover: ch("green-600"),
          soft: ch("green-50"),
        },
        secondary: {
          DEFAULT: ch("blue-500"),
          hover: ch("blue-600"),
          soft: ch("blue-50"),
        },
        accent: {
          DEFAULT: ch("gold-500"),
          hover: ch("gold-600"),
          soft: ch("gold-50"),
          /* ouro legível como texto sobre fundo claro — ver DESIGN-TOKENS.md */
          "on-light": ch("gold-700"),
        },

        /* --- texto --- */
        ink: {
          DEFAULT: ch("neutral-900"),
          muted: ch("neutral-500"),
          inverse: ch("neutral-0"),
          "on-brand": ch("neutral-0"),
          "on-accent": ch("neutral-900"),
          /* corpo de texto dentro de bloco escuro (.78 do showcase) */
          "inverse-muted": v("color-text-inverse-muted"),
        },

        /* --- superfícies --- */
        canvas: {
          DEFAULT: ch("neutral-0"),
          subtle: ch("neutral-50"),
        },
        surface: {
          DEFAULT: ch("neutral-0"),
          dark: ch("neutral-800"),
        },
        line: {
          DEFAULT: ch("neutral-200"),
          strong: ch("neutral-300"),
        },

        /* --- feedback --- */
        /* numeração ordinal das listas de etapas e pilares */
        step: v("color-step-number"),

        success: { DEFAULT: ch("success"), soft: ch("success-soft") },
        info: { DEFAULT: ch("blue-500"), soft: ch("blue-50") },
        warning: { DEFAULT: ch("gold-500"), soft: ch("gold-50") },
        danger: { DEFAULT: ch("danger"), soft: ch("danger-soft") },
      },

      backgroundImage: {
        "gradient-brand": v("gradient-brand"),
        "gradient-emerald": v("gradient-emerald"),
        /* variante com contraste AA para botão com texto branco */
        "gradient-emerald-cta": v("gradient-emerald-cta"),
        "gradient-gold": v("gradient-gold"),
        "gradient-sun": v("gradient-sun"),
        "gradient-dark": v("gradient-dark"),
        "overlay-scrim": v("overlay-scrim"),
        "hero-halos": v("hero-halos"),
      },

      fontFamily: {
        display: [v("font-display")],
        body: [v("font-body")],
        brand: [v("font-brand")],
        sans: [v("font-body")],
        serif: [v("font-display")],
      },

      fontSize: {
        overline: [v("text-overline"), { lineHeight: v("leading-normal"), letterSpacing: v("tracking-overline"), fontWeight: v("weight-semibold") }],
        caption: [v("text-caption"), { lineHeight: v("leading-normal") }],
        sm: [v("text-sm"), { lineHeight: v("leading-normal") }],
        base: [v("text-base"), { lineHeight: v("leading-normal") }],
        lg: [v("text-lg"), { lineHeight: v("leading-normal") }],
        xl: [v("text-xl"), { lineHeight: v("leading-snug"), letterSpacing: v("tracking-heading") }],
        "2xl": [v("text-2xl"), { lineHeight: v("leading-tight"), letterSpacing: v("tracking-heading") }],
        "3xl": [v("text-3xl"), { lineHeight: v("leading-tight"), letterSpacing: v("tracking-heading") }],
        "4xl": [v("text-4xl"), { lineHeight: v("leading-tight"), letterSpacing: v("tracking-tight") }],
      },

      fontWeight: {
        light: v("weight-light"),
        normal: v("weight-regular"),
        medium: v("weight-medium"),
        semibold: v("weight-semibold"),
        bold: v("weight-bold"),
      },

      lineHeight: {
        none: v("leading-none"),
        tight: v("leading-tight"),
        snug: v("leading-snug"),
        normal: v("leading-normal"),
      },

      letterSpacing: {
        tight: v("tracking-tight"),
        heading: v("tracking-heading"),
        brand: v("tracking-brand"),
        normal: v("tracking-normal"),
        wide: v("tracking-wide"),
        "hero-sub": v("tracking-hero-sub"),
        topbar: v("tracking-topbar"),
        overline: v("tracking-overline"),
      },

      /* Escala HALO de 8px — sobrescreve 1–10 do Tailwind. */
      spacing: {
        1: v("space-1"),
        2: v("space-2"),
        3: v("space-3"),
        4: v("space-4"),
        5: v("space-5"),
        6: v("space-6"),
        7: v("space-7"),
        8: v("space-8"),
        9: v("space-9"),
        10: v("space-10"),
        gutter: v("grid-gutter"),
        section: v("section-py"),
        "slide-safe": v("slide-safe"),
        nav: v("nav-height"),
        rule: v("rule-width"),
      },

      borderRadius: {
        none: v("radius-none"),
        sm: v("radius-sm"),
        DEFAULT: v("radius-md"),
        md: v("radius-md"),
        lg: v("radius-lg"),
        xl: v("radius-xl"),
        full: v("radius-full"),
      },

      boxShadow: {
        sm: v("shadow-sm"),
        DEFAULT: v("shadow-md"),
        md: v("shadow-md"),
        lg: v("shadow-lg"),
        xl: v("shadow-xl"),
        none: "none",
      },

      maxWidth: {
        container: v("container-max"),
        wrap: v("container-wrap"),
        measure: v("measure"),
        "measure-narrow": v("measure-narrow"),
      },

      height: { input: v("input-height-md") },
      minHeight: { input: v("input-height-md") },

      borderWidth: { DEFAULT: "1px", btn: "2px" },

      aspectRatio: {
        slide: "16 / 9",
        card: "4 / 3",      // cards de projeto
        portrait: "4 / 5",  // retrato de equipe
      },

      scale: { zoom: "var(--hover-zoom)" },
      brightness: { dim: "var(--hover-dim)" },

      transitionTimingFunction: { halo: v("ease") },
      transitionDuration: { DEFAULT: v("duration"), halo: v("duration") },

      zIndex: {
        base: v("z-base"),
        sticky: v("z-sticky"),
        overlay: v("z-overlay"),
        modal: v("z-modal"),
        toast: v("z-toast"),
      },

      outlineWidth: { focus: v("focus-ring-width") },
      outlineOffset: { focus: v("focus-ring-offset") },
    },
  },
  plugins: [],
} satisfies Config;
