// Servidor local do sistema de SS (sem Vercel):  npm run ss:dev
// Serve a interface em http://localhost:5180/ss/ e a API em /ss/api/*.
// Sem DATABASE_URL usa um Postgres embutido (PGlite) em .ss-data/.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tratar } from './lib/handler.js';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const PORTA = Number(process.env.PORT || 5180);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png',
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/ss/api/')) return tratar(req, res, url.pathname.slice(7), url.searchParams);
  if (url.pathname === '/' || url.pathname === '/ss') { res.writeHead(302, { Location: '/ss/' }); return res.end(); }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const arq = path.normalize(path.join(RAIZ, rel));
  if (!arq.startsWith(path.join(RAIZ, 'ss')) || !fs.existsSync(arq) || !fs.statSync(arq).isFile()) {
    res.writeHead(404);
    return res.end('Não encontrado');
  }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arq)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(arq).pipe(res);
}).listen(PORTA, '127.0.0.1', () => console.log(`SS local em http://localhost:${PORTA}/ss/`));
