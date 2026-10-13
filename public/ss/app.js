// Halo SS — app de página única (sem build). Rotas por hash: #/login, #/, #/ss/:id, #/equipe, #/conta

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');

const ICONE = {
  voltar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  pino: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
};

const STATUS = { aberta: 'Em andamento', encerrada: 'Encerrada', auto: 'Encerrada às 23:59 (auto)' };
const CLIMAS = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvoso'];
const statusHtml = (s) => `<span class="status status-${s}">${STATUS[s]}</span>`;

let eu = null;
let limparTela = null; // função de saída da tela atual (timers, salvamentos pendentes)

// ------------------------------------------------------------ utilidades

const armazenamento = {
  ler(k) { try { return JSON.parse(localStorage.getItem(`halo-ss:${k}`)); } catch { return null; } },
  gravar(k, v) { try { localStorage.setItem(`halo-ss:${k}`, JSON.stringify(v)); } catch { /* modo privado */ } },
};

class ErroApi extends Error {
  constructor(status, msg) { super(msg); this.status = status; }
}

async function api(metodo, url, corpo, { semRedirecionar = false } = {}) {
  const headers = { 'X-Halo': '1' };
  let body;
  if (corpo instanceof Blob) { body = corpo; headers['Content-Type'] = 'image/jpeg'; }
  else if (corpo !== undefined) { body = JSON.stringify(corpo); headers['Content-Type'] = 'application/json'; }
  let r;
  try {
    r = await fetch(url, { method: metodo, headers, body, credentials: 'same-origin' });
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }
  const dados = (r.headers.get('content-type') || '').includes('json') ? await r.json() : null;
  if (r.status === 401 && !semRedirecionar && url !== '/ss/api/login') {
    eu = null;
    irPara('#/login');
  }
  if (!r.ok) throw new ErroApi(r.status, dados?.error || `Erro ${r.status}`);
  return dados;
}

function toast(msg, erro = false) {
  const t = document.createElement('div');
  t.className = `toast${erro ? ' erro-t' : ''}`;
  t.textContent = msg;
  $('#toasts').append(t);
  setTimeout(() => t.remove(), erro ? 6000 : 3000);
}

function confirmar(titulo, texto, ok = 'Confirmar', cancelar = 'Cancelar') {
  const d = $('#dialogo');
  $('#dialogo-titulo').textContent = titulo;
  $('#dialogo-texto').textContent = texto;
  $('#dialogo-ok').textContent = ok;
  d.querySelector('button[value="nao"]').textContent = cancelar;
  d.returnValue = '';
  d.showModal();
  return new Promise((r) => d.addEventListener('close', () => r(d.returnValue === 'sim'), { once: true }));
}

const irPara = (h) => { if (location.hash !== h) location.hash = h; else rotear(); };
const dataBR = (iso) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');
const horaLocal = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
function somarDias(iso, n) {
  const [a, m, d] = iso.split('-').map(Number);
  const dt = new Date(a, m - 1, d + n);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}
