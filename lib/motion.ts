/**
 * Si el usuario pide menos movimiento, las entradas GSAP no corren:
 * el contenido queda visible en su estado final desde el primer frame.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
