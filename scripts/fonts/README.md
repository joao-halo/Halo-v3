# Fontes de build

Cópias estáticas de **Fraunces 700** e **Outfit 600** (Google Fonts, licença SIL OFL),
usadas apenas por `scripts/generate-images.mjs` para converter texto em contornos
vetoriais ao gerar `public/og.jpg`.

Não são carregadas pelo site — a página usa as mesmas famílias direto do Google Fonts,
como manda o design system. Estes arquivos existem porque o rasterizador não tem acesso
às fontes da web, e o cartão de compartilhamento precisa sair na tipografia da marca.
