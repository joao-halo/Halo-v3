# Auditoria de fidelidade — site Halo × HALO Design System

Auditoria do site construído contra o design system em `HALO-Design-System/`,
materializado em [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md).

**Método.** Varredura estática de `src/` por valor visual literal; medição de
contraste no DOM renderizado (não em estimativa), percorrendo todos os nós de
texto e resolvendo o fundo efetivo por composição alfa dos ancestrais; comparação
dos valores computados de cada componente contra a especificação do design
system; e revisão de duplicação componente a componente.

**Resultado.** 18 ocorrências corrigidas: 9 de valor literal, 6 de contraste
reprovado, 1 divergência token × implementação e 2 duplicações. `npm run build`,
`npx tsc --noEmit` e os 30 testes passam.

---

## 1. Valores visuais hardcoded

### Encontrados e corrigidos

| # | Arquivo · linha (antes) | O que havia | Correção |
|---|---|---|---|
| 1 | `src/components/ui/logo.tsx:58–67` | Seis literais hex nas paradas do gradiente Aurora: `#D4AF37` `#006D40` `#3D7CBF` `#4F8FD0` | Constante `RING_STOPS` referenciando `var(--halo-gold)`, `var(--halo-green)`, `var(--halo-blue)`, `var(--halo-ring-tip)`. Verificado no navegador: `stop-color` resolve para `rgb(212,175,55)` e `rgb(79,143,208)` |
| 2 | `src/components/ui/logo.tsx` (2×) | `strokeWidth={13}` e as três strings de arco repetidas inline | Constantes `RING_STROKE` e `RING_ARCS`, documentadas como geometria copiada de `public/brand/halo-mark.svg`. Coordenada de traçado não é tokenizável; nomeá-la tira o número solto do JSX |
| 3 | `src/components/ui/hero.tsx:52–56` | `style={{ background: "radial-gradient(120% 120% at 80% 10%, …), radial-gradient(…)" }}` — geometria e opacidades escritas à mão | Token `--hero-halos`; o componente virou `className="bg-hero-halos"` |
| 4 | 6 arquivos, 8 ocorrências | `opacity-[0.78]` e `text-ink-inverse/[0.78]` — o `rgba(255,255,255,.78)` do showcase repetido | Token `--color-text-inverse-muted`, exposto como `text-ink-inverse-muted` |
| 5 | 5 arquivos, 19 ocorrências | Ícones com `size={16|20|24|28}` e `strokeWidth={2}` numéricos | `src/lib/icons.ts` espelhando `--icon-size-*` e `--icon-stroke`. lucide-react exige número, então o espelho é a única forma de manter uma fonte de verdade |
| 6 | `Header.tsx` `MobileMenu.tsx` `Footer.tsx` | Dimensões do logo soltas: `width={36}` `{32}` `{40}`, wordmark `size={24}` `{22}` `{26}` | Tokens `--logo-mark-*` / `--logo-word-*` e espelho `LOGO` em `lib/icons.ts` |
| 7 | `Projects.tsx` `Photovoltaic.tsx` `Storage.tsx` | `width={800} height={600}` / `width={900} height={1100}` fixos no componente de seção | Movidos para `src/data/content.ts`, junto de `image` e `alt`. Trocar a foto agora é uma edição só, no lugar certo |
| 8 | `media-card.tsx:43` · `team-card.tsx:45` | `aspect-[4/3]` e `aspect-[4/5]` | `aspectRatio: { card, portrait }` no tema → `aspect-card`, `aspect-portrait` |
| 9 | `button.tsx:38` · `media-card.tsx:43` | `brightness-[0.96]` e `scale-[1.02]` | Tokens `--hover-dim` e `--hover-zoom` → `brightness-dim`, `scale-zoom` |

O `0.96` do brilho vem literalmente do CSS de `botoes.md` §4; o `1.02` do zoom era
invenção da construção do site — agora ambos estão nomeados e no mesmo lugar.

### Exceção mantida, com justificativa

| Ocorrência | Por que fica |
|---|---|
| `accordion.tsx:66` — `grid-rows-[1fr]` / `grid-rows-[0fr]` | Não é valor de design: é a técnica de animar altura desconhecida com unidade fracionária. Não existe token possível para `1fr` |
| `index.css:145` — `@media (min-width: 780px)` | `@media` não resolve custom property. É a mesma exceção já documentada para `screens` no `tailwind.config.ts` |
| `src/lib/motion.ts` e `src/lib/icons.ts` | Espelhos declarados dos tokens CSS, para APIs que só aceitam número (Framer Motion, lucide-react). Cada constante cita o token correspondente |

