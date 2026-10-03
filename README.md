# Roteiro de Inglês

Roteiro semanal de estudo de inglês baseado em Natural Method e Comprehensible Input.
Cobre a Semana 0 (configuração do ambiente) e as 12 semanas da Fase 1 (Fundação).

**Acesso:** https://pancoh.github.io/roteiro-ingles/

## O que o site oferece

- Um tema por semana, com tópico gramatical, de 70 a 76 palavras e expressões e recursos recomendados.
- Uma atividade diária de 30 minutos. Ao clicar no dia, aparecem as tarefas, o recurso e o tempo de cada uma.
- Checklist de dias concluídos e porcentagem geral de progresso no topo.
- Marcação das palavras que você já conhece.
- Prompts de IA prontos para correção de texto e roleplay, com botão de copiar.

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
