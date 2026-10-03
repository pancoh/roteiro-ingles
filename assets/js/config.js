/* Configuração compartilhada: links, recursos e micro-hábitos.
   Carregado antes dos arquivos de semana. */

const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const tedq = q => "https://www.ted.com/search?q=" + encodeURIComponent(q);

const R = {
  anki: { n: "Anki", u: "https://apps.ankiweb.net/", d: "Flashcards com repetição espaçada" },
  lr: { n: "Language Reactor", u: "https://www.languagereactor.com/", d: "Legendas duplas e mining no YouTube e na Netflix" },
  yg: { n: "YouGlish", u: "https://youglish.com/", d: "Ouça qualquer palavra em vídeos reais" },
  camb: { n: "Cambridge Dictionary", u: "https://dictionary.cambridge.org/", d: "Definições em inglês simples" },
  cambg: { n: "Cambridge Grammar", u: "https://dictionary.cambridge.org/grammar/british-grammar/", d: "Explicações de gramática com exemplos" },
  bbc: { n: "BBC Learning English", u: "https://www.bbc.co.uk/learningenglish/", d: "6 Minute English, News Review, English at Work" },
  voa: { n: "VOA Learning English", u: "https://learningenglish.voanews.com/", d: "Notícias com fala pausada e transcrição" },
  nil: { n: "News in Levels", u: "https://www.newsinlevels.com/", d: "A mesma notícia em três níveis" },
  bne: { n: "Breaking News English", u: "https://breakingnewsenglish.com/", d: "Notícias em vários níveis com exercícios" },
  ted: { n: "TED", u: "https://www.ted.com/talks", d: "Palestras com transcrição interativa" },
  readlang: { n: "Readlang", u: "https://readlang.com/", d: "Leitura com tradução por clique" },
  efset: { n: "EF SET", u: "https://www.efset.org/", d: "Teste gratuito de nível" },
  raindrop: { n: "Raindrop.io", u: "https://raindrop.io/", d: "Pastas do barril para textos e links" },
  pocketcasts: { n: "Pocket Casts", u: "https://pocketcasts.com/", d: "Podcasts com filas por nível" },
  rachel: { n: "Rachel's English", u: yt("Rachel's English reductions"), d: "Pronúncia americana e formas reduzidas" },
  toast: { n: "Toastmasters", u: "https://www.toastmasters.org/find-a-club", d: "Clubes de oratória, inclusive online" }
};

const MICRO = [
  "Ao acordar, diga em voz alta 3 coisas que vai fazer hoje (\"Today I'm going to...\").",
  "No banho, fale sozinho 2 minutos sobre uma notícia que ouviu.",
  "Ao andar ou dirigir, narre o que vê na rua (\"The bus lane is blocked by a truck.\").",
  "Ao cozinhar ou limpar, narre suas ações (\"I'm chopping the onions.\").",
  "Quando não souber uma palavra, pesquise na hora e anote na nota 'Lacunas' do celular.",
  "Faça um monólogo interno em inglês durante uma tarefa rotineira.",
  "Grave 1 minuto de áudio contando como foi o seu dia."
];

const DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const DAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/* Cada arquivo em semanas/ adiciona uma semana a esta lista. */
const WEEKS = [];
