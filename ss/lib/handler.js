// Despacha uma requisição de /ss/api/* para a rota certa. Usado pela função
// da Vercel (api/ss.js) e pelo servidor local (ss/dev.mjs).
import { usuarioDaSessao } from './auth.js';
import { rotas } from './api.js';
import { HttpError, enviarJson, compilarRota } from './http.js';

const tabela = rotas.map(([metodo, padrao, fn, acesso]) => ({ metodo, re: compilarRota(padrao), fn, acesso }));

async function despachar(req, res, rota, query) {
  // Proteção contra CSRF: toda alteração precisa do cabeçalho X-Halo, que um
  // site de terceiros não consegue enviar sem uma liberação de CORS (que não existe).
  if (req.method !== 'GET' && req.headers['x-halo'] !== '1') throw new HttpError(403, 'Requisição recusada.');
  let metodoErrado = false;
  for (const r of tabela) {
    const m = r.re.exec(rota);
    if (!m) continue;
    if (r.metodo !== req.method) { metodoErrado = true; continue; }
    const user = r.acesso === 'publico' ? null : await usuarioDaSessao(req);
    if (r.acesso !== 'publico' && !user) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
    if (r.acesso === 'admin' && user.role !== 'admin') throw new HttpError(403, 'Apenas administradores.');
    const out = await r.fn({ req, res, query, params: m.groups || {}, user });
    if (!res.headersSent && out !== undefined) enviarJson(res, 200, out);
    return;
  }
  throw new HttpError(metodoErrado ? 405 : 404, 'Rota não encontrada.');
}

export async function tratar(req, res, rota, query) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  try {
    await despachar(req, res, rota, query);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status === 500) console.error(new Date().toISOString(), req.method, rota, e);
    if (!res.headersSent) enviarJson(res, status, { error: status === 500 ? 'Erro interno no servidor.' : e.message });
    else res.destroy();
  }
}
