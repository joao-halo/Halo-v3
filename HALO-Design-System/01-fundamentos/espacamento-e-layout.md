# Espaçamento e Layout — HALO Design System

Espaço generoso e alinhamento rigoroso são o que dão o ar **corporativo e premium**
do template. Tudo se baseia numa grade de **8px**.

---

## 1. Escala de espaçamento (base 8px)

| Token | Valor | Uso típico |
|-------|-------|------------|
| `--space-1` | 4px | Espaços mínimos (ícone↔texto) |
| `--space-2` | 8px | Entre elementos próximos |
| `--space-3` | 12px | Padding interno pequeno |
| `--space-4` | 16px | Padding padrão |
| `--space-5` | 24px | Gutter da grade, entre cards |
| `--space-6` | 32px | Padding de card, entre blocos |
| `--space-7` | 48px | Entre seções |
| `--space-8` | 64px | Margem de slide |
| `--space-9` | 96px | Respiro de capa |
| `--space-10` | 128px | Grandes vazios editoriais |

> **Regra:** sempre múltiplos de 8 (4 só para ajustes finos). Consistência > exatidão.

---

## 2. Grade

- **Web / documentos:** 12 colunas, gutter de 24px (`--space-5`), container máx. **1200px**.
- **Slides:** formato **16:9** (1280×720 ou 1920×1080), margem de segurança de **64px**.

Layouts recorrentes do template:
- **Meio a meio** (texto | imagem) — 6 + 6 colunas.
- **Terços** — 3 cards de 4 colunas (estatísticas, features, equipe).
- **Quartos** — 4 cards de 3 colunas (ícones de serviço).
- **Imagem dominante** — imagem 7–8 col + caixa de texto sobreposta.

---

## 3. Raio de borda

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-none` | 0 | Caixas/imagens corporativas (estilo template) |
| `--radius-sm` | 4px | Inputs, tags |
| `--radius-md` | 8px | Cards |
| `--radius-lg` | 16px | Cards de destaque, painéis |
| `--radius-xl` | 24px | Containers grandes |
| `--radius-full` | 999px | **Botões pílula** (referência HALO) |

> Mistura característica HALO: **caixas/imagens retas** (corporativo) + **botões pílula** (marca).

---

## 4. Elevação (sombras)

Sombras sutis e difusas — os cards "flutuam" levemente, como no template.

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(15,16,17,.06)` | Bordas sutis |
| `--shadow-md` | `0 4px 12px rgba(15,16,17,.08)` | Cards padrão |
| `--shadow-lg` | `0 12px 28px rgba(15,16,17,.12)` | Cards em destaque / hover |
| `--shadow-xl` | `0 24px 48px rgba(15,16,17,.16)` | Modais, caixas sobre imagem |

---

## 5. Princípios de layout

1. **Alinhe a tudo.** Comece todo texto na mesma margem esquerda; use linhas finas como guia.
2. **Respire.** Prefira vazio a aperto — espaço em branco transmite confiança.
3. **Linhas-régua.** O fio horizontal fino (1px, neutro 300 ou ouro) é um recurso de marca.
4. **Ritmo.** Use a escala de espaçamento; não invente valores avulsos.
5. **Contraste de blocos.** Alterne seções claras e um bloco grafite (`neutral-800`) para dar ritmo.
