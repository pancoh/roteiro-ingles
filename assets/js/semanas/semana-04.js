/* Semana 4 */
WEEKS.push({
  n: 4,
  pt: "Notícias e atualidades",
  en: "Talking about the news",
  why: "Entender notícias treina o ouvido para fala rápida e dá assunto para conversas e opiniões.",
  grammar: {
    t: "Past simple x past continuous", en: "past simple vs past continuous",
    explain: [
      "Past simple: ação concluída em um momento do passado ('The mayor announced...').",
      "Past continuous: ação em andamento no passado, o cenário ('People were waiting...').",
      "Juntos: a ação longa (continuous) é interrompida pela curta (simple)."
    ],
    ex: ["The government announced a new plan yesterday.", "While I was reading the news, my phone rang.", "Prices went up last month."]
  },
  vocab: `
# Palavras-chave
headline | manchete
breaking news | notícia urgente
article | artigo
report | reportagem
source | fonte
journalist | jornalista
anchor | âncora (TV)
election | eleição
government | governo
policy | política (diretriz)
law | lei
bill | projeto de lei
economy | economia
inflation | inflação
unemployment | desemprego
budget | orçamento
tax | imposto
protest | protesto
strike | greve
crisis | crise
issue | questão, problema
climate change | mudança climática
flood | enchente
drought | seca
wildfire | incêndio florestal
outbreak | surto
survey | pesquisa
poll | pesquisa de opinião
rate | taxa
increase | aumento
decrease | queda
agreement | acordo
summit | cúpula
spokesperson | porta-voz
scandal | escândalo
trend | tendência
public opinion | opinião pública
witness | testemunha
authorities | autoridades
# Verbos
announce | anunciar
report on | noticiar, relatar
claim | alegar
deny | negar
confirm | confirmar
reveal | revelar
approve | aprovar
ban | proibir
raise | aumentar (algo)
cut | cortar
rise | subir
fall | cair
launch | lançar
warn | alertar
investigate | investigar
vote | votar
resign | renunciar
hit a record | bater recorde
spread | espalhar-se
break out | começar de repente
follow the news | acompanhar as notícias
# Expressões
according to | de acordo com
on the rise | em alta
in the wake of | logo após
fake news | notícia falsa
a hot topic | um tema em alta
to make headlines | virar manchete
behind the scenes | nos bastidores
in the long run | a longo prazo
to keep up with | acompanhar
it remains to be seen | ainda não se sabe
the bottom line | o essencial
did you hear about...? | você ficou sabendo de...?
apparently | ao que parece
as far as I know | até onde sei
`,
  resources: [R.bbc, R.nil, R.voa, R.cambg, R.anki],
  clip: { n: "BBC Learning English: News Review", u: yt("BBC Learning English News Review"), d: "Notícia real explicada pelo vocabulário das manchetes." },
  article: { n: "News in Levels: notícia da semana", u: "https://www.newsinlevels.com/", d: "Leia no nível 3." },
  write: "resuma uma notícia da semana com past simple e past continuous e dê sua opinião em duas frases",
  rp: { pt: "Café com um colega: você conta uma notícia que leu e ele faz perguntas.", en: "You are my coworker during a coffee break. I tell you about a news story I read this week. Ask me questions and react naturally." },
  rewatch: "The Newsroom, temporada 1, episódio 1 (diálogo rápido; use como desafio) ou sua sitcom de rewatch.",
  ted: { n: "Chimamanda Ngozi Adichie: The danger of a single story", u: tedq("Chimamanda Adichie the danger of a single story") },
  talk: { min: 2, t: "A news story that caught my attention" },
  passive: "Ao acordar: NPR Up First (cerca de 15 min) · Deslocamento: VOA Learning English · Filas: Anki",
  sunday: { tasks: [
    [10, "Gravação de comparação: grave 2 minutos sobre 'My city and its transportation' e compare com a da Semana 0.", "Gravador do celular"],
    [10, "Transforme o caderno de lacunas da semana em cartões no Anki.", R.anki],
    [10, "Curadoria rápida: 10 itens para a Semana 5 (trabalho e reuniões).", "YouTube, Pocket Casts, Raindrop.io"]
  ]}
});
