# Roteiro de Inglês

Roteiro semanal de estudo de inglês baseado em Natural Method e Comprehensible Input.
Cobre a Semana 0 (configuração do ambiente) e as 12 semanas da Fase 1 (Fundação).

**Acesso:** https://ramson.com.br/roteiro-ingles/

## O que o site oferece

- Um tema por semana, com tópico gramatical, de 70 a 76 palavras e expressões e recursos recomendados.
- Uma atividade diária de 30 minutos. Ao clicar no dia, aparecem as tarefas, o recurso e o tempo de cada uma.
- Checklist de dias concluídos e porcentagem geral de progresso no topo.
- Marcação das palavras que você já conhece.
- Prompts de IA prontos para correção de texto e roleplay, com botão de copiar.

## Avaliação semanal com o Claude

1. Em cada dia, registre a dificuldade (1 a 5), a compreensão do áudio ou vídeo, o tempo real e onde travou.
2. No domingo, clique em **Pedir ajuste ao Claude**. O Claude Opus 5.5 lê as avaliações e ajusta os dias da semana seguinte, mantendo 30 minutos por dia.
3. A semana seguinte mostra o diagnóstico, os dias ajustados e o motivo de cada mudança. É possível voltar ao plano original.

**Chave da API:** configure no botão **Claude**, no topo. A chave fica só no `localStorage` do navegador. Ela não entra no repositório nem no arquivo de exportação. Crie a chave em [platform.claude.com](https://platform.claude.com/) e defina um limite de gasto.

**Sem chave:** o botão **Ajuste automático** aplica regras simples (dificuldade média e compreensão) e não gera custo.

**Custo estimado:** de US$ 0,05 a US$ 0,10 por avaliação semanal.

A lógica fica em `assets/js/coach.js`. O SDK oficial (`@anthropic-ai/sdk`) é carregado da CDN esm.sh apenas quando uma avaliação é pedida.

## Progresso entre aparelhos

O progresso fica salvo no navegador de cada aparelho (localStorage). Para continuar em outro aparelho:

1. No aparelho atual, clique em **Exportar progresso** (rodapé). Um arquivo `.json` será baixado.
2. No outro aparelho, clique em **Importar progresso** e escolha esse arquivo.

## Estrutura

```
roteiro-ingles/
  index.html                 página principal
  assets/
    css/styles.css           estilos (tema claro e escuro)
    img/favicon.svg          ícone
    js/config.js             links, recursos e micro-hábitos compartilhados
    js/semanas/semana-NN.js  conteúdo de cada semana
    js/coach.js              avaliação semanal com o Claude e regras automáticas
    js/app.js                montagem dos dias, estado e renderização
  docs/plano-de-estudos.md   plano completo que deu origem ao roteiro
  .nojekyll                  publica os arquivos sem processamento do Jekyll
```

## Como editar ou adicionar semanas

Cada semana é um arquivo em `assets/js/semanas/`. Para criar uma nova semana:

1. Copie um arquivo existente (por exemplo, `semana-12.js`) para `semana-13.js`.
2. Altere `n`, o tema, a gramática, o vocabulário e os recursos.
3. Adicione `<script src="assets/js/semanas/semana-13.js"></script>` no `index.html`, antes de `app.js`.

O vocabulário usa uma linha por item, no formato `palavra | tradução`. Linhas que começam com `#` criam um grupo.

Os dias seguem um modelo fixo (escuta, gramática e shadowing, leitura e escrita, roleplay, rewatch, fala pública, revisão). Para trocar o domingo de uma semana, use o campo `sunday`. Para definir todos os dias à mão, use o campo `days` (veja `semana-00.js`).

## Uso local

Abra o `index.html` direto no navegador. Não precisa de servidor nem de instalação.
