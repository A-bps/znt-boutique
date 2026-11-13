# ZNT Boutique

Site de moda feminina em HTML, CSS e JavaScript, baseado no conceito visual aprovado no Google Stitch.

## Executar localmente

Com Node.js instalado, execute na raiz:

```sh
npx --yes serve dist -l 4187
```

Abra `http://localhost:4187`.

## Estrutura

- `dist/index.html`: home, carrossel, vitrine e categorias.
- `dist/lancamentos.html`: busca, filtros, ordenação e favoritos.
- `dist/produto.html`: ficha da peça, fotos com zoom e compra pelo WhatsApp.
- `dist/catalogo.js`: produtos e variantes.
- `dist/navigation.js` e `navigation.css`: cabeçalho, menu e rodapé.
- `dist/assets/`: imagens locais.

Não há etapa de build. O diretório a servir em uma hospedagem estática é `dist`.

## Funcionamento

Favoritos são armazenados no `localStorage` do navegador, sem login ou sincronização entre aparelhos. A compra abre o WhatsApp da loja com produto, cor e tamanho; não há checkout, estoque ou banco de dados integrado.

A fotografia tem ampliação ao mover o cursor no desktop e abertura por toque no celular. Para cadastrar várias fotos reais, adicione `images: ['assets/foto-1.jpg', 'assets/foto-2.jpg']` ao produto. As miniaturas aparecem quando há mais de uma foto.

## Estado atual

Protótipo com imagens, produtos e preços demonstrativos. Antes do lançamento, substituir pelo catálogo real e confirmar informações institucionais, condições comerciais e políticas. As páginas permanecem com `noindex` durante essa fase.

Relatórios internos, capturas e backups locais não são enviados ao repositório. Nenhuma credencial é necessária para executar o site.
