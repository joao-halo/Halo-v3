// Datas e horas no fuso de Brasília, independentemente do fuso do servidor
// (as funções da Vercel rodam em UTC). Data "AAAA-MM-DD", hora "HH:MM".

export const FUSO = 'America/Sao_Paulo';

const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function partes(d = new Date()) {
  return Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
}

export function hoje(d) {
  const p = partes(d);
  return `${p.year}-${p.month}-${p.day}`;
}

export function horaAgora(d) {
  const p = partes(d);
  return `${p.hour}:${p.minute}`;
}

export function minutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function duracao(inicio, fim) {
  if (!inicio || !fim) return '';
  const t = minutos(fim) - minutos(inicio);
  return `${Math.floor(t / 60)}h${String(t % 60).padStart(2, '0')}`;
}

export function dataBR(iso) {
  if (!iso) return '';
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

export const HORA_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;
