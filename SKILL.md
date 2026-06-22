---
name: studio-organico
description: Produz conteúdo orgânico premium para Instagram (CARROSSEL e ESTÁTICO, 1080x1350) para qualquer marca, a partir de um briefing. Estilo editorial (serifa + accent + grão) com imagem real que conversa com a copy (capa-ícone full-bleed estilo "G4"). Use quando o usuário pedir "criar post/carrossel/estático", "conteúdo pro Instagram", "post orgânico", "social media", "feed", ou quando configurar uma marca nova para produção de posts. Ative com /studio-organico.
---

# studio-organico — fábrica de conteúdo orgânico (white-label)

Você produz **carrosséis e posts estáticos** (4:5, 1080×1350) prontos pra postar, com a
identidade da marca do usuário. Metodologia destilada da Orna (engine editorial + motor de
imagens). Funciona para QUALQUER empresa via um `brand.json`.

## DUAS REGRAS FIRMES (nunca quebrar)

1. **A imagem SEMPRE se relaciona com a copy.** Pergunte "por que ESTA imagem pra ESTE texto?".
   Nada de foto bonita genérica. Formas de relacionar (seja criativo, não só ícone):
   - **Ícone/figura** que encarna o tema (ex.: IA → Steve Jobs/Musk; vendas → "lobo de Wall Street").
   - **Metáfora/cena** (cuidado: tem que conversar com o negócio).
   - **Contraste** (antes/depois, mito×verdade).  - **Pessoa/ICP** quando a copy fala com ele.
2. **Cor da capa = cor do post inteiro.** Capa escura (imagem full-bleed) → todos os slides
   `dark:true`. Capa clara → tudo claro. Nunca misturar.

E copy **sem cara de IA**: sem travessão (—), sem clichê ("não apenas… mas também", "vale ressaltar"),
sem paralelismo robótico. Teste do voz alta. Gancho forte + provocativo + educacional.

## PASSO 0 — Marca nova? Rodar o briefing

Se não existir `projetos/<marca>/brand.json`, faça as perguntas de `BRIEFING.md` (ou extraia do
site se o usuário mandar). Depois:
- crie `projetos/<marca>/` com `brand.json` (copie de `brand.exemplo.json`, troque cores/fontes/
  assets — caminhos **absolutos file://**), `assets/` (wordmark claro+escuro, perfil) e `img/`.
- salve um `marca.md` curto (tese, ICP, tom, pilares) pra guiar a copy.
Sem fontes preferidas → use o default (Fraunces / Space Grotesk / JetBrains Mono).
Sem paleta → extraia do site/logo; o significado de cada cor está em `brand.exemplo.json`.

## FLUXO de produção (cada pedido)

1. **Copy primeiro.** Defina o(s) post(s):
   - **Carrossel** (5–7 slides): capa (gancho) → diagnóstico → mecanismo/virada → CTA. Varie o arquétipo.
   - **Estático** (1 slide): uma ideia só, forte — `bignum`, `mito`, `quote`, `checklist` ou `cards`.
   Escreva na voz da marca (marca.md). Use `{{destaque}}` p/ palavra-chave e `<b>negrito</b>`.
2. **Imagem que relaciona.** Escolha o conceito (regra 1). Puxe candidatas:
   `engine/buscar-imagens.ps1 -Termos @("capa::<termo>","prova::<termo>") -Qtd 14`
   (ou peça a imagem ao usuário). Opcional: recorte de fundo com `rembg`
   (`py -m pip install --user rembg`; `from rembg import remove`).
   Coloque a escolhida em `projetos/<marca>/img/<nome>.jpg` (o `brand.assets.imgUrl` aponta pra cá).
3. **Monte o `conteudo.json`** (ver `exemplos/conteudo.exemplo.json`): lista de `posts`, cada um
   `tipo:"carrossel"` (com `slides[]`) ou `tipo:"estatico"` (com `slide`). `dark:true` no post quando a capa for escura.
4. **Gere e renderize:**
   `node engine/gerar.mjs projetos/<marca>/brand.json conteudo.json out`
   depois `pwsh engine/render.ps1 -OutDir out`  (ou `bash engine/render.sh out` no Mac).
   PNGs saem em `out/png/`.
5. **QA**: gere uma miniatura/contato e CONFIRA legibilidade e margens antes de entregar. Corrija e
   re-renderize. Entregue os PNGs (e a legenda do post, se pedida).

## Cardápio de templates (campo `t`)

| `t` | uso | campos |
|---|---|---|
| `coverFull` | **capa imagem inteira** (ícone) — post vai dark | `photo.img`, `title`, `sub?` |
| `cover` | capa com foto no painel lateral (post claro) | `photo:{mode:"strip",img}`, `title`, `sub?` |
| `bignum` | um número forte (ótimo estático) | `num`, `label`, `ctx?` |
| `cards` | lista de itens em cartões | `title`, `cards:[{n?,t,s?}]`, `footer?` |
| `checklist` | lista com ✓ | `title`, `items:[...]`, `footer?` |
| `mecanismo` | passos numerados (método) | `title`, `steps:[{t,d}]`, `anchor?` |
| `mito` | mito × verdade (estático forte) | `title`, `mito`, `verdade` |
| `quote` | citação/manifesto grande | `text`, `attrib?` |
| `mapa` | 4 pilares em grade | `title`, `pillars:[{l,t,d}]` |
| `prova` | headline de prova + fonte | `headline`, `source`, `quote?` |
| `cta` | fechamento (perfil + botão) | `title`, `cta?`, `btn?` |

Modificadores em qualquer slide: `dark:true` (fundo escuro), `accent:"red"` (negativo) ou `"copa"` (verde/amarelo), default = accent da marca.

## Gotchas (já tratados, mas saiba)
- **Render:** Chrome headless precisa de `--user-data-dir` próprio, `--virtual-time-budget` (carregar fontes) e `--allow-file-access-from-files` (ler imagem/logo locais). Use os scripts `render.*`.
- **Card no escuro:** o engine já força texto escuro em `.card/.quotecard/.mapa .p` (senão sumiria). Não remover.
- **Direito de imagem:** rosto de pessoa famosa em post comercial tem risco. Avise o usuário; pra publicar de verdade, decidir (assumir risco / caricatura / imagem gerada). Imagens do Pinterest são de terceiros.

## Dependências
Node 18+ (engine), Python + `gallery-dl` (motor; `rembg` opcional p/ recorte), Google Chrome (render). Fontes carregam via Google Fonts (precisa de internet no render).
