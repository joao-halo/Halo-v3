import { q, q1, encerrarSSVencidas } from './db.js';
import { falha, lerJson, lerCorpo } from './http.js';
import {
  hashSenha, conferirSenha, conferirFalso, validarSenha, criarSessao, encerrarSessao,
  ipDe, bloqueado, registrarFalha, limparFalhas, limparSessoesVencidas,
} from './auth.js';
import { hoje, horaAgora, minutos, HORA_RE, DATA_RE } from './tempo.js';
import * as arquivos from './arquivos.js';
import { gerarPdf } from './pdf.js';

export const CLIMAS = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvoso'];
const MAX_FOTOS = 80;
// Limite de corpo das funções da Vercel é 4,5 MB; o app reduz as fotos a ~0,3–1 MB.
const MAX_FOTO_BYTES = 4 * 1024 * 1024;

const id = (p) => Number.parseInt(p, 10) || falha(404, 'Não encontrado.');

async function registrar(ssId, userId, action, detail = '') {
  await q('INSERT INTO ss_log (ss_id, user_id, action, detail) VALUES ($1, $2, $3, $4)', [ssId, userId, action, detail]);
}

// O salvamento automático dispara várias edições seguidas; elas viram uma só
// linha no histórico enquanto a mesma pessoa continuar editando (10 min).
async function registrarEdicao(ssId, userId, campos) {
  const ult = await q1('SELECT * FROM ss_log WHERE ss_id = $1 ORDER BY id DESC LIMIT 1', [ssId]);
  if (ult && ult.action === 'editada' && ult.user_id === userId
      && Date.now() - new Date(ult.at).getTime() < 10 * 60 * 1000) {
    const todos = [...new Set([...ult.detail.split(', ').filter(Boolean), ...campos])];
    await q('UPDATE ss_log SET at = now(), detail = $1 WHERE id = $2', [todos.join(', '), ult.id]);
  } else {
    await registrar(ssId, userId, 'editada', campos.join(', '));
  }
}

async function buscarSS(ssId) {
  await encerrarSSVencidas();
  const ss = await q1(`
    SELECT s.*, c.name AS created_by_name, e.name AS updated_by_name
      FROM ss_fichas s
      LEFT JOIN ss_users c ON c.id = s.created_by
      LEFT JOIN ss_users e ON e.id = s.updated_by
     WHERE s.id = $1`, [ssId]);
  if (!ss) falha(404, 'SS não encontrada.');
  ss.activities = JSON.parse(ss.activities);
  ss.photos = await q('SELECT id, caption, created_at FROM ss_photos WHERE ss_id = $1 ORDER BY id', [ssId]);
  return ss;
}

function conferirVersao(ss, versao) {
  if (versao !== undefined && Number(versao) !== ss.version) {
    falha(409, 'Esta SS foi alterada por outra pessoa enquanto você editava. Os dados foram recarregados.');
  }
}

function texto(v, max, campo) {
  if (v === null || v === undefined) return '';
  if (typeof v !== 'string') falha(400, `Campo inválido: ${campo}.`);
  if (v.length > max) falha(400, `Texto longo demais em ${campo} (máx. ${max} caracteres).`);
  return v.trim();
}

const CAMPOS_TEXTO = {
  client: [200, 'Cliente / obra'],
  address: [500, 'Endereço'],
  team: [500, 'Equipe'],
  other_activity: [300, 'Outras atividades'],
  description: [10000, 'Descrição'],
  notes: [5000, 'Observações'],
};

const NOME_CAMPO = {
  ...Object.fromEntries(Object.entries(CAMPOS_TEXTO).map(([k, [, n]]) => [k, n])),
  weather: 'Clima', activities: 'Atividades', lat: 'Localização', lng: 'Localização',
};

// ---------------------------------------------------------------- sessão

