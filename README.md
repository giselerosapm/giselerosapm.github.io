# Portfólio — Gisele Rosa

Site estático de portfólio de produto. HTML + CSS + JS puro, sem build,
publicado no GitHub Pages.

## Rodar local

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`. Precisa ser via servidor (não `file://`), porque a
tradução para inglês é carregada com `fetch`.

## Estrutura

```
index.html          home: sobre, experiências e índice de cases
cases/*.html         um arquivo por case (assinatura, customer-journey, vencimento)
favicon.svg          ícone
robots.txt           regras de indexação
sitemap.xml          mapa do site (trocar o domínio antes de publicar)
assets/css          tokens → base → layout → components → case (nessa ordem)
assets/js           i18n (PT/EN), reveal (scroll), main (boot)
content/en.json     traduções; o português vive no HTML
docs/               documentação do projeto — comece por docs/00-brief.md
```

## Documentação

| Arquivo | O que tem |
|---|---|
| `docs/00-brief.md` | Objetivo, público, escopo, decisões e regra de confidencialidade |
| `docs/01-design-system.md` | Cor, tipografia, espaçamento, componentes, acessibilidade |
| `docs/02-arquitetura.md` | Estrutura de arquivos, i18n, convenções, checklist de publicação |
| `docs/03-deploy.md` | Como publicar no GitHub Pages |
| `docs/04-estrutura-do-case.md` | Os 7 blocos de um case e as regras de escrita |
| `docs/05-backlog.md` | O que está feito e o que falta |
| `docs/06-resumo-executivo-materiais.md` | Leitura de tudo que existe na pasta `materiais/` |
| `docs/07-seo-performance.md` | SEO, performance e segurança: feito e pendente |
| `docs/08-numeros-publicaveis.md` | Todo número que está no site e por que ele pode estar |
| `docs/cases/*.md` | Status e pendências de cada case |

## Como adicionar conteúdo a um case

1. Responda as perguntas em `docs/cases/<n>-<slug>.md`.
2. Abra `cases/<slug>.html` e preencha as seções — a ordem dos blocos está fixa
   e comentada no HTML.
3. Para cada texto novo, adicione `data-i18n="chave"` e a tradução em
   `content/en.json`.
4. Rode local, confira em 375px de largura, e leia `docs/02-arquitetura.md`
   → "Checklist antes de cada publicação".

## Antes de commitar

Repositório público. Nada de dado real de cliente, receita, custo unitário, print
de dashboard interno ou documento da empresa — apagar depois não limpa o histórico
do Git. A regra completa está em `docs/00-brief.md`.
