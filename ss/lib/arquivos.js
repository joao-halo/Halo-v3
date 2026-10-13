// Armazenamento das fotos. Em produção usa um store PRIVADO do Vercel Blob
// (BLOB_READ_WRITE_TOKEN): as fotos só são lidas pelo servidor, que as
// entrega a usuários logados, e o endereço do Blob nunca chega ao navegador.
// No desenvolvimento local, sem token, grava em .ss-data/fotos/.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { HttpError } from './http.js';

const usarBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const pastaLocal = () => path.join(process.env.SS_DATA_DIR || '.ss-data', 'fotos');

function exigirConfig() {
  if (!usarBlob() && process.env.VERCEL) {
    throw new HttpError(503, 'Armazenamento de fotos não configurado (BLOB_READ_WRITE_TOKEN). Conecte um Blob store privado ao projeto na Vercel.');
  }
}

export async function salvar(pasta, buf) {
  exigirConfig();
  const nome = `ss-fotos/${pasta}/${crypto.randomBytes(12).toString('hex')}.jpg`;
  if (usarBlob()) {
    const { put } = await import('@vercel/blob');
    const r = await put(nome, buf, { access: 'private', contentType: 'image/jpeg', addRandomSuffix: false });
    return r.pathname;
  }
  const arq = path.join(pastaLocal(), nome);
  await fs.mkdir(path.dirname(arq), { recursive: true });
  await fs.writeFile(arq, buf);
  return nome;
}

export async function ler(nome) {
  exigirConfig();
  if (usarBlob()) {
    const { get } = await import('@vercel/blob');
    const r = await get(nome, { access: 'private' });
    if (!r || r.statusCode !== 200) return null;
    return Buffer.from(await new Response(r.stream).arrayBuffer());
  }
  return fs.readFile(path.join(pastaLocal(), nome)).catch(() => null);
}

export async function apagar(nomes) {
  const lista = nomes.filter(Boolean);
  if (!lista.length) return;
  if (usarBlob()) {
    const { del } = await import('@vercel/blob');
    await del(lista).catch(() => {});
    return;
  }
  await Promise.all(lista.map((n) => fs.rm(path.join(pastaLocal(), n), { force: true })));
}
