# Placeholders a preencher

Tudo que está no site hoje como dado provisório, com o arquivo e a linha onde
trocar. **Nada nesta lista foi inventado** — telefone, CNPJ, endereço e números de
faturamento estão marcados como placeholder justamente para não entrarem no ar
como se fossem reais.

Enquanto um item desta lista não for resolvido, o site não deve ser publicado.

---

## 1. Contato e identificação — `src/data/site.ts`

| Campo | Valor atual | O que colocar |
|---|---|---|
| ~~`WHATSAPP_NUMBER`~~ | ✅ `5531997073141` | **Preenchido** — +55 31 99707-3141. Alimenta todos os CTAs e o botão flutuante |
| `site.legalName` | `PLACEHOLDER — Razão Social Ltda.` | Razão social registrada, como aparece no contrato social |
| `site.cnpj` | `PLACEHOLDER — 00.000.000/0001-00` | CNPJ formatado |
| ~~`site.phone`~~ | ✅ `+55 31 99707-3141` | **Preenchido** — mesmo número do WhatsApp. Se surgir uma linha fixa separada, troque só este campo e o `phoneHref` |
| ~~`site.phoneHref`~~ | ✅ `+5531997073141` | **Preenchido** |
| ~~`site.email`~~ | ✅ `contato@haloenergy.com.br` | **Preenchido** |
| ~~`site.instagram`~~ | ✅ `https://instagram.com/halosolarpower` | **Preenchido** |
| ~~`site.instagramHandle`~~ | ✅ `@halosolarpower` | **Preenchido** |
| `site.url` | `https://www.halosolarenergy.com.br` | ⚠️ **Conferir.** O e-mail da empresa é `@haloenergy.com.br`, sem o "solar" — o domínio do site provavelmente é `haloenergy.com.br`. Enquanto não confirmado, ficou como está. Ver a seção 2 |
| `site.openingHours` | `Segunda a sexta, 8h às 18h` | Horário real de atendimento |

### Endereço — `site.address`

| Campo | O que colocar |
|---|---|
| `street` | Logradouro e número |
| `district` | Bairro |
| `postalCode` | CEP |

`city`, `state` e `country` já estão preenchidos (Belo Horizonte / MG / BR).

### Coordenadas — `site.geo`

Estão no centro de Belo Horizonte (`-19.9167, -43.9345`), não na sede. Substitua
pela latitude e longitude reais do endereço — elas entram no JSON-LD que o Google
usa para busca local. Pegue no Google Maps: clique com o botão direito sobre o
ponto e copie o par de números.

---

## 2. Domínio — quatro arquivos que mudam juntos

> ⚠️ **Pendência aberta.** O e-mail comercial confirmado é
> `contato@haloenergy.com.br`, mas o domínio provisório do site é
> `halosolarenergy.com.br`. Os dois não batem. Se o domínio real for
> `haloenergy.com.br`, os quatro arquivos abaixo precisam ser trocados juntos —
> canonical, Open Graph, `robots.txt` e `sitemap.xml` apontando para um endereço
> errado quebram a indexação e o cartão de compartilhamento.

O domínio provisório `https://www.halosolarenergy.com.br` aparece em:

| Arquivo | Onde |
|---|---|
| `index.html` | `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` |
| `public/robots.txt` | linha `Sitemap:` |
| `public/sitemap.xml` | `<loc>` e `<lastmod>` (colocar a data da publicação) |
| `src/data/site.ts` | `site.url` |

Se o domínio final for outro, os quatro precisam ser atualizados — senão o cartão
de compartilhamento e a indexação apontam para um endereço que não existe.

---

## 3. Imagens — `public/images/`

### Seção "Halo Engenharia" — cards 800×600 (4:3)

As seis são fotos reais de obra, já recortadas para o formato do card.

| Arquivo | Situação | O que mostra |
|---|---|---|
| `projeto-fotovoltaico-residencial.jpg` | ✅ foto real | Sistema em telhado cerâmico residencial |
| `projeto-fotovoltaico-comercial.jpg` | ✅ foto real | Usina em estrutura de solo, em encosta |
| `projeto-fotovoltaico-ci.jpg` | ✅ foto real | Usina de grande porte em campo aberto |
| `projeto-baterias-armazenamento.jpg` | ✅ foto real | Inversor híbrido e infraestrutura |
| `projeto-eletromobilidade-eletroposto.jpg` | ✅ foto real | Eletroposto com carregadores e vagas |
| `projeto-operacao-manutencao.jpg` | ✅ foto real | Inspeção termográfica de módulos em campo |

### Imagens de seção — 900×1100 (retrato)

