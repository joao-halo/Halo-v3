import { useEffect, useState } from "react";

/**
 * Devolve o id da seção visível mais próxima do topo da janela.
 *
 * Usa IntersectionObserver com uma faixa estreita logo abaixo do header,
 * de modo que a seção "ativa" é aquela que ocupa o topo da leitura.
 */
export function useScrollSpy(ids: readonly string[], offset = 96): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) return;

        // entre as seções visíveis, a que estiver mais alta na janela vence
        let bestId = "";
        let bestTop = Number.POSITIVE_INFINITY;
        for (const [id, top] of visible) {
          const distance = Math.abs(top - offset);
          if (distance < bestTop) {
            bestTop = distance;
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
