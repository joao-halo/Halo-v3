// Cria um usuário do sistema de SS pelo terminal. Use para o primeiro admin;
// os demais são cadastrados na tela "Equipe".
//
//   Produção (Neon):  DATABASE_URL="postgres://..." npm run ss:criar-usuario -- --admin
//   Local (PGlite):   npm run ss:criar-usuario -- --admin
import readline from 'node:readline';
import { q, q1 } from './lib/db.js';
import { hashSenha, validarSenha } from './lib/auth.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = (t) => new Promise((r) => rl.question(t, r));

function perguntarSenha(t) {
  return new Promise((resolve) => {
    const escrever = rl._writeToOutput;
    rl._writeToOutput = (s) => { if (s.includes(t)) escrever.call(rl, s); };
    rl.question(t, (resp) => {
      rl._writeToOutput = escrever;
      process.stdout.write('\n');
      resolve(resp);
    });
  });
}

console.log(process.env.DATABASE_URL ? 'Banco: Neon (DATABASE_URL)' : 'Banco: local (.ss-data/)');
const nome = (await perguntar('Nome: ')).trim();
const email = (await perguntar('E-mail (login): ')).trim().toLowerCase();
const admin = process.argv.includes('--admin') || /^s/i.test(await perguntar('Administrador? (s/N): '));
const senha = await perguntarSenha('Senha (mín. 8 caracteres): ');
const conf = await perguntarSenha('Repita a senha: ');
rl.close();

const erro = !nome ? 'Informe o nome.'
  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'E-mail inválido.'
  : senha !== conf ? 'As senhas não conferem.'
  : validarSenha(senha);
if (erro) {
  console.error(`✗ ${erro}`);
  process.exit(1);
}
if (await q1('SELECT 1 FROM ss_users WHERE email = $1', [email])) {
  console.error('✗ Já existe um usuário com esse e-mail.');
  process.exit(1);
}
await q('INSERT INTO ss_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
  [nome, email, hashSenha(senha), admin ? 'admin' : 'tecnico']);
console.log(`✓ Usuário ${email} criado como ${admin ? 'administrador' : 'técnico'}.`);
process.exit(0);