| Arquivo | Situação | O que a foto deve mostrar |
|---|---|---|
| `fotovoltaico-instalacao-modulos.jpg` | ⬜ placeholder | Equipe em obra instalando módulos |
| `armazenamento-banco-baterias-sala-tecnica.jpg` | ⬜ placeholder | Banco de baterias com quadro de comando |

### Como substituir

Deixe o arquivo com **o mesmo nome** e **a mesma proporção** (4:3 nos cards,
retrato nas de seção) em `public/images/`, e revise o `alt` correspondente em
`src/data/content.ts`.

Se a foto vier do celular, dois cuidados:

- **HEIC não abre em navegador.** Converta: `sips -s format jpeg "Foto.HEIC" --out foto.jpg`
- **A conversão pode perder a orientação** e sair deitada. Confira antes de subir;
  para girar: `sips -r 90 foto.jpg` (90, 180 ou 270).

`npm run generate:images` **não sobrescreve** foto já colocada — só preenche o que
estiver faltando. Para regerar todos os placeholders do zero:
`npm run generate:images -- --force`.

> Se a foto mostrar rosto de cliente ou o interior de um imóvel identificável,
> guarde a autorização de uso de imagem antes de publicar.

### Cartão de compartilhamento — `public/og.jpg`

Gerado a partir dos assets de marca (anel Aurora + tipografia Fraunces/Outfit).
Não é placeholder genérico e pode ir ao ar como está. Para mudar a frase, edite
`scripts/generate-images.mjs` e rode `npm run generate:images`.

---

## 4. Formulário — `.env`

| Variável | Situação |
|---|---|
| `VITE_FORM_ENDPOINT` | **Não configurada.** Sem ela, o formulário abre o WhatsApp com os dados preenchidos. Para receber por e-mail, crie um endpoint (Formspree, Basin, Getform, Web3Forms…) e coloque a URL. Ver README |

---

## 5. Conteúdo a validar com a empresa

Estes textos foram escritos para o site, mas descrevem a operação da Halo e
precisam de conferência de quem conhece o dia a dia:

| Onde | O que conferir |
|---|---|
| `src/data/faq.ts` | As 12 respostas, em especial prazos de homologação, condições de garantia e periodicidade de manutenção — variam por distribuidora, fabricante e tipo de instalação |
| `src/data/content.ts` → `projects` | Os títulos e categorias dos seis projetos devem corresponder a obras realmente entregues |
| `src/data/content.ts` → `process` | As quatro etapas devem refletir o processo real de atendimento |
| `src/data/content.ts` → `emobility.chargers` | As potências oferecidas (7,4 / 11 / 22 kW e DC) devem bater com o que a Halo instala |

### Premissas dos simuladores — `src/lib/calc.ts`

Os simuladores mostram **ordem de grandeza**, com disclaimer visível. As premissas
são de referência e devem ser revisadas por engenharia antes de publicar:

| Constante | Valor | O que é |
|---|---|---|
| `COMPENSATION_RATES` | 0,80 / 0,75 / 0,70 | Parcela da conta compensável por perfil |
| `REFERENCE_TARIFF` | R$ 0,95/kWh | Tarifa usada para converter reais em energia |
| `SPECIFIC_YIELD` | 4,7 kWh/kWp/dia | Geração específica de referência da região |
| `ANNUAL_ADJUSTMENT` | 8% ao ano | Reajuste assumido no horizonte de 25 anos |
| `FUEL_PRICE_DEFAULT` | R$ 6,20/L | Preço de combustível padrão do simulador |
| `FUEL_EFFICIENCY_DEFAULT` | 11 km/L | Eficiência padrão do carro a combustão |
| `VEHICLE_CONSUMPTION` | 14 / 17 / 20 / 24 kWh/100 km | Consumo por porte de veículo |

Mudou a tarifa ou a regra de compensação? Ajuste aqui e rode `npm run test` —
os testes conferem a coerência entre as fórmulas.

---

## 6. Antes de publicar — checagem final

- [x] WhatsApp real em `WHATSAPP_NUMBER` — falta testar o link num celular
- [x] Telefone, e-mail e Instagram preenchidos
- [ ] Razão social, CNPJ e endereço preenchidos
- [ ] Domínio de produção confirmado (`haloenergy.com.br` ou `halosolarenergy.com.br`)
- [ ] Coordenadas da sede corrigidas no `site.geo`
- [ ] Domínio atualizado nos quatro arquivos
- [x] Seis fotos reais nos cards da seção Halo Engenharia
- [ ] Duas imagens de seção ainda em placeholder (fotovoltaico e armazenamento)
- [ ] Endpoint do formulário configurado (ou decisão consciente de usar só WhatsApp)
- [ ] FAQ revisada por engenharia
- [ ] Premissas dos simuladores validadas
- [ ] `npm run build` e `npm run test` passando
