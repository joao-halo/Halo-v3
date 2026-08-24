/**
 * Espelho em JavaScript dos tokens de iconografia.
 *
 * lucide-react recebe `size` e `strokeWidth` como números, e não lê CSS custom
 * properties. Estes valores são a contrapartida exata de --icon-size-* e
 * --icon-stroke em src/styles/tokens.css; alterar um exige alterar o outro.
 */
export const ICON = {
  /** --icon-size-sm: 16px */
  sm: 16,
  /** --icon-size-md: 20px */
  md: 20,
  /** --icon-size-lg: 24px */
  lg: 24,
  /** --icon-size-xl: 28px */
  xl: 28,
  /** --icon-stroke: 2 */
  stroke: 2,
} as const;

/**
 * Espelho das dimensões do logotipo usadas na navegação.
 * Contrapartida de --logo-mark-* e --logo-word-* em tokens.css.
 * Mínimo do design system para o símbolo: 24px (logotipo-e-marca.md §4).
 */
export const LOGO = {
  mark: { header: 36, menu: 32, footer: 40 },
  word: { header: 24, menu: 22, footer: 26 },
} as const;
