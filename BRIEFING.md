# Briefing — studio-organico

> O Claude faz estas perguntas (uma rodada, pode ser tudo de uma vez) antes do 1º post de uma
> marca nova. As respostas viram o `projetos/<marca>/brand.json` + a base de copy. Se o usuário
> mandar o **site**, o Claude tenta extrair sozinho (paleta/tom/logo) e só confirma o que faltou.

## 1. Empresa
1. Nome da empresa e **o que ela faz em 1 frase**.
2. Site / Instagram (@handle).
3. **Bordão/slogan** (se tiver).

## 2. Público e mensagem
4. **Cliente ideal (ICP):** quem é, e qual a **dor nº 1** que vocês resolvem.
5. **Tese central:** a ideia que TODO post reforça (ex.: "execução virou commodity; quem cresce decide melhor com IA").
6. **Pilares de conteúdo:** 3–5 temas recorrentes.

## 3. Tom de voz
7. Tom (marque/descreva): educacional? provocativo? técnico? leve? sóbrio?
8. Palavras/expressões que **usa** e que **evita**. Pode ter palavrão? Há clichês proibidos?

## 4. Identidade visual  (vira o `palette`/`fonts`/`assets` do brand.json)
9. **Cores** (hex): fundo claro, cor de texto, **accent** (cor da marca), accent vivo (brilho), fundo escuro. *Não sabe? Manda o site/logo que eu extraio.*
10. **Fontes:** título (serif), corpo (sans), labels (mono). *Sem preferência → uso o default premium (Fraunces / Space Grotesk / JetBrains Mono).*
11. **Logo (wordmark)** em versão **clara** e **escura** (SVG/PNG) + **foto de perfil**.

## 5. Imagem-gancho (a alma do formato)
12. Que **ícones/figuras/cenas** combinam com o tema de vocês? (ex.: p/ IA → Steve Jobs, Musk; p/ vendas → "lobo de Wall Street"; p/ finanças → cenas de mercado). Serve de banco pra "imagem que conversa com a copy".
13. Algum **concorrente/assunto a NÃO citar**? Alguma restrição legal?

---
### Saída do briefing
- `projetos/<marca>/brand.json` (preenchido a partir das respostas — copiar de `brand.exemplo.json`).
- Pasta `projetos/<marca>/assets/` (logos + perfil) e `projetos/<marca>/img/` (imagens dos posts).
- Resumo de **tom + tese + pilares** que guia a copy (o Claude mantém em mente / salva em `projetos/<marca>/marca.md`).
