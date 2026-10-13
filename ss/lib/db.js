// Banco Postgres. Em produção (Vercel) usa o Neon via DATABASE_URL; no
// desenvolvimento local, sem DATABASE_URL, usa o PGlite (Postgres embutido)
// gravando em .ss-data/.
import fs from 'node:fs';
import path from 'node:path';
import { HttpError } from './http.js';
import { hoje } from './tempo.js';

const ESQUEMA = [
  `CREATE TABLE IF NOT EXISTS ss_users (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'tecnico' CHECK (role IN ('admin', 'tecnico')),
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS ss_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES ss_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ss_login_falhas (
    chave TEXT PRIMARY KEY,
    n     INT NOT NULL,
    ate   TIMESTAMPTZ NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ss_activities (
    id     SERIAL PRIMARY KEY,
    name   TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort   INT NOT NULL DEFAULT 0
  )`,
  'CREATE UNIQUE INDEX IF NOT EXISTS ss_activities_nome ON ss_activities (lower(name))',
  `CREATE TABLE IF NOT EXISTS ss_counters (
    year INT PRIMARY KEY,
    n    INT NOT NULL
  )`,
  // Uma SS = um dia de trabalho. start_time é gravado pelo servidor na criação
  // e nunca muda; end_time é escolhido pelo usuário (mesmo dia) ou fixado em
  // 23:59 pelo encerramento automático (status 'auto').
  `CREATE TABLE IF NOT EXISTS ss_fichas (
    id             SERIAL PRIMARY KEY,
    number         TEXT NOT NULL UNIQUE,
    date           TEXT NOT NULL,
    start_time     TEXT NOT NULL,
    end_time       TEXT,
    status         TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'encerrada', 'auto')),
    client         TEXT NOT NULL DEFAULT '',
    address        TEXT NOT NULL DEFAULT '',
    lat            DOUBLE PRECISION,
    lng            DOUBLE PRECISION,
    team           TEXT NOT NULL DEFAULT '',
    weather        TEXT NOT NULL DEFAULT '',
    activities     TEXT NOT NULL DEFAULT '[]',
    other_activity TEXT NOT NULL DEFAULT '',
    description    TEXT NOT NULL DEFAULT '',
    notes          TEXT NOT NULL DEFAULT '',
    version        INT NOT NULL DEFAULT 1,
    created_by     INT REFERENCES ss_users(id),
    updated_by     INT REFERENCES ss_users(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  'CREATE INDEX IF NOT EXISTS ss_fichas_date ON ss_fichas (date)',
  'CREATE INDEX IF NOT EXISTS ss_fichas_status ON ss_fichas (status)',
  `CREATE TABLE IF NOT EXISTS ss_photos (
    id          SERIAL PRIMARY KEY,
    ss_id       INT NOT NULL REFERENCES ss_fichas(id) ON DELETE CASCADE,
    arquivo     TEXT NOT NULL,
    mini        TEXT,
    caption     TEXT NOT NULL DEFAULT '',
    uploaded_by INT REFERENCES ss_users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  'CREATE INDEX IF NOT EXISTS ss_photos_ss ON ss_photos (ss_id)',
  // Histórico: como todos podem editar todas as SS, registramos quem fez o quê.
  `CREATE TABLE IF NOT EXISTS ss_log (
    id      SERIAL PRIMARY KEY,
    ss_id   INT REFERENCES ss_fichas(id) ON DELETE CASCADE,
    user_id INT REFERENCES ss_users(id),
    at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    action  TEXT NOT NULL,
    detail  TEXT NOT NULL DEFAULT ''
  )`,
  'CREATE INDEX IF NOT EXISTS ss_log_ss ON ss_log (ss_id)',
];

const ATIVIDADES_PADRAO = [
  'Instalação de placas solares',
  'Instalação de estruturas',
  'Instalação de inversores',
  'Lançamento de cabos',
  'Instalação de string box / quadro de proteção',
  'Montagem de eletrodutos e eletrocalhas',
  'Aterramento e SPDA',
  'Instalação de carregador veicular',
  'Transporte de materiais',
  'Comissionamento e testes',
  'Vistoria técnica',
  'Manutenção preventiva',
  'Manutenção corretiva',
  'Limpeza de módulos',
];

async function conectar() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (url) {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    return (texto, params = []) => sql.query(texto, params);
  }
  // Nunca cair num banco temporário em produção: os dados sumiriam.
  if (process.env.VERCEL) {
    throw new HttpError(503, 'Banco de dados não configurado (DATABASE_URL). Conecte o Neon ao projeto na Vercel.');
  }
  const modulo = '@electric-sql/pglite'; // fora do rastreio do bundler: só existe no dev
  const { PGlite } = await import(modulo);
  const pasta = path.join(process.env.SS_DATA_DIR || '.ss-data', 'pg');
  fs.mkdirSync(pasta, { recursive: true });
  const pg = new PGlite(pasta);
  return async (texto, params = []) => (await pg.query(texto, params)).rows;
}

async function iniciar() {
  const consulta = await conectar();
  for (const s of ESQUEMA) await consulta(s);
  const [{ n }] = await consulta('SELECT COUNT(*)::int AS n FROM ss_activities');
  if (n === 0) {
    for (const [i, nome] of ATIVIDADES_PADRAO.entries()) {
      await consulta('INSERT INTO ss_activities (name, sort) VALUES ($1, $2) ON CONFLICT DO NOTHING', [nome, i]);
    }
  }
  return consulta;
}

let pronto = null;

export async function q(texto, params) {
  pronto ??= iniciar().catch((e) => { pronto = null; throw e; });
  return (await pronto)(texto, params);
}

export async function q1(texto, params) {
  return (await q(texto, params))[0] || null;
}

// Encerra às 23:59 do próprio dia toda SS que ficou aberta de um dia anterior.
// Roda antes de cada leitura, então o efeito é o mesmo que se ela tivesse
// fechado sozinha à meia-noite. Uma instrução só: atualiza e registra no
// histórico de forma atômica.
export async function encerrarSSVencidas() {
  await q(`
    WITH f AS (
      UPDATE ss_fichas SET status = 'auto', end_time = '23:59', version = version + 1, updated_at = now()
       WHERE status = 'aberta' AND date < $1
      RETURNING id
    )
    INSERT INTO ss_log (ss_id, user_id, action, detail)
    SELECT id, NULL, 'auto', 'Encerrada automaticamente às 23:59' FROM f`, [hoje()]);
}
