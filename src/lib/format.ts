/** Formatação pt-BR usada em toda a interface. */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const brlCents = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** R$ 1.234 — valores grandes, sem centavos. */
export const formatCurrency = (value: number): string => brl.format(value);

/** R$ 1,23 — valores por quilômetro e tarifas. */
export const formatCurrencyPrecise = (value: number): string => brlCents.format(value);

/** 12,3 — uma casa decimal. */
export const formatDecimal = (value: number): string => decimal.format(value);

/** 1.234 — inteiros. */
export const formatInteger = (value: number): string => integer.format(value);

export const formatKwp = (value: number): string => `${formatDecimal(value)} kWp`;
export const formatKwh = (value: number): string => `${formatDecimal(value)} kWh`;
export const formatKm = (value: number): string => `${formatInteger(value)} km`;

/** Máscara progressiva de telefone brasileiro: (31) 90000-0000. */
export function maskPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Só os dígitos — usado na validação e no link do WhatsApp. */
export const onlyDigits = (input: string): string => input.replace(/\D/g, "");
