import crypto from 'node:crypto';
import { q, q1 } from './db.js';

const COOKIE = 'halo_ss';
const DIAS_SESSAO = 30;

export function hashSenha(senha) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(senha, salt, 64);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

export function conferirSenha(senha, hash) {
  const [alg, saltHex, keyHex] = String(hash).split('$');
  if (alg !== 'scrypt') return false;
  const key = Buffer.from(keyHex, 'hex');
  const tentativa = crypto.scryptSync(senha, Buffer.from(saltHex, 'hex'), key.length);
  return crypto.timingSafeEqual(key, tentativa);
}

// Mesmo custo de scrypt quando o e-mail não existe: não revela quais e-mails estão cadastrados.
const HASH_FALSO = hashSenha(crypto.randomBytes(16).toString('hex'));
export const conferirFalso = (senha) => conferirSenha(senha, HASH_FALSO);

export function validarSenha(senha) {
  if (typeof senha !== 'string' || senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
  return null;
}

const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');

function lerCookie(req) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

const seguro = (req) => req.headers['x-forwarded-proto'] === 'https' || !!process.env.VERCEL;

// O cookie vale só para /ss: nunca é enviado ao restante do site.
function cookie(req, valor, maxAge) {
  return [`${COOKIE}=${valor}`, 'Path=/ss', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`, seguro(req) ? 'Secure' : '']
    .filter(Boolean).join('; ');
}

export async function criarSessao(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await q(`INSERT INTO ss_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '${DIAS_SESSAO} days')`,
    [sha(token), userId]);
  res.setHeader('Set-Cookie', cookie(req, token, DIAS_SESSAO * 86400));
}

export async function encerrarSessao(req, res) {
  const token = lerCookie(req);
  if (token) await q('DELETE FROM ss_sessions WHERE token_hash = $1', [sha(token)]);
  res.setHeader('Set-Cookie', cookie(req, '', 0));
}

export async function usuarioDaSessao(req) {
  const token = lerCookie(req);
  if (!token) return null;
  return q1(`
    SELECT u.id, u.name, u.email, u.role
      FROM ss_sessions s JOIN ss_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active`, [sha(token)]);
}

// Limite de tentativas de login: 10 erros em 15 min por IP e por e-mail.
// Fica no banco porque as funções da Vercel não compartilham memória.
export function ipDe(req) {
  return req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '?';
}

export async function bloqueado(chaves) {
  const r = await q1('SELECT 1 AS b FROM ss_login_falhas WHERE chave = ANY($1) AND ate > now() AND n >= 10', [chaves]);
  return !!r;
}

export async function registrarFalha(chaves) {
  for (const c of chaves) {
    await q(`
      INSERT INTO ss_login_falhas (chave, n, ate) VALUES ($1, 1, now() + interval '15 minutes')
      ON CONFLICT (chave) DO UPDATE SET
        n   = CASE WHEN ss_login_falhas.ate <= now() THEN 1 ELSE ss_login_falhas.n + 1 END,
        ate = CASE WHEN ss_login_falhas.ate <= now() THEN now() + interval '15 minutes' ELSE ss_login_falhas.ate END`, [c]);
  }
}

export async function limparFalhas(chaves) {
  await q('DELETE FROM ss_login_falhas WHERE chave = ANY($1) OR ate < now() - interval \'1 day\'', [chaves]);
}

export async function limparSessoesVencidas() {
  await q('DELETE FROM ss_sessions WHERE expires_at <= now()');
}
