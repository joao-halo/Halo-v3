import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Abas — [EXT] registrada em DESIGN-TOKENS.md.
 * `role="tablist"` com navegação por setas, Home e End; indicador de 2px
 * em verde 500, rótulos no estilo overline do design system.
 */
export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  /** Rótulo acessível da lista de abas. */
  label: string;
  className?: string;
  idPrefix?: string;
}

export function Tabs({ items, value, onValueChange, label, className, idPrefix = "tab" }: TabsProps) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = items.findIndex((item) => item.id === value);
    if (index < 0) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const next = items[nextIndex];
    onValueChange(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap border-b border-line", className)}>
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[item.id] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(item.id)}
            onKeyDown={onKeyDown}
            className={cn(
              "font-brand text-overline font-semibold tracking-overline uppercase",
              "px-5 py-4 -mb-px border-b-btn cursor-pointer bg-transparent",
              "transition-colors duration-halo ease-halo",
              selected
                ? "border-primary text-primary"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  active: boolean;
  idPrefix?: string;
}

export function TabPanel({ id, active, idPrefix = "tab", className, children, ...props }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-${id}`}
      hidden={!active}
      tabIndex={0}
      className={cn(className)}
      {...props}
    >
      {active && children}
    </div>
  );
}
