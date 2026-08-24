import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Slider — [EXT] registrada em DESIGN-TOKENS.md.
 * `input[type=range]` nativo: teclado, `aria-valuenow` e leitores de tela
 * funcionam sem JavaScript adicional. A aparência (trilha 4px, preenchimento
 * em gradiente esmeralda, polegar branco com borda verde) vem de
 * `.halo-slider` em src/styles/index.css, escrita só com tokens.
 */
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: number;
  min: number;
  max: number;
  step: number;
  /** Texto lido por leitores de tela no lugar do número cru. */
  valueText?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, min, max, step, valueText, className, style, ...props },
  ref,
) {
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      ref={ref}
      type="range"
      className={cn("halo-slider", className)}
      value={value}
      min={min}
      max={max}
      step={step}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
      style={{ ["--slider-progress" as string]: `${progress}%`, ...style }}
      {...props}
    />
  );
});
