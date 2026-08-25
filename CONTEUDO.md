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
| ~~`site.legalName`~~ | ✅ `JVA Energia Inteligente Ltda.` | **Preenchido** |
| ~~`site.cnpj`~~ | ✅ `45.357.408/0001-53` | **Preenchido** |
| ~~`site.phone`~~ | ✅ `+55 31 99707-3141` | **Preenchido** — mesmo número do WhatsApp. Se surgir uma linha fixa separada, troque só este campo e o `phoneHref` |
| ~~`site.phoneHref`~~ | ✅ `+5531997073141` | **Preenchido** |
| ~~`site.email`~~ | ✅ `contato@haloenergy.com.br` | **Preenchido** |
| ~~`site.instagram`~~ | ✅ `https://instagram.com/halosolarpower` | **Preenchido** |
| ~~`site.instagramHandle`~~ | ✅ `@halosolarpower` | **Preenchido** |
| ~~`site.url`~~ | ✅ `https://www.haloenergy.com.br` | **Preenchido.** Forma `www` porque o apex redireciona para ela |
| `site.openingHours` | `Segunda a sexta, 8h às 18h` | Horário real de atendimento |

### Endereço — `site.address` ✅ preenchido

Rua José da Costa, 116 · São João Batista · CEP 31515-120 · Belo Horizonte / MG.

Conferido contra o registro dos Correios: o CEP 31515-120 corresponde à Rua José
da Costa no bairro São João Batista (Venda Nova). Sem divergência.

**É endereço postal, usado só nos dados estruturados para busca local.** Não
aparece em nenhum texto visível da página, e o site fala em região atendida em vez
de convidar o cliente a comparecer.

O bairro entra dentro de `streetAddress` no JSON-LD, porque o `PostalAddress` do
schema.org não tem campo próprio para bairro — é a convenção usada em endereços
brasileiros.

### Coordenadas — `site.geo` ✅ preenchido

`-19.820417, -43.956333`, convertidas de 19°49'13.5"S 43°57'22.8"W lidas no Google
Maps. Ficam cerca de 10,7 km ao norte do centro de Belo Horizonte, o que bate com
a localização de São João Batista na região de Venda Nova.

## 2. Domínio — resolvido

O domínio de produção é **`https://www.haloenergy.com.br`**. Usamos a forma com
`www` porque o apex (`haloenergy.com.br`) redireciona para ela — o canonical
precisa apontar para o endereço que de fato serve a página, senão o Google indexa
o destino errado.

Já está aplicado nos quatro lugares que precisam andar juntos:

| Arquivo | Onde |
|---|---|
| `index.html` | `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` |
| `public/robots.txt` | linha `Sitemap:` |
| `public/sitemap.xml` | `<loc>` e `<lastmod>` |
| `src/data/site.ts` | `site.url` |

> Se um dia o site passar a servir no apex em vez de `www`, os quatro mudam juntos.

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
| `fotovoltaico-residencia-com-modulos.jpg` | ⚠️ imagem gerada | Residência com módulos no telhado, inversor e baterias na parede. **Ilustrativa** — ver nota abaixo |
| `armazenamento-residencia-com-baterias.jpg` | ⚠️ imagem gerada | Residência à noite com baterias na parede. **Ilustrativa** — ver nota abaixo |

> ⚠️ **As imagens das seções Geração Solar e Armazenamento são geradas por IA.** Ilustram o serviço,
> não documentam obra da Halo — por isso os textos alternativos descrevem a cena
> sem atribuí-la à empresa. Duas ressalvas:
>
> - **Não migre essas imagens para a seção "Halo Engenharia"**, que apresenta obras
>   entregues. Lá, imagem gerada vira afirmação falsa sobre o portfólio.
> - Recortar o selo visível **não remove o SynthID**, a marca invisível que o
>   Google embute no arquivo. A origem continua detectável por quem verificar.
>
> Trocar por fotos reais de instalação residencial resolve as duas coisas.

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
| `COMPENSATION_RATE` | 0,80 | Parcela da conta passível de compensação. Taxa única — o seletor de perfil saiu do simulador |
| `TARIFF_DEFAULT` | R$ 0,95/kWh | Tarifa padrão dos dois simuladores. Agora é editável pelo visitante |
| `SPECIFIC_YIELD` | 4,7 kWh/kWp/dia | Geração específica de referência da região |
| `PRICE_PER_WP` | **R$ 2,30/Wp** | Preço de referência do projeto, equivalente a R$ 2.300/kWp |
| `PAYBACK_MIN_YEARS` / `MAX` | 2,5 a 3 anos | **Faixa declarada, não calculada** — ver nota abaixo |
| `BILL_MIN` / `BILL_MAX` | R$ 200 a R$ 2.000 | Faixa do slider de conta |
| `FUEL_PRICE_DEFAULT` | R$ 6,20/L | Preço de combustível padrão |
| `FUEL_EFFICIENCY_DEFAULT` | 11 km/L | Eficiência padrão do carro a combustão |
| `VEHICLE_CONSUMPTION` | 14 / 17 / 20 / 24 kWh/100 km | Consumo por porte de veículo |

> ⚠️ **O payback exibido não fecha com a aritmética das outras constantes.**
> Com preço de R$ 2,30/Wp e compensação de 80%, o retorno calculado dá cerca de
> **1,8 ano** — abaixo da faixa de 2,5 a 3 anos apresentada. A diferença não é
> erro de conta: é que a economia real não é 80% cheios da conta, e o cálculo não
> considera custos de operação. Por isso o payback aparece como faixa declarada,
> e não como número derivado — evita mostrar uma precisão que as premissas não
> sustentam. Para os dois números conversarem, a engenharia precisa revisar a
> taxa de compensação ou o preço por Wp.

Mudou a tarifa ou a regra de compensação? Ajuste aqui e rode `npm run test` —
os testes conferem a coerência entre as fórmulas.

---

## 6. Antes de publicar — checagem final

- [x] WhatsApp real em `WHATSAPP_NUMBER` — falta testar o link num celular
- [x] Telefone, e-mail e Instagram preenchidos
- [x] Razão social e CNPJ preenchidos
- [x] Endereço postal preenchido e conferido nos Correios
- [x] Coordenadas da sede em `site.geo`
- [ ] Domínio atualizado nos quatro arquivos
- [x] Seis fotos reais nos cards da seção Halo Engenharia
- [ ] Duas imagens de seção ainda em placeholder (fotovoltaico e armazenamento)
- [ ] Endpoint do formulário configurado (ou decisão consciente de usar só WhatsApp)
- [ ] FAQ revisada por engenharia
- [ ] Premissas dos simuladores validadas
- [ ] `npm run build` e `npm run test` passando
