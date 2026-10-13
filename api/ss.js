// Função da Vercel que atende /ss/api/* (ver o rewrite em vercel.json).
// O sistema de SS fica em ss/; a interface, em public/ss/.
import { tratar } from '../ss/lib/handler.js';

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  // Com o rewrite, a rota original chega em ?rota=...; se a URL original for
  // preservada, ela começa com /ss/api.
  const rota = url.pathname.startsWith('/ss/api/')
    ? url.pathname.slice('/ss/api'.length)
    : `/${url.searchParams.get('rota') || ''}`;
  url.searchParams.delete('rota');
  await tratar(req, res, rota, url.searchParams);
}
