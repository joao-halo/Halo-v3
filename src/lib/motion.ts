/**
 * Espelho em JavaScript dos tokens de motion.
 *
 * Framer Motion e requestAnimationFrame precisam de números, e CSS custom
 * properties não são legíveis de dentro de uma variants object. Estes
 * valores são a contrapartida exata de --motion-* e --ease-out em
 * src/styles/tokens.css; alterar um exige alterar o outro.
 */

/** --motion-reveal-duration: 600ms */
export const REVEAL_DURATION_MS = 600;
export const REVEAL_DURATION_S = REVEAL_DURATION_MS / 1000;

/** --motion-reveal-distance: 16px */
export const REVEAL_DISTANCE = 16;

/** --motion-stagger: 80ms */
export const STAGGER_MS = 80;
export const STAGGER_S = STAGGER_MS / 1000;

/** --ease-out: cubic-bezier(0, 0, 0.2, 1) */
export const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

/** --fab-reveal-scroll: 600px */
export const FAB_REVEAL_SCROLL = 600;

/** Rolagem a partir da qual o header ganha fundo. */
export const HEADER_SCROLL_THRESHOLD = 40;
