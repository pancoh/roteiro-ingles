/* Semana 0 */
WEEKS.push({
  n: 0,
  pt: "Preparação do ambiente",
  en: "Setting up your English environment",
  why: "Os algoritmos levam de 10 a 14 dias para aprender o que você quer ver. Quanto antes você configura, antes o inglês chega sozinho.",
  grammar: {
    t: "Imperativo (dar e seguir instruções)", en: "the imperative",
    explain: [
      "Use o verbo na forma base, sem sujeito: 'Open the app.'",
      "Negativa com don't: 'Don't skip this step.'",
      "Para soar educado, acrescente please ou use 'Could you...?'"
    ],
    ex: ["Go to Settings and tap Language & Region.", "Don't watch videos in Portuguese for two weeks.", "Please turn on captions in English."]
  },
  vocab: `
# Palavras-chave
settings | configurações
language | idioma
region | região
preferences | preferências
menu | menu
tab | aba
button | botão
toggle | chave liga/desliga
dropdown | lista suspensa
search bar | barra de busca
home screen | tela inicial
lock screen | tela de bloqueio
app store | loja de apps
profile | perfil
feed | feed, linha do tempo
playlist | playlist
subscription | inscrição, assinatura
channel | canal
follower | seguidor
algorithm | algoritmo
recommendation | recomendação
history | histórico
folder | pasta
bookmark | favorito
tag | etiqueta
queue | fila
flashcard | cartão de memorização
deck | baralho
review | revisão
subtitle | legenda
caption | legenda (closed caption)
transcript | transcrição
extension | extensão
browser | navegador
shortcut | atalho
voice assistant | assistente de voz
default | padrão
# Verbos
go to | ir para
tap | tocar (na tela)
click | clicar
select | selecionar
choose | escolher
change | mudar
switch to | trocar para
enable | ativar
disable | desativar
turn on | ligar
turn off | desligar
save | salvar
follow | seguir
unfollow | deixar de seguir
subscribe | inscrever-se
like | curtir
skip | pular
mark as | marcar como
sort | ordenar
organize | organizar
add to | adicionar a
remove | remover
search for | procurar
set as default | definir como padrão
restart | reiniciar
# Expressões
not interested | não tenho interesse
don't recommend channel | não recomendar canal
watch later | assistir mais tarde
turn on notifications | ativar notificações
for you page | página "para você"
under settings | nas configurações
step by step | passo a passo
by default | por padrão
it takes a while | leva um tempo
from now on | de agora em diante
`,
  resources: [R.lr, R.anki, R.raindrop, R.pocketcasts, R.yg, R.efset],
  passive: "Comece já: BBC 6 Minute English no deslocamento, enquanto configura o resto.",
  days: [
    { t: "Idioma dos dispositivos", tasks: [
      [15, "Mude celular, computador, relógio e TV para inglês.", "Configurações de cada aparelho"],
      [10, "Coloque GPS (Google Maps, Waze) e assistente de voz em inglês. Crie um perfil da Netflix em inglês.", "Google Maps, Waze, Siri ou Google, Netflix"],
      [5, "Leia a gramática da semana (imperativo) e narre em voz alta as instruções que seguiu.", "Seção Gramática"]
    ]},
    { t: "YouTube e barril de vídeos", tasks: [
      [20, "Inscreva-se em 15 a 20 canais: MKBHD, Two Minute Papers, ColdFusion, Not Just Bikes, City Beautiful, CityNerd, BBC Learning English, VOA Learning English, Vox, TED. Marque 'Não tenho interesse' em vídeos em português.", { n: "YouTube", u: "https://www.youtube.com/" }],
      [10, "Crie as playlists do barril: N1 Tech, N1 Urban, N1 News, N2 Tech, N2 Urban, N3, REWATCH, PALESTRAS.", { n: "YouTube: Biblioteca", u: "https://www.youtube.com/feed/library" }]
    ]},
    { t: "Redes sociais", tasks: [
      [15, "Instagram e TikTok: siga 20 criadores em inglês dos seus temas. Pesquise #urbanism, #AInews, #techtok.", "Instagram, TikTok"],
      [10, "X ou Threads: crie a lista 'English Feed' com jornalistas de tecnologia e urbanistas.", "X, Threads"],
      [5, "Google Discover e Notícias: idioma e região em inglês (EUA ou Reino Unido).", "App Google"]
    ]},
    { t: "Podcasts", tasks: [
      [10, "Instale um app de podcasts e crie as filas N1 e N2.", R.pocketcasts],
      [15, "Assine: BBC 6 Minute English, VOA Learning English, NPR Up First, TED Talks Daily, Lex Fridman Podcast, Hard Fork, Strong Towns Podcast, The War on Cars.", R.pocketcasts],
      [5, "Ative o download automático dos episódios N1 para ouvir offline.", R.pocketcasts]
    ]},
    { t: "Barril de conteúdos", tasks: [
      [10, "Crie no Raindrop.io as pastas N1, N2, N3, REWATCH e PALESTRAS, com tags por tema (tech, ia, news, urban).", R.raindrop],
      [15, "Preencha 10 itens N1 para a Semana 1 (tema: rotina e apresentação pessoal).", "YouTube, Pocket Casts, Raindrop.io"],
      [5, "Crie uma página-índice no Notion ou Obsidian com status: novo, visto, minerado.", "Notion ou Obsidian"]
    ]},
    { t: "Ferramentas de estudo", tasks: [
      [10, "Instale o Anki (computador e celular) e crie o baralho 'Inglês: Mining'.", R.anki],
      [10, "Instale o Language Reactor no Chrome e teste em um vídeo do YouTube.", R.lr],
      [10, "Salve nos favoritos: YouGlish, Cambridge Dictionary e Readlang.", R.yg]
    ]},
    { t: "Linha de base", tasks: [
      [10, "Grave 2 minutos falando sobre 'My city and its transportation'. Guarde: é a gravação de comparação.", "Gravador do celular"],
      [20, "Revise o vocabulário da Semana 0 e confira se as playlists da Semana 1 estão prontas.", "Seção Vocabulário"]
    ], extra: "Extra desta semana (fora dos 30 min): faça o EF SET (50 min) para registrar seu nível inicial." }
  ]
});
