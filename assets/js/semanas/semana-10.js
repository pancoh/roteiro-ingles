/* Semana 10 */
WEEKS.push({
  n: 10,
  pt: "Viagens e situações reais",
  en: "Travel and real-life problem solving",
  why: "Situações reais em que você precisa entender e ser entendido, com pouca margem para erro.",
  grammar: {
    t: "Perguntas indiretas e pedidos educados", en: "indirect questions and polite requests",
    explain: [
      "Comece com uma frase de cortesia: Could you tell me..., Do you know..., I was wondering...",
      "Depois, use a ordem de afirmação: 'Where is the gate?' vira 'Could you tell me where the gate is?'",
      "Perguntas de sim ou não usam if: 'Do you know if this train stops at the airport?'",
      "Would you mind + verbo com -ing: 'Would you mind helping me?'"
    ],
    ex: ["Could you tell me where the gate is?", "Do you know if this train stops at the airport?", "Would you mind helping me with my bag?"]
  },
  vocab: `
# Palavras-chave
flight | voo
boarding pass | cartão de embarque
gate | portão
layover | escala
connecting flight | voo de conexão
carry-on | bagagem de mão
checked bag | bagagem despachada
baggage claim | esteira de bagagem
customs | alfândega
immigration | imigração
passport | passaporte
visa | visto
aisle seat | assento no corredor
window seat | assento na janela
departure | partida
arrival | chegada
jet lag | cansaço do fuso horário
overbooked | com overbooking
reservation | reserva
front desk | recepção
room service | serviço de quarto
vacancy | quarto disponível
receipt | recibo
refund | reembolso
exchange rate | câmbio
currency | moeda
cash | dinheiro vivo
ATM | caixa eletrônico
tip | gorjeta
bill / check | conta (restaurante)
pharmacy | farmácia
emergency | emergência
travel insurance | seguro-viagem
itinerary | roteiro de viagem
sightseeing | passeio turístico
lost and found | achados e perdidos
hostel | albergue
tour guide | guia turístico
souvenir | lembrancinha
round trip | ida e volta
one-way ticket | passagem só de ida
# Verbos
book | reservar
cancel | cancelar
board | embarcar
take off | decolar
land | pousar
check in | fazer check-in
check out | fazer check-out
pack | fazer as malas
unpack | desfazer as malas
declare | declarar
complain | reclamar
ask for | pedir
exchange | trocar
rent | alugar
look around | dar uma olhada
get around | se locomover
settle in | se acomodar
# Expressões
could you tell me...? | poderia me dizer...?
do you know if...? | você sabe se...?
would you mind...? | você se importaria de...?
I was wondering if... | eu queria saber se...
is this seat taken? | este lugar está ocupado?
I'd like to make a reservation | gostaria de fazer uma reserva
there's a problem with my room | há um problema com meu quarto
my flight was delayed | meu voo atrasou
my luggage didn't arrive | minha bagagem não chegou
can I pay by card? | posso pagar com cartão?
could you repeat that, please? | pode repetir, por favor?
could you speak more slowly? | pode falar mais devagar?
I'm just looking, thanks | só estou olhando, obrigado
keep the change | fique com o troco
`,
  resources: [{ n: "Easy English", u: yt("Easy English street interviews"), d: "Entrevistas de rua com pessoas comuns" }, { n: "Lonely Planet", u: "https://www.lonelyplanet.com/", d: "Guias de cidades" }, R.cambg, R.yg, R.anki],
  clip: { n: "Easy English: entrevistas de rua", u: yt("Easy English street interviews travel"), d: "Fala real de pessoas comuns, com legenda em inglês." },
  article: { n: "Lonely Planet: guia de uma cidade que você quer visitar", u: "https://www.lonelyplanet.com/", d: "Leia a seção sobre como se locomover." },
  write: "escreva um e-mail a um hotel para resolver um problema na reserva, com pedidos educados",
  rp: { pt: "Aeroporto: seu voo foi cancelado e sua mala não chegou. Resolva com o atendente.", en: "You are an airline agent at the airport. My flight was cancelled and my luggage didn't arrive. Be polite but follow the rules." },
  rewatch: "The Terminal (O Terminal), primeiros 25 minutos, se já viu.",
  ted: { n: "Rick Steves: The value of travel", u: tedq("Rick Steves the value of travel") },
  talk: { min: 4, t: "The best trip I've ever taken" },
  passive: "Deslocamento: Easy English (só áudio) · Tarefas de casa: vídeos de viagem no YouTube · Filas: Anki"
});
