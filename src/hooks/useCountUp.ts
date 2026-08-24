import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Contagem crescente até `target`, usada nos números dos simuladores.
 * Com `prefers-reduced-motion` o valor final aparece de imediato.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (reduced) {
      fromRef.current = target;
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // ease-out cúbico, mesma sensação da curva --ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + delta * eased;
      setValue(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      fromRef.current = target;
    };
  }, [target, durationMs, reduced]);

  return value;
}
