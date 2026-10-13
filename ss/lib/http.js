export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const falha = (status, msg) => { throw new HttpError(status, msg); };

export function enviarJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

// Na Vercel o corpo já vem lido em req.body (Buffer, objeto ou texto); no
// servidor local de desenvolvimento lemos o stream.
export async function lerCorpo(req, limite) {
  let buf;
  if (req.body !== undefined) {
    const b = req.body;
    buf = b == null ? Buffer.alloc(0)
      : Buffer.isBuffer(b) ? b
      : typeof b === 'string' ? Buffer.from(b)
      : Buffer.from(JSON.stringify(b));
  } else {
    buf = await new Promise((resolve, reject) => {
      const partes = [];
      let total = 0;
      req.on('data', (c) => {
        total += c.length;
        if (total > limite) {
          reject(new HttpError(413, 'Arquivo grande demais.'));
          req.destroy();
          return;
        }
        partes.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(partes)));
      req.on('error', reject);
    });
  }
  if (buf.length > limite) throw new HttpError(413, 'Arquivo grande demais.');
  return buf;
}

export async function lerJson(req) {
  const buf = await lerCorpo(req, 1024 * 1024);
  if (!buf.length) return {};
  try {
    return JSON.parse(buf.toString('utf8'));
  } catch {
    throw new HttpError(400, 'JSON inválido.');
  }
}

// Rotas no formato '/ss/:id' → regex com parâmetros nomeados.
export function compilarRota(padrao) {
  const re = padrao.replace(/:(\w+)/g, '(?<$1>[^/]+)');
  return new RegExp(`^${re}$`);
}