### Cor de marca sem token — achado

`#4F8FD0` aparece em `assets/halo-logo.svg` como ponta do terceiro arco do anel,
mas **não consta de nenhuma escala do design system** — não é o azul 500 nem
nenhum degrau da escala azul. É a única cor da marca sem token. Registrada como
`--halo-ring-tip` e anotada em "Lacunas".

---

## 2. Contraste WCAG AA

58 pares distintos de texto/fundo medidos no DOM renderizado, com o accordion
aberto e as revelações liberadas para alcançar todo o conteúdo.

### Reprovações encontradas e corrigidas

| # | Par | Onde | Medido | Exige | Correção | Depois |
|---|---|---|---|---|---|---|
| 1 | Branco sobre `--gradient-emerald` | **Botão primário**, todos os tamanhos | **4,34:1** no extremo azul | 4,5:1 | `--gradient-emerald-cta`, terminando no azul **600** `#33669D` | **5,95:1** ✅ |
| 2 | Verde 200 `#92CDAC` sobre branco | Numeração `01 02 03` em `ProcessSteps` e em Soluções | **1,82:1** | 3:1 (34px bold) | `--color-step-number` → verde **400** `#08995A`, primeiro degrau da escala que passa | **3,67:1** ✅ |
| 3 | Ouro 500 sobre scrim a 0,85 | Legenda do card de projeto, contra a foto mais clara possível | **4,08:1** | 4,5:1 | Pé do `--overlay-scrim` de 0,85 → **0,92** | **5,14:1** ✅ |
| 4 | Neutro 300 `#B7BBBE` sobre branco | **Borda do campo de formulário** (WCAG 1.4.11) | **1,93:1** | 3:1 | `--input-border` → neutro **400** `#8E9396` | **3,10:1** ✅ |
| 5 | Verde 500 contra trilha neutro 200 | Preenchimento × vazio do slider (indicação de estado) | **2,40:1** | 3:1 | `--slider-track-bg` → neutro **300** | **3,33:1** ✅ |
| 6 | Ouro 500 sobre branco | Seta `→` da linha de processo | **2,10:1** | — | Alinhada ao papel `--color-accent-on-light` (ouro 700) já criado na tarefa 2 | **4,70:1** ✅ |

O item 6 é decorativo (`aria-hidden`, e a ordem já é dada pela numeração), então
o critério 1.4.11 não se aplicava. Foi corrigido mesmo assim por consistência:
"ouro como texto sobre fundo claro" agora tem um único tratamento no site.

Nenhuma correção inventou cor. Todas usam outro degrau da mesma escala, e o token
original continua intacto para uso como fundo ou superfície — `--gradient-emerald`
segue disponível para superfície sem texto.

### Verificados e aprovados

| Par | Medido |
|---|---|
| Neutro 900 sobre branco | 16,10:1 |
| Branco sobre grafite (capa, rodapé, menu) | 13,86:1 |
| Branco 80% sobre grafite (links do topo sobre a capa) | 9,44:1 |
| Neutro 900 sobre ouro 500 (botão de destaque) | 8,05:1 |
| Neutro 300 sobre grafite (links do rodapé) | 7,08:1 |
| Ouro 500 sobre grafite (overline em seção invertida) | 6,60:1 |
| Verde 500 sobre branco (overline, link ativo) | 6,44:1 |
| Branco sobre verde 500 (botão sólido) | 6,44:1 |
| Ouro 700 sobre branco (rótulo e número dos simuladores) | 4,70:1 |
| Neutro 500 sobre neutro 50 (texto auxiliar em seção clara) | 4,66:1 |
| Danger sobre branco (erro de formulário) | 5,20:1 |
| Anel de foco azul 400 sobre branco / neutro 50 / grafite | 3,25 / 3,03 / 4,26:1 |

**Azul 500 sobre branco mede 4,35:1** — reprova para texto normal e passa para
texto grande. O próprio design system já restringe o azul a ≥18px (`cores.md` §5).
No site ele só aparece em 40px bold e 24px semibold, dentro da restrição.

### Correção de uma afirmação da tarefa 2

