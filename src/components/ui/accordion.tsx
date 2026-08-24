import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/cn";
import { ICON } from "../../lib/icons";

/**
 * Accordion — [EXT] registrada em DESIGN-TOKENS.md.
 * `button` + `aria-expanded` + `aria-controls`, ícone +/− em verde 500,
 * divisória de 1px (o fio-régua do template) e animação de altura via
 * `grid-template-rows`, que respeita `prefers-reduced-motion` pela
 * regra global de redução de movimento.
 */
export interface AccordionItemData {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: readonly AccordionItemData[];
  idPrefix?: string;
  className?: string;
}

export function Accordion({ items, idPrefix = "faq", className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${idPrefix}-trigger-${index}`;
        const panelId = `${idPrefix}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className={cn(
                  "w-full flex items-start justify-between gap-4 text-left cursor-pointer bg-transparent",
                  "py-5 font-body text-lg font-medium text-ink",
                  "transition-colors duration-halo ease-halo hover:text-primary",
                )}
              >
                <span>{item.question}</span>
                <span className="shrink-0 text-primary mt-1" aria-hidden>
                  {open ? (
                    <Minus size={ICON.md} strokeWidth={ICON.stroke} />
                  ) : (
                    <Plus size={ICON.md} strokeWidth={ICON.stroke} />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-halo ease-halo",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="font-body text-base text-ink-muted max-w-measure pb-5">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