function rotuloDia(iso) {
  if (iso === eu.today) return 'Hoje';
  if (iso === somarDias(eu.today, -1)) return 'Ontem';
  return new Date(`${iso}T12:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}
function duracao(ini, fim) {
  if (!ini || !fim) return '—';
  const m = (h) => h.split(':').reduce((a, b) => a * 60 + Number(b));
  const t = m(fim) - m(ini);
  return `${Math.floor(t / 60)}h${pad(t % 60)}`;
}
const quandoBR = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

async function baixarPdf(ss) {
  try {
    const r = await fetch(`/ss/api/ss/${ss.id}/pdf`, { credentials: 'same-origin' });
    if (!r.ok) throw new Error();
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ss.number}${ss.client ? ` - ${ss.client}` : ''}.pdf`.replace(/[\\/:*?"<>|]/g, '-');
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch {
    toast('Não foi possível gerar o PDF.', true);
  }
}

// ------------------------------------------------------------ roteador

const ROTAS = [
  [/^#\/login$/, telaLogin],
  [/^#\/?$/, telaLista],
  [/^#\/ss\/(\d+)$/, telaSS],
  [/^#\/equipe$/, telaEquipe],
  [/^#\/conta$/, telaConta],
];

async function rotear() {
  if (limparTela) { await limparTela(); limparTela = null; }
  const h = location.hash || '#/';
  if (!eu && h !== '#/login') {
    try {
      eu = await api('GET', '/ss/api/eu', undefined, { semRedirecionar: true });
    } catch {
      return irPara('#/login');
    }
  }
  const logado = !!eu && h !== '#/login';
  $('#topo').hidden = !logado;
  if (logado) {
    $$('[data-admin]').forEach((e) => { e.hidden = eu.role !== 'admin'; });
    $('#nav-conta').textContent = eu.name.split(' ')[0];
  }
  const nav = h.startsWith('#/equipe') ? 'equipe' : h.startsWith('#/conta') ? 'conta' : 'lista';
  $$('[data-nav]').forEach((a) => a.classList.toggle('ativo', a.dataset.nav === nav));
  app.className = 'app';
  window.scrollTo(0, 0);
  for (const [re, fn] of ROTAS) {
    const m = h.match(re);
    if (m) {
      try { await fn(...m.slice(1)); } catch (e) {
        if (e.status !== 401) app.innerHTML = `<div class="vazio"><p>${esc(e.message)}</p><a class="btn btn-sec" href="#/">Voltar à lista</a></div>`;
      }
      return;
    }
  }
  irPara('#/');
}
window.addEventListener('hashchange', rotear);

// ------------------------------------------------------------ login

function telaLogin() {
  eu = null;
  app.innerHTML = `
    <div class="login"><form class="login-caixa" id="f-login" novalidate>
      <img src="/ss/icons/logo.svg" alt="Halo">
      <h1>Solicitações de Serviço</h1>
      <p>Entre com o login fornecido pela Halo.</p>
      <div class="campo"><label class="rotulo" for="email">E-mail</label>
        <input id="email" type="email" autocomplete="username" inputmode="email" required></div>
      <div class="campo"><label class="rotulo" for="senha">Senha</label>
        <input id="senha" type="password" autocomplete="current-password" required></div>
      <button class="btn">Entrar</button>
      <p class="erro" id="erro-login" hidden></p>
    </form></div>`;
  $('#email').focus();
  $('#f-login').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = ev.target.querySelector('button');
    btn.disabled = true;
    try {
      await api('POST', '/ss/api/login', { email: $('#email').value, password: $('#senha').value });
      eu = await api('GET', '/ss/api/eu');
      irPara('#/');
    } catch (e) {
      const el = $('#erro-login');
      el.textContent = e.message;
      el.hidden = false;
      btn.disabled = false;
    }
  });
}

// ------------------------------------------------------------ lista

let nomesUsuarios = null;

function intervalo(f) {
  const t = eu.today;
  switch (f.periodo) {
    case 'hoje': return [t, t];
    case '7': return [somarDias(t, -6), t];
    case 'mes': return [`${t.slice(0, 8)}01`, t];
    case 'todos': return ['', ''];
    case 'personalizado': return [f.de || '', f.ate || ''];
    default: return [somarDias(t, -29), t];
  }
}

async function telaLista() {
  const f = { q: '', periodo: '30', usuario: '', status: '', de: '', ate: '', ...armazenamento.ler('filtros') };
  nomesUsuarios ??= await api('GET', '/ss/api/usuarios/nomes');

  app.innerHTML = `
    <div class="cab-pagina">
      <div><h1>Solicitações de Serviço</h1><p>Relatórios diários de obra da equipe.</p></div>
      <button class="btn btn-nova" data-acao="nova">${ICONE.mais}Nova SS</button>
    </div>
    <div id="aviso-hoje"></div>
    <div class="filtros">
      <input class="busca" type="search" id="f-q" placeholder="Buscar cliente, endereço, nº, descrição…" value="${esc(f.q)}">
      <select id="f-periodo" aria-label="Período">
        ${[['hoje', 'Hoje'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['mes', 'Este mês'], ['todos', 'Todo o período'], ['personalizado', 'Escolher datas…']]
          .map(([v, t]) => `<option value="${v}" ${f.periodo === v ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <select id="f-usuario" aria-label="Responsável">
        <option value="">Toda a equipe</option>
        ${nomesUsuarios.map((u) => `<option value="${u.id}" ${String(f.usuario) === String(u.id) ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}
      </select>
      <select id="f-status" aria-label="Situação">
        <option value="">Todas as situações</option>
        <option value="aberta" ${f.status === 'aberta' ? 'selected' : ''}>Em andamento</option>
        <option value="encerrada" ${f.status === 'encerrada' ? 'selected' : ''}>Encerradas</option>
      </select>
    </div>
    <div class="filtros-datas" id="f-datas" ${f.periodo === 'personalizado' ? '' : 'hidden'}>
      <input type="date" id="f-de" value="${esc(f.de)}" aria-label="De">
      <input type="date" id="f-ate" value="${esc(f.ate)}" aria-label="Até">
    </div>
    <div id="resultado"><p class="contagem">Carregando…</p></div>
    <button class="btn fab" data-acao="nova">${ICONE.mais}Nova SS</button>`;

  async function carregar() {
    const [de, ate] = intervalo(f);
    const p = new URLSearchParams({ de, ate, usuario: f.usuario, status: f.status, q: f.q });
    let lista, minhas;
    try {
      [lista, minhas] = await Promise.all([
        api('GET', `/ss/api/ss?${p}`),
        api('GET', `/ss/api/ss?de=${eu.today}&ate=${eu.today}&usuario=${eu.id}&status=aberta`),
      ]);
    } catch (e) {
      $('#resultado').innerHTML = `<p class="contagem">${esc(e.message)}</p>`;
      return;
    }
    $('#aviso-hoje').innerHTML = minhas.length ? `
      <div class="aviso-hoje"><div><b>${esc(minhas[0].number)}</b> em andamento desde ${minhas[0].start_time}
        ${minhas[0].client ? `· ${esc(minhas[0].client)}` : ''}<br><span class="mudo">Lembre de encerrar ao fim do dia (fecha sozinha às 23:59).</span></div>
        <a class="btn btn-peq" href="#/ss/${minhas[0].id}">Continuar</a></div>` : '';
    renderLista(lista);
  }

  function renderLista(lista) {
    if (!lista.length) {
      $('#resultado').innerHTML = '<div class="vazio"><p>Nenhuma SS encontrada com esses filtros.</p></div>';
      return;
    }
    const ativ = (s) => esc(s.activities.slice(0, 3).join(' · ') + (s.activities.length > 3 ? ` +${s.activities.length - 3}` : ''));
    const horario = (s) => `${s.start_time}–${s.end_time || '…'}`;
    let dia = '';
    const cards = lista.map((s) => {
      const cab = s.date !== dia ? `<div class="dia-titulo">${esc(rotuloDia(s.date))}</div>` : '';
      dia = s.date;
      return `${cab}<a class="card-ss" href="#/ss/${s.id}">
        <div class="l1"><span class="cliente">${esc(s.client || 'Sem cliente informado')}</span>${statusHtml(s.status)}</div>
        <div class="meta"><span class="mono">${esc(s.number)}</span> · ${horario(s)} · ${esc(s.created_by_name || '')}</div>
        ${s.activities.length ? `<div class="meta">${ativ(s)}</div>` : ''}
        ${s.photo_count ? `<div class="meta">${s.photo_count} foto(s)</div>` : ''}
      </a>`;
    }).join('');
    $('#resultado').innerHTML = `
      <p class="contagem">${lista.length}${lista.length === 500 ? '+' : ''} SS</p>
      <div class="tabela-wrap"><table class="tabela">
        <thead><tr><th>Nº</th><th>Data</th><th>Cliente / Obra</th><th>Responsável</th><th>Horário</th><th>Atividades</th><th>Fotos</th><th>Situação</th><th></th></tr></thead>
        <tbody>${lista.map((s) => `
          <tr data-id="${s.id}">
            <td class="num">${esc(s.number)}</td>
            <td>${dataBR(s.date)}</td>
            <td>${esc(s.client || '—')}<span class="sub">${esc(s.address.split('\n')[0])}</span></td>
            <td>${esc(s.created_by_name || '')}</td>
            <td class="mono">${horario(s)}</td>
            <td class="ativ-resumo">${ativ(s)}</td>
            <td>${s.photo_count}</td>
            <td>${statusHtml(s.status)}</td>
            <td><button class="btn btn-sec btn-peq" data-pdf="${s.id}" title="Baixar PDF">${ICONE.pdf}PDF</button></td>
          </tr>`).join('')}</tbody>
      </table></div>
      <div class="cards-ss">${cards}</div>`;
    $$('.tabela tbody tr').forEach((tr) => tr.addEventListener('click', (ev) => {
      const pdf = ev.target.closest('[data-pdf]');
      if (pdf) baixarPdf(lista.find((s) => String(s.id) === pdf.dataset.pdf));
      else irPara(`#/ss/${tr.dataset.id}`);
    }));
  }

  let atraso;
  const aplicar = () => { armazenamento.gravar('filtros', f); carregar(); };
  $('#f-q').addEventListener('input', (e) => { f.q = e.target.value; clearTimeout(atraso); atraso = setTimeout(aplicar, 350); });
  $('#f-periodo').addEventListener('change', (e) => {
    f.periodo = e.target.value;
    $('#f-datas').hidden = f.periodo !== 'personalizado';
    aplicar();
  });
  $('#f-usuario').addEventListener('change', (e) => { f.usuario = e.target.value; aplicar(); });
  $('#f-status').addEventListener('change', (e) => { f.status = e.target.value; aplicar(); });
  $('#f-de').addEventListener('change', (e) => { f.de = e.target.value; aplicar(); });
  $('#f-ate').addEventListener('change', (e) => { f.ate = e.target.value; aplicar(); });
  $$('[data-acao="nova"]').forEach((b) => b.addEventListener('click', novaSS));

  await carregar();
  // No Mac a lista costuma ficar aberta: atualiza sozinha a cada minuto.
  const relogio = setInterval(() => { if (!document.hidden) carregar(); }, 60000);
  limparTela = () => clearInterval(relogio);
}

async function novaSS() {
  try {
    const abertas = await api('GET', `/ss/api/ss?de=${eu.today}&ate=${eu.today}&usuario=${eu.id}&status=aberta`);
    if (abertas.length) {
      const outra = await confirmar('Você já tem uma SS aberta hoje',
        `A ${abertas[0].number} está em andamento desde ${abertas[0].start_time}. Quer continuar nela ou abrir uma nova SS (outra obra)?`,
        'Abrir nova SS', 'Continuar a atual');
      if (!outra) return irPara(`#/ss/${abertas[0].id}`);
    } else {
      const ok = await confirmar('Iniciar nova SS?',
        `O horário de início será registrado agora (${horaLocal()}) e não poderá ser alterado.`, 'Iniciar SS');
      if (!ok) return;
    }
    const ss = await api('POST', '/ss/api/ss');
    irPara(`#/ss/${ss.id}`);
  } catch (e) {
    toast(e.message, true);
  }
}

// ------------------------------------------------------------ SS (ficha)

async function telaSS(id) {
  app.className = 'app estreito';
  let [ss, atividades, clientes] = await Promise.all([
    api('GET', `/ss/api/ss/${id}`), api('GET', '/ss/api/atividades'), api('GET', '/ss/api/clientes'),
  ]);

  // ---- salvamento automático (fila com uma requisição por vez)
  let pendentes = {};
  let emVoo = null;
  let timer = null;
  let enviandoFotos = 0;

  const indicador = (classe, txt) => { const el = $('#salvo'); if (el) { el.className = `salvo ${classe}`; el.textContent = txt; } };

  function agendar(campos) {
    Object.assign(pendentes, campos);
    indicador('salvando', 'Salvando…');
    clearTimeout(timer);
    timer = setTimeout(salvarAgora, 800);
  }

  async function salvarAgora() {
    clearTimeout(timer);
    while (emVoo) await emVoo;
    if (!Object.keys(pendentes).length) return;
    const corpo = { ...pendentes, version: ss.version };
    pendentes = {};
    emVoo = (async () => {
      try {
        const novo = await api('PATCH', `/ss/api/ss/${ss.id}`, corpo);
        ss = { ...ss, version: novo.version, updated_at: novo.updated_at };
        indicador('', 'Salvo');
      } catch (e) {
        if (e.status === 409) {
          toast(e.message, true);
          ss = await api('GET', `/ss/api/ss/${ss.id}`);
          render();
        } else {
          delete corpo.version;
          pendentes = { ...corpo, ...pendentes };
          indicador('falhou', 'Não salvo · tentando de novo');
          timer = setTimeout(salvarAgora, 5000);
        }
      } finally {
        emVoo = null;
      }
    })();
    await emVoo;
  }

  const avisarSaida = (ev) => {
    if (Object.keys(pendentes).length || emVoo || enviandoFotos) { ev.preventDefault(); ev.returnValue = ''; }
  };
  window.addEventListener('beforeunload', avisarSaida);
  limparTela = async () => {
    window.removeEventListener('beforeunload', avisarSaida);
    await salvarAgora();
  };

  // ---- render
  function render() {
    const nomesAtiv = [...new Set([...atividades.map((a) => a.name), ...ss.activities])];
    app.innerHTML = `
      <div class="cab-ss">
        <a href="#/" class="btn btn-sec btn-icone" aria-label="Voltar à lista">${ICONE.voltar}</a>
        <div class="titulo"><b>${esc(ss.number)}</b><span id="status-cab">${statusHtml(ss.status)}</span> <span class="salvo" id="salvo"></span></div>
        <button class="btn btn-sec btn-peq" data-acao="pdf">${ICONE.pdf}PDF</button>
      </div>

      <section class="card" id="jornada"></section>

      <section class="card">
        <h2>Local</h2>
        <div class="campo"><label class="rotulo" for="c-client">Cliente / Obra</label>
          <input id="c-client" data-campo="client" list="lista-clientes" value="${esc(ss.client)}" placeholder="Ex.: Residência João Silva" autocomplete="off">
          <datalist id="lista-clientes">${clientes.map((c) => `<option value="${esc(c.client)}">`).join('')}</datalist></div>
        <div class="campo"><label class="rotulo" for="c-address">Endereço</label>
          <textarea id="c-address" data-campo="address" rows="2" placeholder="Rua, número, bairro, cidade">${esc(ss.address)}</textarea>
          <div class="local-acoes" id="local-acoes"></div></div>
      </section>

      <section class="card">
        <h2>Equipe e clima</h2>
        <div class="campo"><label class="rotulo" for="c-team">Equipe no local</label>
          <input id="c-team" data-campo="team" value="${esc(ss.team)}" placeholder="Nomes dos colaboradores"></div>
        <div class="campo"><span class="rotulo">Condição do tempo</span>
          <div class="chips">${CLIMAS.map((c) => `<button type="button" class="chip" data-clima="${esc(c)}" aria-pressed="${ss.weather === c}">${c}</button>`).join('')}</div></div>
      </section>

      <section class="card">
        <h2>Atividades executadas</h2>
        <div class="chips">${nomesAtiv.map((a) => `<button type="button" class="chip" data-ativ="${esc(a)}" aria-pressed="${ss.activities.includes(a)}">${esc(a)}</button>`).join('')}</div>
        <div class="campo campo-topo"><label class="rotulo" for="c-other">Outras atividades</label>
          <input id="c-other" data-campo="other_activity" value="${esc(ss.other_activity)}" placeholder="Algo que não está na lista"></div>
      </section>

      <section class="card">
        <h2>Relato do dia</h2>
        <div class="campo"><label class="rotulo" for="c-desc">Descrição dos serviços</label>
          <textarea id="c-desc" data-campo="description" rows="5" placeholder="O que foi feito, quantidades, etapas concluídas…">${esc(ss.description)}</textarea></div>
        <div class="campo"><label class="rotulo" for="c-notes">Observações e pendências</label>
          <textarea id="c-notes" data-campo="notes" rows="3" placeholder="Materiais faltando, problemas, próximos passos…">${esc(ss.notes)}</textarea></div>
      </section>

      <section class="card">
        <h2>Registro fotográfico <span class="mudo" id="n-fotos">(${ss.photos.length})</span></h2>
        <label class="btn upload-rotulo">${ICONE.camera}Adicionar fotos
          <input type="file" accept="image/*" multiple id="input-fotos"></label>
        <div class="fotos" id="fotos">${ss.photos.map(fotoHtml).join('')}</div>
      </section>

      <details class="historico"><summary>Histórico de alterações</summary><ul>
        ${(ss.log || []).map((l) => `<li><b>${esc(l.user_name || 'Sistema')}</b> · ${quandoBR(l.at)} — ${esc(l.action)}${l.detail ? `: ${esc(l.detail)}` : ''}</li>`).join('')}
      </ul></details>
      ${eu.role === 'admin' ? '<p><button class="btn btn-perigo btn-peq" data-acao="excluir">Excluir esta SS</button></p>' : ''}`;
    renderJornada();
    renderLocal();
    ligarEventos();
  }

  function renderJornada() {
    const fechada = ss.status !== 'aberta';
    const podeReabrir = fechada && ss.date === eu.today;
    $('#jornada').innerHTML = `
      <h2>Jornada <span class="mudo">· ${dataBR(ss.date)} · ${esc(ss.created_by_name || '')}</span></h2>
      <div class="jornada">
        <div><span class="rotulo">Início</span><div class="valor">${ss.start_time}<small>registrado na abertura</small></div></div>
        <div><span class="rotulo">Fim</span><div class="valor">${ss.end_time || '—'}<small>${ss.status === 'auto' ? 'automático' : fechada ? 'informado' : 'em andamento'}</small></div></div>
        <div><span class="rotulo">Duração</span><div class="valor">${duracao(ss.start_time, ss.end_time)}</div></div>
      </div>
      <div class="encerrar">
        <div class="campo"><label class="rotulo" for="c-fim">${fechada ? 'Corrigir horário de fim' : 'Horário de fim'}</label>
          <input type="time" id="c-fim" value="${fechada ? ss.end_time : (ss.date === eu.today ? horaLocal() : '23:59')}" min="${ss.start_time}" max="23:59"></div>
        <button class="btn ${fechada ? 'btn-sec' : ''}" data-acao="encerrar">${fechada ? 'Salvar fim' : 'Encerrar SS'}</button>
        ${podeReabrir ? '<button class="btn btn-sec" data-acao="reabrir">Reabrir</button>' : ''}
        <p>${fechada ? 'O fim precisa ser no mesmo dia, depois do início.' : 'A SS vale só para hoje. Se não for encerrada, fecha sozinha às 23:59.'}</p>
      </div>`;
    $('#status-cab').innerHTML = statusHtml(ss.status);
    $('[data-acao="encerrar"]').addEventListener('click', encerrar);
    $('[data-acao="reabrir"]')?.addEventListener('click', reabrir);
  }

  function renderLocal() {
    const temCoord = ss.lat != null;
    $('#local-acoes').innerHTML = temCoord
      ? `${ICONE.pino}<a href="https://www.google.com/maps?q=${ss.lat},${ss.lng}" target="_blank" rel="noopener">${ss.lat.toFixed(5)}, ${ss.lng.toFixed(5)} · ver no mapa</a>
         <button type="button" class="btn btn-sec btn-peq" data-acao="sem-gps">Remover</button>`
      : `<button type="button" class="btn btn-sec btn-peq" data-acao="gps">${ICONE.pino}Registrar localização atual</button>`;
    $('[data-acao="gps"]')?.addEventListener('click', localizar);
    $('[data-acao="sem-gps"]')?.addEventListener('click', () => { ss.lat = ss.lng = null; agendar({ lat: null, lng: null }); renderLocal(); });
  }

  function fotoHtml(p) {
    return `<div class="foto" data-foto="${p.id}">
      <a href="#" data-ampliar="${p.id}"><img loading="lazy" alt="${esc(p.caption || 'Foto')}" src="/ss/api/fotos/${p.id}?mini=1"></a>
      <button type="button" class="remover" data-remover="${p.id}" aria-label="Remover foto">×</button>
      <input data-legenda="${p.id}" value="${esc(p.caption)}" placeholder="Legenda" maxlength="300">
    </div>`;
  }

  function ligarEventos() {
    $$('[data-campo]').forEach((el) => {
      el.addEventListener('input', () => agendar({ [el.dataset.campo]: el.value }));
      el.addEventListener('blur', salvarAgora);
    });
    // Ao escolher um cliente já atendido, sugere o endereço usado da última vez.
    $('#c-client').addEventListener('change', (e) => {
      const c = clientes.find((x) => x.client.toLowerCase() === e.target.value.trim().toLowerCase());
      const end = $('#c-address');
      if (c?.address && !end.value.trim()) { end.value = c.address; agendar({ address: c.address }); }
    });
    $$('[data-clima]').forEach((b) => b.addEventListener('click', () => {
      const novo = ss.weather === b.dataset.clima ? '' : b.dataset.clima;
      ss.weather = novo;
      $$('[data-clima]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.clima === novo));
      agendar({ weather: novo });
    }));
    $$('[data-ativ]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.ativ;
      ss.activities = ss.activities.includes(a) ? ss.activities.filter((x) => x !== a) : [...ss.activities, a];
      b.setAttribute('aria-pressed', ss.activities.includes(a));
      agendar({ activities: ss.activities });
    }));
    $('[data-acao="pdf"]').addEventListener('click', async () => { await salvarAgora(); baixarPdf(ss); });
    $('[data-acao="excluir"]')?.addEventListener('click', excluir);
    $('#input-fotos').addEventListener('change', (e) => { enviarFotos([...e.target.files]); e.target.value = ''; });
    $('#fotos').addEventListener('click', cliqueFotos);
    $('#fotos').addEventListener('change', (e) => {
      const fid = e.target.dataset.legenda;
      if (fid) api('PATCH', `/ss/api/fotos/${fid}`, { caption: e.target.value }).catch((er) => toast(er.message, true));
    });
  }

  async function encerrar() {
    const fim = $('#c-fim').value;
    if (!fim) return toast('Escolha o horário de fim.', true);
    await salvarAgora();
    if (ss.status === 'aberta') {
      const ok = await confirmar('Encerrar a SS?', `Fim às ${fim} (duração ${duracao(ss.start_time, fim)}). Você ainda poderá editar o conteúdo depois.`, 'Encerrar');
      if (!ok) return;
    }
    try {
      const novo = await api('POST', `/ss/api/ss/${ss.id}/encerrar`, { end_time: fim, version: ss.version });
      Object.assign(ss, novo);
      renderJornada();
      toast('SS encerrada.');
    } catch (e) {
      toast(e.message, true);
    }
  }

  async function reabrir() {
    await salvarAgora();
    try {
      Object.assign(ss, await api('POST', `/ss/api/ss/${ss.id}/reabrir`, { version: ss.version }));
      renderJornada();
    } catch (e) { toast(e.message, true); }
  }

  async function excluir() {
    const ok = await confirmar('Excluir esta SS?', `${ss.number} e todas as suas fotos serão apagadas definitivamente.`, 'Excluir');
    if (!ok) return;
    try {
      await api('DELETE', `/ss/api/ss/${ss.id}`);
      pendentes = {};
      toast('SS excluída.');
      irPara('#/');
    } catch (e) { toast(e.message, true); }
  }

  function localizar() {
    if (!navigator.geolocation) return toast('Este navegador não informa a localização.', true);
    toast('Obtendo localização…');
    navigator.geolocation.getCurrentPosition((pos) => {
      ss.lat = Number(pos.coords.latitude.toFixed(6));
      ss.lng = Number(pos.coords.longitude.toFixed(6));
      agendar({ lat: ss.lat, lng: ss.lng });
      renderLocal();
    }, () => toast('Não foi possível obter a localização. Verifique a permissão do navegador.', true),
    { enableHighAccuracy: true, timeout: 15000 });
  }

  async function cliqueFotos(e) {
    const amp = e.target.closest('[data-ampliar]');
    if (amp) {
      e.preventDefault();
      return ampliarFoto(amp.dataset.ampliar);
    }
    const rem = e.target.closest('[data-remover]');
    if (rem) {
      if (!await confirmar('Remover foto?', 'A foto será apagada desta SS.', 'Remover')) return;
      try {
        await api('DELETE', `/ss/api/fotos/${rem.dataset.remover}`);
        ss.photos = ss.photos.filter((p) => String(p.id) !== rem.dataset.remover);
        rem.closest('.foto').remove();
        $('#n-fotos').textContent = `(${ss.photos.length})`;
      } catch (er) { toast(er.message, true); }
    }
  }

  async function enviarFotos(arquivos) {
    for (const arq of arquivos) {
      const ph = document.createElement('div');
      ph.className = 'foto enviando';
      const previa = URL.createObjectURL(arq);
      ph.innerHTML = `<a><img alt=""></a><div class="progresso">Preparando…</div><input disabled placeholder="Legenda">`;
      ph.querySelector('img').src = previa;
      $('#fotos').append(ph);
      enviandoFotos++;
      try {
        const img = await carregarImagem(previa);
        const [grande, mini] = await Promise.all([reduzir(img, 1920, 0.82), reduzir(img, 480, 0.7)]);
        ph.querySelector('.progresso').textContent = 'Enviando…';
        const { id: fid } = await tentar(() => api('POST', `/ss/api/ss/${ss.id}/fotos`, grande));
        await tentar(() => api('PUT', `/ss/api/fotos/${fid}/mini`, mini)).catch(() => {});
        const foto = { id: fid, caption: '' };
        ss.photos.push(foto);
        ph.outerHTML = fotoHtml(foto);
        $('#n-fotos').textContent = `(${ss.photos.length})`;
      } catch (er) {
        ph.remove();
        toast(`Falha ao enviar ${arq.name}: ${er.message}`, true);
      } finally {
        URL.revokeObjectURL(previa);
        enviandoFotos--;
      }
    }
  }

  render();
}

// Redução no próprio celular: envia ~300 KB em vez de fotos de 5 MB pelo 4G.
function carregarImagem(url) {
  return new Promise((ok, erro) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => erro(new Error('formato de imagem não suportado'));
    img.src = url;
  });
}

function reduzir(img, max, qualidade) {
  const escala = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * escala);
  c.height = Math.round(img.naturalHeight * escala);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return new Promise((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error('falha ao converter'))), 'image/jpeg', qualidade));
}

// Sinal fraco em obra: tenta de novo até 3 vezes antes de desistir.
async function tentar(fn, vezes = 3) {
  for (let i = 1; ; i++) {
    try { return await fn(); } catch (e) {
      if (i >= vezes || (e.status && e.status < 500)) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

function ampliarFoto(fid) {
  const d = document.createElement('dialog');
  d.className = 'dialogo';
  d.innerHTML = `<img src="/ss/api/fotos/${fid}" alt="" class="foto-ampliada"><form method="dialog" class="dialogo-acoes"><button class="btn btn-sec">Fechar</button></form>`;
  d.querySelector('img').addEventListener('load', (e) => { e.target.classList.add('ok'); });
  document.body.append(d);
  d.addEventListener('close', () => d.remove());
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  d.showModal();
}

// ------------------------------------------------------------ equipe (admin)

async function telaEquipe() {
  if (eu.role !== 'admin') return irPara('#/');
  const [usuarios, atividades] = await Promise.all([api('GET', '/ss/api/usuarios'), api('GET', '/ss/api/atividades?todas=1')]);
  nomesUsuarios = null;
  app.innerHTML = `
    <div class="cab-pagina"><div><h1>Equipe</h1><p>Somente pessoas cadastradas aqui conseguem entrar no sistema.</p></div></div>
    <section class="card">
      <h2>Novo usuário</h2>
      <form class="form-inline" id="f-usuario" autocomplete="off">
        <div><label class="rotulo" for="u-nome">Nome</label><input id="u-nome" required></div>
        <div><label class="rotulo" for="u-email">E-mail (login)</label><input id="u-email" type="email" required></div>
        <div><label class="rotulo" for="u-senha">Senha inicial</label><input id="u-senha" type="text" minlength="8" required autocomplete="new-password"></div>
        <div><label class="rotulo" for="u-perfil">Perfil</label>
          <select id="u-perfil"><option value="tecnico">Técnico</option><option value="admin">Administrador</option></select></div>
        <button class="btn">Cadastrar</button>
      </form>
    </section>
    <section class="card">
      <h2>Usuários <span class="mudo">(${usuarios.length})</span></h2>
      <ul class="lista-simples">${usuarios.map((u) => `
        <li class="${u.active ? '' : 'inativo'}">
          <div class="info"><b>${esc(u.name)}</b> ${u.role === 'admin' ? '<span class="tag">admin</span>' : ''} ${u.active ? '' : '<span class="tag">inativo</span>'}
            <span>${esc(u.email)}</span></div>
          <button class="btn btn-sec btn-peq" data-u="${u.id}" data-op="senha">Redefinir senha</button>
          ${u.id === eu.id ? '' : `
            <button class="btn btn-sec btn-peq" data-u="${u.id}" data-op="perfil">${u.role === 'admin' ? 'Tornar técnico' : 'Tornar admin'}</button>
            <button class="btn ${u.active ? 'btn-perigo' : 'btn-sec'} btn-peq" data-u="${u.id}" data-op="ativo">${u.active ? 'Desativar' : 'Reativar'}</button>`}
        </li>`).join('')}</ul>
    </section>
    <section class="card">
      <h2>Lista de atividades</h2>
      <p class="mudo">Toque para mostrar ou esconder uma atividade na ficha. Atividades escondidas continuam nas SS antigas.</p>
      <div class="chips">${atividades.map((a) => `<button type="button" class="chip" data-a="${a.id}" aria-pressed="${!!a.active}">${esc(a.name)}</button>`).join('')}</div>
      <form class="form-inline form-ativ campo-topo" id="f-ativ">
        <div><label class="rotulo" for="a-nome">Nova atividade</label><input id="a-nome" required></div>
        <button class="btn">Adicionar</button>
      </form>
    </section>`;

  $('#f-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/ss/api/usuarios', {
        name: $('#u-nome').value, email: $('#u-email').value, password: $('#u-senha').value, role: $('#u-perfil').value,
      });
      toast('Usuário cadastrado. Envie o login e a senha inicial para a pessoa.');
      telaEquipe();
    } catch (er) { toast(er.message, true); }
  });

  $$('[data-u]').forEach((b) => b.addEventListener('click', async () => {
    const u = usuarios.find((x) => String(x.id) === b.dataset.u);
    let corpo;
    if (b.dataset.op === 'senha') {
      const s = prompt(`Nova senha para ${u.name} (mín. 8 caracteres):`);
      if (!s) return;
      corpo = { password: s };
    } else if (b.dataset.op === 'perfil') {
      corpo = { role: u.role === 'admin' ? 'tecnico' : 'admin' };
    } else {
      if (u.active && !await confirmar(`Desativar ${u.name}?`, 'A pessoa perde o acesso na hora. As SS dela continuam no sistema.', 'Desativar')) return;
      corpo = { active: !u.active };
    }
    try {
      await api('PATCH', `/ss/api/usuarios/${u.id}`, corpo);
      toast(b.dataset.op === 'senha' ? 'Senha redefinida.' : 'Usuário atualizado.');
      telaEquipe();
    } catch (er) { toast(er.message, true); }
  }));

  $$('[data-a]').forEach((b) => b.addEventListener('click', async () => {
    const ativo = b.getAttribute('aria-pressed') !== 'true';
    try {
      await api('PATCH', `/ss/api/atividades/${b.dataset.a}`, { active: ativo });
      b.setAttribute('aria-pressed', ativo);
    } catch (er) { toast(er.message, true); }
  }));

  $('#f-ativ').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/ss/api/atividades', { name: $('#a-nome').value });
      telaEquipe();
    } catch (er) { toast(er.message, true); }
  });
}

// ------------------------------------------------------------ conta

function telaConta() {
  app.className = 'app estreito';
  app.innerHTML = `
    <div class="cab-pagina"><div><h1>${esc(eu.name)}</h1><p>${esc(eu.email)} · ${eu.role === 'admin' ? 'Administrador' : 'Técnico'}</p></div></div>
    <section class="card">
      <h2>Trocar senha</h2>
      <form id="f-senha">
        <div class="campo"><label class="rotulo" for="s-atual">Senha atual</label><input id="s-atual" type="password" autocomplete="current-password" required></div>
        <div class="campo"><label class="rotulo" for="s-nova">Nova senha (mín. 8 caracteres)</label><input id="s-nova" type="password" autocomplete="new-password" minlength="8" required></div>
        <button class="btn">Salvar nova senha</button>
      </form>
    </section>
    <section class="card">
      <h2>Instalar o app</h2>
      <p class="mudo"><b>iPhone:</b> no Safari, toque em Compartilhar → “Adicionar à Tela de Início”.<br>
      <b>Android:</b> no Chrome, menu ⋮ → “Instalar app”.<br>
      <b>Mac:</b> no Safari, Arquivo → “Adicionar ao Dock”; no Chrome, ícone de instalar na barra de endereço.</p>
    </section>
    <button class="btn btn-sec" id="sair">Sair</button>`;
  $('#f-senha').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/ss/api/eu/senha', { current: $('#s-atual').value, password: $('#s-nova').value });
      e.target.reset();
      toast('Senha alterada.');
    } catch (er) { toast(er.message, true); }
  });
  $('#sair').addEventListener('click', async () => {
    await api('POST', '/ss/api/logout').catch(() => {});
    eu = null;
    irPara('#/login');
  });
}

// ------------------------------------------------------------ início

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/ss/sw.js', { scope: '/ss/' }).catch(() => {});
rotear();