O `DESIGN-TOKENS.md` dizia que o anel de foco azul 400 "some sobre grafite" e que
`--color-focus-inverted` (ouro 300) existia por contraste. **A medição desmente:**
azul 400 sobre grafite dá **4,26:1**, acima do mínimo de 3:1. O anel em ouro é
ganho de legibilidade, não correção de WCAG. O texto foi ajustado.

### Limite aceito e documentado

A trilha vazia do slider (neutro 300) mede 1,93:1 contra o card branco. Quem
identifica o controle é o polegar — 24px, branco, borda de 2px em verde 500,
**6,44:1** contra o card — e a trilha é contexto recessivo. A separação que
comunica estado, preenchido contra vazio, é a que passa (3,33:1).

---

## 3. Componente × contraparte no design system

Valores computados no navegador, comparados com a especificação escrita.

| Componente | Especificação | Medido | Situação |
|---|---|---|---|
| Botão `sm` | 32px · 8×16 · 14px (`botoes.md` §2) | 32px · 8×16 · 14px | ✅ |
| Botão `md` | 44px · 12×24 · 16px | 44px · 12×24 · 16px | ✅ |
| Botão `lg` | 56px · 16×32 · 18px | 56px · 16×32 · 18px | ✅ |
| Botão — forma | pílula `999px`, borda 2px, Outfit 600 | idem, em todas as variantes | ✅ |
| Botão `outline` | borda verde 500, texto verde 700 | `rgb(0,109,64)` / `rgb(0,71,42)` | ✅ (corrigido na tarefa 2) |
| Card | raio `md` 8px, `shadow-md`, padding 32px | 8px · `0 4px 12px rgba(15,16,17,.08)` · 32px | ✅ |
| Card de destaque | padding `lg` | 48px (`--space-7`) | ✅ |
| Overline | Outfit 600, 12px, `0.18em`, maiúsculas | 12px · 600 · `2.16px` = 0.18em | ✅ |
| H2 | Fraunces 600, 32px, entrelinha 1.15 | 32px · 600 · 36.8px · tracking −0.48px | ✅ |
| H3 | Fraunces 600, 24px, entrelinha 1.3 | 24px · 600 · 31.2px | ✅ |
| Corpo | Outfit 400, 16px, entrelinha 1.6 | 16px · 25.6px · Outfit | ✅ |
| Ícone de feature | círculo 64px | 64×64 · `999px` | ✅ |
| Número de etapa | Fraunces 700, 34px | 34px · 700 | ✅ forma · ⚠️ cor corrigida (§2.2) |
| Campo de formulário | raio `sm` 4px, altura = botão md | 44px · 4px · borda 1px · padding 16px | ✅ |

### Divergências

| # | Divergência | Resolução |
|---|---|---|
| 1 | `--slider-track-fill` declarava `var(--gradient-emerald)`, mas a regra `.halo-slider` pinta `var(--color-primary)` sólido | **Corrigido**: o token passou a declarar o que o componente realmente pinta. Um token que mente é pior que token nenhum |
| 2 | Card da linha de processo com padding 24px; o showcase usa `style="padding:8px"` | **Mantido e documentado.** 8px não é degrau da escala de espaçamento e existe no showcase como ajuste de slide 16:9. Na web o card ganha respiro da escala |
| 3 | Numeração com `aria-hidden` em Engenharia e Eletromobilidade, sem em `ProcessSteps` | **Unificado**: o número repete a ordem que o documento já expressa (é um `<ol>`), então é decorativo em toda parte |
| 4 | Margem sob o cabeçalho de seção: 48px (`--space-7`) contra os 40px do showcase | **Mantido.** 40px não pertence à escala de 8px; a regra da grade prevalece. Já registrado na tarefa 1 |

---

## 4. Duplicação de componentes

Cada arquivo novo de `src/components/ui/` foi conferido contra os que já existiam.

### Duplicações encontradas e eliminadas

| # | Duplicação | Correção |
|---|---|---|
| 1 | `SkipLink` reescrevia a aparência do botão sólido: `focus:h-[…] focus:px-5 focus:rounded-full focus:bg-primary focus:font-brand…` | Passou a compor `ButtonLink variant="solid"`. Restaram só as classes de posicionamento e de revelar no foco |
| 2 | `Engineering.tsx` e `Emobility.tsx` repetiam o mesmo bloco de pilar numerado (fio de topo, número em Fraunces, título, texto) com uma diferença de tamanho de título | Extraído para `ui/NumberedItem`, com `tone` e `titleSize`. As duas seções passaram a consumi-lo |

