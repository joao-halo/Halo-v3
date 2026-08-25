# Halo Energy — site

Site institucional de página única da **Halo Energy** (Belo Horizonte – MG):
sistemas fotovoltaicos, armazenamento de energia e infraestrutura de recarga para
veículos elétricos.

Vite + React 18 + TypeScript + Tailwind. Estático, sem backend, pronto para
Vercel ou Netlify.

A aparência inteira vem do **HALO Design System** (`HALO-Design-System/`), extraído
para tokens em [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md). Nenhum valor visual é escrito
à mão nos componentes.

---

## Rodar

```bash
npm install
```

```bash
npm run dev
```

O site sobe em <http://localhost:5173>.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | Checa tipos e gera `dist/` para produção |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run typecheck` | Só a checagem de tipos |
| `npm run test` | Testes dos simuladores (Vitest) |
| `npm run generate:images` | Regera `public/og.jpg` e os placeholders de `public/images/` |

---

## Onde editar os textos

**Todo o texto visível está em `src/data/`.** Nenhum componente de seção tem texto
escrito dentro dele — para mudar uma palavra da página, você nunca precisa abrir um
arquivo `.tsx`.

| Arquivo | O que contém |
|---|---|
| [`src/data/content.ts`](src/data/content.ts) | O texto de todas as seções, na ordem em que aparecem: capa, projetos, engenharia, soluções, fotovoltaico, armazenamento, eletromobilidade, processo, simuladores, contato, rodapé |
| [`src/data/site.ts`](src/data/site.ts) | Dados da empresa, WhatsApp, menu de navegação, SEO |
| [`src/data/faq.ts`](src/data/faq.ts) | Perguntas e respostas do accordion |
| [`src/data/solutions.ts`](src/data/solutions.ts) | Os três cards de solução (número, ícone, título, descrição) |

Cada bloco em `content.ts` tem um comentário dizendo a que seção pertence.

---

## Onde trocar telefone, CNPJ e redes

Tudo em [`src/data/site.ts`](src/data/site.ts). Os campos a preencher estão marcados
com `PLACEHOLDER` — a lista completa está em [`CONTEUDO.md`](CONTEUDO.md).

**O número do WhatsApp** fica na primeira linha do arquivo:

```ts
export const WHATSAPP_NUMBER = "5531000000000";
```

Formato internacional, só dígitos: `55` + DDD + número. Ele alimenta os seis pontos
de conversão da página e o botão flutuante — trocar aqui muda todos de uma vez.

As mensagens que já vêm escritas na conversa ficam logo abaixo, em `waMessages`.

Além de `site.ts`, o domínio de produção aparece em três lugares que precisam ser
atualizados juntos: `index.html` (canonical e Open Graph), `public/robots.txt` e
`public/sitemap.xml`.

---

## Como substituir as imagens

As imagens em `public/images/` são **placeholders gerados a partir dos assets de
marca** — superfícies com os gradientes do design system e o anel HALO em marca
d'água. Não são fotos.

Para trocar por fotos reais:

1. Mantenha **o mesmo nome de arquivo** e **a mesma proporção**:
   - cards de projeto: `800×600` (4:3)
   - imagens de seção: `900×1100` (retrato)
2. Coloque o arquivo em `public/images/`, sobrescrevendo o placeholder.
3. Ajuste o texto alternativo em `src/data/content.ts` — cada imagem tem um campo
   `alt` que descreve o que aparece nela. Isso não é opcional: é o que leitores de
   tela leem e o que o Google indexa.

A lista com nomes e dimensões também está em `public/images/LEIA-ME.txt`.

O cartão de compartilhamento (`public/og.jpg`, 1200×630) é gerado por
`scripts/generate-images.mjs` a partir do anel da marca e das fontes Fraunces e
Outfit. Para mudar o texto dele, edite o script e rode `npm run generate:images`.

---