async function login({ req, res }) {
  const { email, password } = await lerJson(req);
  const mail = String(email || '').trim().toLowerCase();
  const chaves = [`ip:${ipDe(req)}`, `email:${mail}`];
  if (await bloqueado(chaves)) falha(429, 'Muitas tentativas. Aguarde 15 minutos e tente de novo.');
  const u = await q1('SELECT * FROM ss_users WHERE email = $1 AND active', [mail]);
  const ok = u ? conferirSenha(String(password || ''), u.password_hash) : conferirFalso(String(password || ''));
  if (!ok) {
    await registrarFalha(chaves);
    falha(401, 'E-mail ou senha incorretos.');
  }
  await limparFalhas(chaves);
  await limparSessoesVencidas();
  await criarSessao(req, res, u.id);
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

async function logout({ req, res }) {
  await encerrarSessao(req, res);
  return { ok: true };
}

const eu = ({ user }) => ({ ...user, today: hoje(), now: horaAgora() });

async function trocarSenha({ req, user }) {
  const { current, password } = await lerJson(req);
  const u = await q1('SELECT password_hash FROM ss_users WHERE id = $1', [user.id]);
  if (!conferirSenha(String(current || ''), u.password_hash)) falha(400, 'Senha atual incorreta.');
  const erro = validarSenha(password);
  if (erro) falha(400, erro);
  await q('UPDATE ss_users SET password_hash = $1 WHERE id = $2', [hashSenha(password), user.id]);
  return { ok: true };
}

// ---------------------------------------------------------------- usuários (admin)

const listarUsuarios = () =>
  q('SELECT id, name, email, role, active, created_at FROM ss_users ORDER BY active DESC, name');

async function criarUsuario({ req }) {
  const b = await lerJson(req);
  const name = texto(b.name, 120, 'Nome');
  const email = texto(b.email, 200, 'E-mail').toLowerCase();
  if (!name) falha(400, 'Informe o nome.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) falha(400, 'E-mail inválido.');
  const erro = validarSenha(b.password);
  if (erro) falha(400, erro);
  const role = b.role === 'admin' ? 'admin' : 'tecnico';
  if (await q1('SELECT 1 FROM ss_users WHERE email = $1', [email])) falha(409, 'Já existe um usuário com esse e-mail.');
  const r = await q1('INSERT INTO ss_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, email, hashSenha(b.password), role]);
  return { id: r.id };
}

async function editarUsuario({ req, params, user }) {
  const uid = id(params.id);
  const b = await lerJson(req);
  const alvo = await q1('SELECT * FROM ss_users WHERE id = $1', [uid]) || falha(404, 'Usuário não encontrado.');
  if (uid === user.id && (b.active === false || b.role === 'tecnico')) {
    falha(400, 'Você não pode desativar nem rebaixar a própria conta.');
  }
  const name = b.name !== undefined ? texto(b.name, 120, 'Nome') || falha(400, 'Informe o nome.') : alvo.name;
  const role = b.role === 'admin' || b.role === 'tecnico' ? b.role : alvo.role;
  const active = b.active === undefined ? alvo.active : !!b.active;
  await q('UPDATE ss_users SET name = $1, role = $2, active = $3 WHERE id = $4', [name, role, active, uid]);
  if (b.password) {
    const erro = validarSenha(b.password);
    if (erro) falha(400, erro);
    await q('UPDATE ss_users SET password_hash = $1 WHERE id = $2', [hashSenha(b.password), uid]);
  }
  if (b.password || !active) await q('DELETE FROM ss_sessions WHERE user_id = $1', [uid]);
  return { ok: true };
}

// ---------------------------------------------------------------- atividades

const listarAtividades = ({ query }) =>
  q(`SELECT id, name, active FROM ss_activities ${query.get('todas') === '1' ? '' : 'WHERE active'} ORDER BY sort, name`);

async function criarAtividade({ req }) {
  const name = texto((await lerJson(req)).name, 120, 'Atividade');
  if (!name) falha(400, 'Informe o nome da atividade.');
  if (await q1('SELECT 1 FROM ss_activities WHERE lower(name) = lower($1)', [name])) falha(409, 'Essa atividade já existe.');
  await q('INSERT INTO ss_activities (name, sort) SELECT $1, COALESCE(MAX(sort), 0) + 1 FROM ss_activities', [name]);
  return { ok: true };
}

async function editarAtividade({ req, params }) {
  const b = await lerJson(req);
  await q('UPDATE ss_activities SET active = $1 WHERE id = $2', [!!b.active, id(params.id)]);
  return { ok: true };
}

// ---------------------------------------------------------------- SS

async function listarSS({ query }) {
  await encerrarSSVencidas();
  const where = [];
  const args = [];
  const p = (v) => { args.push(v); return `$${args.length}`; };
  const de = query.get('de');
  const ate = query.get('ate');
  if (de && DATA_RE.test(de)) where.push(`s.date >= ${p(de)}`);
  if (ate && DATA_RE.test(ate)) where.push(`s.date <= ${p(ate)}`);
  if (Number(query.get('usuario'))) where.push(`s.created_by = ${p(Number(query.get('usuario')))}`);
  if (query.get('status') === 'aberta') where.push("s.status = 'aberta'");
  if (query.get('status') === 'encerrada') where.push("s.status IN ('encerrada', 'auto')");
  const busca = (query.get('q') || '').trim();
  if (busca) {
    const like = p(`%${busca.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
    where.push(`(s.number ILIKE ${like} OR s.client ILIKE ${like} OR s.address ILIKE ${like}
                 OR s.description ILIKE ${like} OR s.team ILIKE ${like})`);
  }
  const lista = await q(`
    SELECT s.id, s.number, s.date, s.start_time, s.end_time, s.status, s.client, s.address,
           s.activities, s.created_by, u.name AS created_by_name,
           (SELECT COUNT(*)::int FROM ss_photos f WHERE f.ss_id = s.id) AS photo_count
      FROM ss_fichas s LEFT JOIN ss_users u ON u.id = s.created_by
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY s.date DESC, s.start_time DESC, s.id DESC
     LIMIT 500`, args);
  for (const s of lista) s.activities = JSON.parse(s.activities);
  return lista;
}

async function criarSS({ user }) {
  const data = hoje();
  const inicio = horaAgora();
  const ano = Number(data.slice(0, 4));
  // Contador por ano numa instrução atômica: duas SS criadas ao mesmo tempo
  // nunca recebem o mesmo número.
  const { n } = await q1(`
    INSERT INTO ss_counters (year, n) VALUES ($1, 1)
    ON CONFLICT (year) DO UPDATE SET n = ss_counters.n + 1
    RETURNING n`, [ano]);
  const numero = `SS-${ano}-${String(n).padStart(4, '0')}`;
  const r = await q1(`
    INSERT INTO ss_fichas (number, date, start_time, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $4) RETURNING id`, [numero, data, inicio, user.id]);
  await registrar(r.id, user.id, 'criada', `Início registrado às ${inicio}`);
  return buscarSS(r.id);
}

async function verSS({ params }) {
  const ss = await buscarSS(id(params.id));
  ss.log = await q(`
    SELECT l.at, l.action, l.detail, u.name AS user_name
      FROM ss_log l LEFT JOIN ss_users u ON u.id = l.user_id
     WHERE l.ss_id = $1 ORDER BY l.id DESC LIMIT 50`, [ss.id]);
  return ss;
}

async function editarSS({ req, params, user }) {
  const ss = await buscarSS(id(params.id));
  const b = await lerJson(req);
  conferirVersao(ss, b.version);

  const sets = {};
  for (const [campo, [max, nome]] of Object.entries(CAMPOS_TEXTO)) {
    if (b[campo] !== undefined) sets[campo] = texto(b[campo], max, nome);
  }
  if (b.weather !== undefined) {
    if (b.weather && !CLIMAS.includes(b.weather)) falha(400, 'Clima inválido.');
    sets.weather = b.weather || '';
  }
  if (b.activities !== undefined) {
    if (!Array.isArray(b.activities) || b.activities.length > 50) falha(400, 'Atividades inválidas.');
    sets.activities = JSON.stringify([...new Set(b.activities.map((a) => texto(a, 120, 'Atividade')).filter(Boolean))]);
  }
  if (b.lat !== undefined || b.lng !== undefined) {
    const ok = (v, lim) => v === null || (typeof v === 'number' && Math.abs(v) <= lim);
    if (!ok(b.lat, 90) || !ok(b.lng, 180)) falha(400, 'Coordenadas inválidas.');
    sets.lat = b.lat;
    sets.lng = b.lng;
  }
  const campos = Object.keys(sets);
  if (!campos.length) return ss;

  // A condição de versão no próprio UPDATE evita sobrescrever uma edição
  // concorrente que chegue entre a leitura e a gravação.
  const vals = campos.map((c) => sets[c]);
  const r = await q1(`
    UPDATE ss_fichas SET ${campos.map((c, i) => `${c} = $${i + 1}`).join(', ')},
           version = version + 1, updated_by = $${vals.length + 1}, updated_at = now()
     WHERE id = $${vals.length + 2} AND version = $${vals.length + 3}
    RETURNING id`, [...vals, user.id, ss.id, ss.version]);
  if (!r) conferirVersao(ss, -1);
  await registrarEdicao(ss.id, user.id, [...new Set(campos.map((c) => NOME_CAMPO[c] || c))]);
  return buscarSS(ss.id);
}

async function encerrarSS({ req, params, user }) {
  const ss = await buscarSS(id(params.id));
  const { end_time: fim, version } = await lerJson(req);
  conferirVersao(ss, version);
  if (!HORA_RE.test(fim || '')) falha(400, 'Informe o horário de fim (HH:MM).');
  if (minutos(fim) <= minutos(ss.start_time)) falha(400, `O fim precisa ser depois do início (${ss.start_time}).`);
  // A SS cobre só o próprio dia: no dia de hoje, o fim não pode estar no futuro.
  if (ss.date === hoje() && minutos(fim) > minutos(horaAgora())) {
    falha(400, `O fim não pode ser depois de agora (${horaAgora()}).`);
  }
  const antes = ss.status === 'aberta' ? null : ss.end_time;
  await q(`
    UPDATE ss_fichas SET end_time = $1, status = 'encerrada', version = version + 1, updated_by = $2, updated_at = now()
     WHERE id = $3`, [fim, user.id, ss.id]);
  await registrar(ss.id, user.id, 'encerrada', antes ? `Fim alterado de ${antes} para ${fim}` : `Fim às ${fim}`);
  return buscarSS(ss.id);
}

async function reabrirSS({ req, params, user }) {
  const ss = await buscarSS(id(params.id));
  conferirVersao(ss, (await lerJson(req)).version);
  if (ss.date !== hoje()) falha(400, 'Só é possível reabrir uma SS no mesmo dia.');
  await q(`
    UPDATE ss_fichas SET end_time = NULL, status = 'aberta', version = version + 1, updated_by = $1, updated_at = now()
     WHERE id = $2`, [user.id, ss.id]);
  await registrar(ss.id, user.id, 'reaberta');
  return buscarSS(ss.id);
}

async function excluirSS({ params, user }) {
  const ss = await buscarSS(id(params.id));
  const fotos = await q('SELECT arquivo, mini FROM ss_photos WHERE ss_id = $1', [ss.id]);
  await q('DELETE FROM ss_fichas WHERE id = $1', [ss.id]);
  await arquivos.apagar(fotos.flatMap((f) => [f.arquivo, f.mini]));
  console.log(`${ss.number} excluída por ${user.email}`);
  return { ok: true };
}

const clientes = () => q(`
  SELECT MAX(client) AS client, MAX(address) AS address FROM ss_fichas
   WHERE client <> '' GROUP BY lower(client) ORDER BY MAX(date) DESC LIMIT 300`);

// ---------------------------------------------------------------- fotos

const ehJpeg = (buf) => buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;

async function enviarFoto({ req, params, user, query }) {
  const ss = await buscarSS(id(params.id));
  if (ss.photos.length >= MAX_FOTOS) falha(400, `Limite de ${MAX_FOTOS} fotos por SS.`);
  const buf = await lerCorpo(req, MAX_FOTO_BYTES);
  if (!ehJpeg(buf)) falha(415, 'Envie a foto em JPEG.');
  const nome = await arquivos.salvar(ss.id, buf);
  const caption = texto(query.get('legenda') || '', 300, 'Legenda');
  const r = await q1('INSERT INTO ss_photos (ss_id, arquivo, caption, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING id',
    [ss.id, nome, caption, user.id]);
  await q('UPDATE ss_fichas SET updated_by = $1, updated_at = now() WHERE id = $2', [user.id, ss.id]);
  await registrarEdicao(ss.id, user.id, ['Fotos']);
  return { id: r.id };
}

async function fotoOuFalha(fid) {
  return await q1('SELECT * FROM ss_photos WHERE id = $1', [fid]) || falha(404, 'Foto não encontrada.');
}

async function enviarMiniatura({ req, params }) {
  const foto = await fotoOuFalha(id(params.id));
  const buf = await lerCorpo(req, 1024 * 1024);
  if (!ehJpeg(buf)) falha(415, 'Envie a miniatura em JPEG.');
  const nome = await arquivos.salvar(foto.ss_id, buf);
  await q('UPDATE ss_photos SET mini = $1 WHERE id = $2', [nome, foto.id]);
  await arquivos.apagar([foto.mini]);
  return { ok: true };
}

async function verFoto({ params, query, res }) {
  const foto = await fotoOuFalha(id(params.id));
  const querMini = query.get('mini') === '1';
  const buf = await arquivos.ler(querMini && foto.mini ? foto.mini : foto.arquivo);
  if (!buf) falha(404, 'Arquivo da foto não encontrado.');
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': buf.length,
    // A miniatura pode chegar depois da foto; enquanto não chega, não guardar em cache.
    'Cache-Control': querMini && !foto.mini ? 'no-store' : 'private, max-age=31536000, immutable',
  });
  res.end(buf);
}

async function editarFoto({ req, params, user }) {
  const foto = await fotoOuFalha(id(params.id));
  const caption = texto((await lerJson(req)).caption, 300, 'Legenda');
  await q('UPDATE ss_photos SET caption = $1 WHERE id = $2', [caption, foto.id]);
  await registrarEdicao(foto.ss_id, user.id, ['Legendas']);
  return { ok: true };
}

async function excluirFoto({ params, user }) {
  const foto = await fotoOuFalha(id(params.id));
  await q('DELETE FROM ss_photos WHERE id = $1', [foto.id]);
  await arquivos.apagar([foto.arquivo, foto.mini]);
  await registrar(foto.ss_id, user.id, 'foto removida');
  return { ok: true };
}

// ---------------------------------------------------------------- PDF

async function baixarPdf({ params, res }) {
  const ss = await buscarSS(id(params.id));
  const fotos = await q('SELECT id, arquivo, caption FROM ss_photos WHERE ss_id = $1 ORDER BY id', [ss.id]);
  ss.photos = await Promise.all(fotos.map(async (f) => ({ ...f, imagem: await arquivos.ler(f.arquivo) })));
  const nome = `${ss.number}${ss.client ? ` - ${ss.client}` : ''}.pdf`.replace(/[\\/:*?"<>|\r\n]/g, '-');
  const pdf = await gerarPdf(ss);
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="${nome.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(nome)}`,
    'Cache-Control': 'no-store',
    'Content-Length': pdf.length,
  });
  res.end(pdf);
}

// ---------------------------------------------------------------- tabela de rotas
// Caminhos relativos a /ss/api. acesso: 'publico' | 'usuario' | 'admin'

export const rotas = [
  ['POST', '/login', login, 'publico'],
  ['POST', '/logout', logout, 'publico'],
  ['GET', '/eu', eu, 'usuario'],
  ['POST', '/eu/senha', trocarSenha, 'usuario'],

  ['GET', '/usuarios', listarUsuarios, 'admin'],
  ['POST', '/usuarios', criarUsuario, 'admin'],
  ['GET', '/usuarios/nomes', () => q('SELECT id, name FROM ss_users ORDER BY name'), 'usuario'],
  ['PATCH', '/usuarios/:id', editarUsuario, 'admin'],

  ['GET', '/atividades', listarAtividades, 'usuario'],
  ['POST', '/atividades', criarAtividade, 'admin'],
  ['PATCH', '/atividades/:id', editarAtividade, 'admin'],

  ['GET', '/clientes', clientes, 'usuario'],
  ['GET', '/ss', listarSS, 'usuario'],
  ['POST', '/ss', criarSS, 'usuario'],
  ['GET', '/ss/:id', verSS, 'usuario'],
  ['PATCH', '/ss/:id', editarSS, 'usuario'],
  ['DELETE', '/ss/:id', excluirSS, 'admin'],
  ['POST', '/ss/:id/encerrar', encerrarSS, 'usuario'],
  ['POST', '/ss/:id/reabrir', reabrirSS, 'usuario'],
  ['GET', '/ss/:id/pdf', baixarPdf, 'usuario'],
  ['POST', '/ss/:id/fotos', enviarFoto, 'usuario'],

  ['GET', '/fotos/:id', verFoto, 'usuario'],
  ['PUT', '/fotos/:id/mini', enviarMiniatura, 'usuario'],
  ['PATCH', '/fotos/:id', editarFoto, 'usuario'],
  ['DELETE', '/fotos/:id', excluirFoto, 'usuario'],
];