### Verificados, sem duplicação

`Accordion`, `Badge`, `Field`, `Input`/`Textarea`/`Select`, `MediaCard`, `Reveal`,
`Slider`, `Tabs`/`TabPanel` — nenhum tem contraparte no design system nem
sobreposição funcional com componente existente. Cada um resolve uma lacuna já
prevista na tarefa 1.

**Sobreposição parcial anotada, sem ação:** a seção Soluções compõe
`Card` + `FeatureIcon` + `Heading` + `Text` em vez de usar `FeatureCard`, porque
precisa de um número acima do ícone e `FeatureCard` não tem essa posição na
anatomia. É composição de primitivos existentes, não componente novo — não há
duplicação de código a eliminar. Se um terceiro lugar precisar do mesmo arranjo,
o caminho é abrir um slot `leading` em `FeatureCard`.

---

## 5. Build e tipos

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | Sem erro |
| `npm run build` | `✓ 1979 modules transformed` · CSS 37,50 kB (7,86 kB gzip) · JS 416,36 kB (128,71 kB gzip) |
| `npm run test` | 30 de 30 passando |

Um erro de tipo surgiu durante a auditoria e foi corrigido: `NumberedItemProps`
estendia `HTMLAttributes<HTMLElement>`, cujo `title` é `string`, incompatível com
o `ReactNode` do componente. Resolvido com `Omit<…, "title">`, o mesmo tratamento
já aplicado aos outros componentes que recebem título como nó.

---

## 6. Observação de robustez, sem defeito

Durante a auditoria, seções inteiras ficaram presas em `opacity: 0`. A causa é do
ambiente, não do site: com a aba em segundo plano `document.visibilityState` fica
`hidden` e o `IntersectionObserver` não dispara, então o `whileInView` nunca
resolve. Com a aba visível o comportamento é normal — confirmado por captura.

Fica o registro do risco estrutural: com `initial="hidden"` e `once: true`, se o
observador nunca disparar, o conteúdo permanece invisível. Para este site é
aceitável — é uma SPA React, sem JavaScript não há conteúdo nenhum de qualquer
forma — mas é a razão pela qual `prefers-reduced-motion` **não** usa animação
neutralizada: o componente `Reveal` troca o `motion.div` por um elemento estático,
sem estado inicial escondido.

---

## 6b. Erro desta auditoria, corrigido depois

**A seção 3 afirmou que a hierarquia de títulos não tinha salto. Estava errado.**
A verificação leu a sequência de tags como uma lista, sem testar cada transição.
A seção "Como funciona" ia de `h2` direto para `h4`: `ProcessSteps` fixava
`<h4>` no título de cada etapa, copiando o que `showcase.html` faz em `.step h4`.

Pular um nível não reprova WCAG por si só, mas desmonta o sumário do documento
para quem navega por títulos com leitor de tela, e enfraquece a leitura da página
pelo buscador.

Correção: `ProcessSteps` ganhou a prop `headingLevel`, com padrão `h3`. O nível
semântico passou a acompanhar o contexto — dentro de uma seção cujo título é
`h2`, a etapa é `h3` — e **o estilo visual não mudou**: segue Fraunces semibold,
17px, verde 700, como o design system define. O design system determina a
aparência do título, não o seu nível no documento.

Verificado no navegador: um único `h1` e zero saltos na página inteira, agora
com um teste que percorre cada transição em vez de inspecionar a lista.

---

## 7. O que mudou

**Tokens novos:** `--halo-ring-tip` · `--color-text-inverse-muted` ·
`--gradient-emerald-cta` · `--hero-halos` · `--color-step-number` ·
`--icon-size-xl` · `--logo-mark-*` · `--logo-word-*` · `--hover-dim` ·
`--hover-zoom`

**Tokens corrigidos:** `--input-border` (neutro 300 → 400) ·
`--slider-track-bg` (neutro 200 → 300) · `--slider-track-fill` (gradiente → sólido) ·
`--overlay-scrim` (0,85 → 0,92)

**Arquivos novos:** `src/lib/icons.ts` · `src/components/ui/numbered-item.tsx`

**Arquivos reescritos:** `src/components/ui/skip-link.tsx`

**Tema:** `ink-inverse-muted` · `step` · `gradient-emerald-cta` · `hero-halos` ·
`aspect-card` · `aspect-portrait` · `scale-zoom` · `brightness-dim`