## Como configurar o endpoint do formulário

O formulário de contato funciona **sem backend**. O comportamento depende de uma
única variável de ambiente:

- **Sem `VITE_FORM_ENDPOINT`** — ao enviar, abre o WhatsApp com todos os dados do
  formulário já escritos na mensagem. É o padrão, e não exige configurar nada.
- **Com `VITE_FORM_ENDPOINT`** — envia um `POST` com JSON para o endereço informado
  e mostra o estado de sucesso ou erro na própria página.

Para ligar o envio por e-mail:

```bash
cp .env.example .env
```

E preencha:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/SEU_ID
```

Funciona com Formspree, Basin, Getform, Web3Forms, Netlify Forms ou uma função
serverless própria — qualquer endereço que aceite `POST` com `Content-Type:
application/json`.

O corpo enviado tem os campos `name`, `email`, `phone`, `city`, `interest`, `bill`
e `message`. Há um campo honeypot (`website`) que só robôs preenchem; quando vem
preenchido, o envio é descartado sem aviso.

> Variáveis `VITE_*` são embutidas no JavaScript do site e ficam visíveis para
> quem abrir a página. Nunca coloque nelas chave de API secreta — use só endpoints
> públicos de formulário.

---

## Deploy

O build gera um site estático em `dist/`. Não há servidor para manter.

**Vercel** — importe o repositório. A detecção automática já acerta:
- Build Command: `npm run build`
- Output Directory: `dist`

Se usar o endpoint de formulário, adicione `VITE_FORM_ENDPOINT` em
*Settings → Environment Variables* **antes** do primeiro build (variáveis `VITE_*`
entram no bundle no momento da compilação, não em tempo de execução).

**Netlify** — mesma configuração:
- Build command: `npm run build`
- Publish directory: `dist`

**Qualquer outra hospedagem estática** — rode `npm run build` e publique o conteúdo
de `dist/`.

Depois do primeiro deploy, atualize o domínio em `index.html`, `public/robots.txt`,
`public/sitemap.xml` e `src/data/site.ts`.

---

## Estrutura

```
src/
  components/
    layout/     Header · MobileMenu · Footer · WhatsAppFab · StructuredData
    sections/   as 11 seções da página, na ordem em que aparecem
    ui/         componentes do design system (não edite para ajustar uma seção)
  data/         TODO o texto do site
  hooks/        scroll-spy, posição de rolagem, reduced-motion, contagem crescente
  lib/          calc (simuladores) · format (pt-BR) · motion · cn
  styles/       tokens.css (fonte de verdade) · fonts.css · index.css
public/
  brand/        logo em SVG (anel, lockup, versão mono, favicon)
  images/       placeholders — substituir por fotos
  og.jpg        cartão de compartilhamento
scripts/        geração das imagens
```

**Regra do projeto:** componente de seção não contém texto nem valor visual.
Texto vem de `src/data/`, aparência vem dos tokens. Antes de criar um componente
de interface, procure em `src/components/ui/` — provavelmente já existe.

---

## Testes

```bash
npm run test
```

Cobrem `src/lib/calc.ts`: as taxas de compensação por perfil, a progressão
geométrica de 25 anos, a estimativa de potência, o custo elétrico contra combustão,
a recomendação de carregador nos três degraus e o travamento nos extremos dos dois
sliders.

---

## Acessibilidade

O site foi construído para WCAG AA: um único `<h1>`, hierarquia de títulos sem
salto, `alt` em todas as imagens, `width`/`height` explícitos, foco visível,
navegação completa por teclado, abas e accordion com ARIA correto, menu mobile com
armadilha de foco e fechamento por `Esc`, e `prefers-reduced-motion` desativando
todas as animações.

Dois pares de cor do design system reprovaram em contraste e foram corrigidos
dentro da própria paleta da marca — o que foi medido e o que foi trocado está
registrado em [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md), na seção **Contraste**.
