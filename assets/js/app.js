/* Roteiro de Inglês: montagem dos dias, estado e renderização */

/* ================= Montagem dos dias ================= */
const WRITE_PROMPT = (w) =>
  "I'm a Brazilian English learner (B1/B2). This week I'm practicing " + w.grammar.en + ". Correct my text below. First, show the corrected version. Then list each mistake in a table with: my version, correct version, short explanation. Check especially my use of " + w.grammar.en + ". Finally, suggest 3 more natural expressions a native speaker would use for my ideas.\n\nText: [cole seu texto aqui]";

const RP_PROMPT = (w) =>
  "Let's do a roleplay. " + w.rp.en + " Speak naturally, at normal speed, and ask me follow-up questions. Keep your answers short so I talk more. At the end, give me feedback on my 5 most important mistakes and 5 useful phrases I could have used.";

function buildDays(w, idx) {
  if (w.days) return w.days;
  const next = WEEKS[idx + 1];
  const nextTheme = next ? "Semana " + next.n + ": " + next.pt.toLowerCase() : "Fase 2";
  const minLabel = w.talk.min === 1 ? "1 minuto" : w.talk.min + " minutos";
  const days = [
    { t: "Escuta intensiva + Sentence Mining", tasks: [
      [5, "Leia a lista de vocabulário da semana e marque as palavras que você já conhece.", "Seção Vocabulário (nesta página)"],
      [20, "Escuta intensiva em 4 passadas: (1) sem legenda; (2) com legenda em inglês no Language Reactor; (3) pausando para minerar frases; (4) sem legenda de novo. " + w.clip.d, w.clip],
      [5, "Crie de 5 a 8 cartões no Anki com frases do vídeo (uma palavra nova por frase).", R.anki]
    ]},
    { t: "Gramática + Shadowing", tasks: [
      [10, "Gramática: " + w.grammar.t + ". Leia a explicação e escreva 5 frases sobre a sua vida usando a estrutura.", R.cambg],
      [15, "Chorusing (falar junto, 5 a 10 vezes) e shadowing (meio segundo de atraso) de um trecho de 30 a 60 segundos.", w.shadow || w.clip],
      [5, "Grave a última tentativa e compare com o original.", "Gravador do celular"]
    ]},
    { t: "Leitura ativa + Escrita com IA", tasks: [
      [10, "Leitura: " + w.article.d, w.article],
      [10, "Escrita (100 a 150 palavras): " + w.write + ". Use 5 palavras da semana.", "Caderno ou editor de texto"],
      [5, "Correção com IA usando o prompt abaixo.", "ChatGPT ou Claude"],
      [5, "Leia a versão corrigida em voz alta, duas vezes.", "Seu texto corrigido"]
    ], prompt: { label: "Prompt de correção", text: WRITE_PROMPT(w) } },
    { t: "Roleplay por voz com IA", tasks: [
      [20, "Roleplay: " + w.rp.pt + " Use o prompt abaixo no modo de voz.", "ChatGPT ou Claude (modo de voz)"],
      [10, "Revise os erros apontados e crie cartões com as 5 frases úteis sugeridas.", R.anki]
    ], prompt: { label: "Prompt de roleplay", text: RP_PROMPT(w) } },
    { t: "Interação com conteúdo (REWATCH)", tasks: [
      [25, "Assista com pausas: responda aos personagens, dê sua opinião, preveja o que vem. Sugestão: " + w.rewatch, "Netflix ou outro streaming, com Language Reactor"],
      [5, "Anote as lacunas (o que quis dizer e não soube) no caderno de lacunas.", "Nota 'Lacunas' no celular"]
    ]},
    { t: "Fala pública", tasks: [
      [10, "Assista ao início e ao fim da palestra. Observe a abertura, a estrutura e o fechamento.", w.ted],
      [15, "Prepare e grave uma mini-talk de " + minLabel + ": \"" + w.talk.t + "\". Use o vocabulário da semana.", "Câmera ou gravador do celular"],
      [5, "Assista à gravação e anote um ponto a melhorar.", "Sua gravação"]
    ]},
    { t: "Revisão + curadoria", tasks: [
      [10, "Transforme o caderno de lacunas da semana em cartões no Anki.", R.anki],
      [20, "Curadoria: abasteça o barril com 10 itens para a " + nextTheme + ".", "YouTube, Pocket Casts, Raindrop.io"]
    ]}
  ];
  if (w.sunday) days[6] = Object.assign({ t: "Revisão + gravação de comparação" }, w.sunday);
  return days;
}

/* ================= Estado ================= */
const STORE_KEY = "roteiro-ingles-v1";
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { days: s.days || {}, known: s.known || {}, week: s.week, day: s.day };
    }
  } catch (e) {}
  return { days: {}, known: {}, week: null, day: null };
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
const state = load();

WEEKS.sort((a, b) => a.n - b.n);
const ALL_DAYS = WEEKS.map((w, i) => buildDays(w, i));
const TOTAL = WEEKS.length * 7;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const dk = (wi, d) => wi + "-" + d;
const isDone = (wi, d) => !!state.days[dk(wi, d)];
const weekDone = wi => [0,1,2,3,4,5,6].filter(d => isDone(wi, d)).length;

function parseVocab(text) {
  const groups = [];
  let cur = null;
  text.split("\n").forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith("#")) { cur = { name: line.slice(1).trim(), items: [] }; groups.push(cur); return; }
    const parts = line.split("|");
    if (!cur) { cur = { name: "Vocabulário", items: [] }; groups.push(cur); }
    cur.items.push({ en: parts[0].trim(), pt: (parts[1] || "").trim() });
  });
  return groups;
}
const VOCAB = WEEKS.map(w => parseVocab(w.vocab));

function firstOpenWeek() {
  for (let i = 0; i < WEEKS.length; i++) if (weekDone(i) < 7) return i;
  return WEEKS.length - 1;
}
function firstOpenDay(wi) {
  for (let d = 0; d < 7; d++) if (!isDone(wi, d)) return d;
  return 0;
}

let curWeek = (state.week != null && state.week < WEEKS.length) ? state.week : firstOpenWeek();
let curDay = (state.day != null && state.week === curWeek) ? state.day : firstOpenDay(curWeek);

/* ================= Renderização ================= */
function renderProgress() {
  const done = Object.keys(state.days).filter(k => state.days[k]).length;
  const pct = Math.round(done / TOTAL * 100);
  document.getElementById("pct").textContent = pct + "%";
  document.getElementById("barFill").style.width = pct + "%";
  document.getElementById("count").textContent = done + " de " + TOTAL + " dias concluídos";
}

function renderNav() {
  const nav = document.getElementById("weeksNav");
  nav.innerHTML = WEEKS.map((w, i) => {
    const n = weekDone(i);
    const cls = ["wchip", i === curWeek ? "sel" : "", n === 7 ? "full" : ""].join(" ");
    return '<button type="button" class="' + cls + '" data-w="' + i + '" title="' + esc(w.pt) + '"><b>S' + w.n + '</b><small>' + n + '/7</small></button>';
  }).join("");
  const sel = nav.querySelector(".sel");
  if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function resLink(r) {
  if (!r) return "";
  if (typeof r === "string") return esc(r);
  return '<a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.n) + '</a>';
}

function renderDetail(wi, d) {
  const w = WEEKS[wi];
  const day = ALL_DAYS[wi][d];
  const total = day.tasks.reduce((a, t) => a + t[0], 0);
  const done = isDone(wi, d);
  let h = '<div class="detail" id="detail">';
  h += '<h4>' + DAY_NAMES[d] + ': ' + esc(day.t) + '</h4>';
  h += '<div class="meta">Semana ' + w.n + ' · ' + esc(w.pt) + ' · ' + total + ' minutos ativos</div>';
  h += '<table class="tasks"><thead><tr><th>Tempo</th><th>O que estudar</th><th>Recurso</th></tr></thead><tbody>';
  day.tasks.forEach(t => {
    h += '<tr><td class="min">' + t[0] + ' min</td><td>' + esc(t[1]) + '</td><td class="res">' + resLink(t[2]) + '</td></tr>';
  });
  h += '</tbody></table>';
  if (day.prompt) {
    h += '<div class="prompt"><div class="label">' + esc(day.prompt.label) + '</div><pre>' + esc(day.prompt.text) + '</pre><button type="button" class="copy" data-copy="1">Copiar</button></div>';
  }
  if (day.extra) h += '<div class="note extra"><b>Extra</b>' + esc(day.extra) + '</div>';
  h += '<div class="note"><b>Tempos mortos (meta: 1 a 2 horas)</b>' + esc(w.passive) + '</div>';
  h += '<div class="note"><b>Micro-hábito do dia</b>' + esc(MICRO[d]) + '</div>';
  h += '<button type="button" class="complete' + (done ? ' is-done' : '') + '" data-toggle="' + d + '">' + (done ? 'Concluído (clique para desmarcar)' : 'Marcar dia como concluído') + '</button>';
  h += '</div>';
  return h;
}

function renderWeek() {
  const wi = curWeek, w = WEEKS[wi];
  const n = weekDone(wi);
  const groups = VOCAB[wi];
  const totalV = groups.reduce((a, g) => a + g.items.length, 0);
  const knownV = groups.reduce((a, g) => a + g.items.filter(it => state.known[wi + "|" + it.en]).length, 0);

  let h = '<section class="week">';
  h += '<div class="week-head"><div class="eyebrow">Semana ' + w.n + (w.n === 0 ? ' · Preparação' : ' · Fase 1: Fundação') + '</div>';
  h += '<h2>' + esc(w.pt) + '</h2><p class="en">' + esc(w.en) + '</p><p class="why">' + esc(w.why) + '</p>';
  h += '<div class="wk-prog"><div class="bar"><span style="width:' + Math.round(n / 7 * 100) + '%"></span></div>' + n + ' de 7 dias</div></div>';

  h += '<h3 class="sec">Atividade diária</h3><div class="days">';
  ALL_DAYS[wi].forEach((day, d) => {
    const done = isDone(wi, d);
    const mins = day.tasks.reduce((a, t) => a + t[0], 0);
    h += '<div class="day' + (d === curDay ? ' sel' : '') + (done ? ' done' : '') + '">';
    h += '<button type="button" class="day-open" data-d="' + d + '" aria-expanded="' + (d === curDay) + '"><span class="dn">' + DAY_SHORT[d] + '</span><span class="dt">' + esc(day.t) + '</span><span class="ds">' + (done ? 'Concluído' : mins + ' min') + '</span></button>';
    h += '<label class="day-check" title="Marcar como concluído"><input type="checkbox" data-check="' + d + '"' + (done ? ' checked' : '') + ' aria-label="' + DAY_NAMES[d] + ' concluído"></label>';
    h += '</div>';
  });
  h += '</div>';
  h += renderDetail(wi, curDay);

  h += '<h3 class="sec">Gramática e recursos</h3><div class="grid2">';
  h += '<div class="card"><h4>' + esc(w.grammar.t) + '</h4><div class="en">' + esc(w.grammar.en) + '</div><ul>' +
       w.grammar.explain.map(e => '<li>' + esc(e) + '</li>').join("") + '</ul>' +
       '<div class="examples">' + w.grammar.ex.map(e => '<div>' + esc(e) + '</div>').join("") + '</div></div>';

  h += '<div class="card"><h4>Recursos e conteúdos da semana</h4><ul class="res-list">';
  if (w.clip) {
    h += '<li><span class="k">Escuta (segunda e terça)</span>' + resLink(w.clip) + '<span class="d">' + esc(w.clip.d) + '</span></li>';
    h += '<li><span class="k">Leitura (quarta)</span>' + resLink(w.article) + '<span class="d">' + esc(w.article.d) + '</span></li>';
    h += '<li><span class="k">Rewatch (sexta)</span>' + esc(w.rewatch) + '</li>';
    h += '<li><span class="k">Palestra (sábado)</span>' + resLink(w.ted) + '</li>';
  }
  h += '<li><span class="k">Tempos mortos</span>' + esc(w.passive) + '</li>';
  w.resources.forEach(r => {
    h += '<li><span class="k">Ferramenta</span>' + resLink(r) + '<span class="d">' + esc(r.d || "") + '</span></li>';
  });
  h += '</ul></div></div>';

  h += '<h3 class="sec">Vocabulário</h3><div class="card"><div class="vocab-head"><h4>' + totalV + ' palavras e expressões</h4><span class="vc">Você já conhece ' + knownV + ' de ' + totalV + '. Clique para marcar.</span></div>';
  groups.forEach(g => {
    h += '<div class="vgroup"><h5>' + esc(g.name) + ' (' + g.items.length + ')</h5><div class="chips">';
    g.items.forEach(it => {
      const k = wi + "|" + it.en;
      h += '<button type="button" class="chip' + (state.known[k] ? ' known' : '') + '" data-v="' + esc(k) + '"><b>' + esc(it.en) + '</b> <span>· ' + esc(it.pt) + '</span></button>';
    });
    h += '</div></div>';
  });
  h += '</div></section>';

  document.getElementById("week").innerHTML = h;
}

function renderAll() {
  renderProgress();
  renderNav();
  renderWeek();
}

function setDone(wi, d, val) {
  if (val) state.days[dk(wi, d)] = true; else delete state.days[dk(wi, d)];
  save();
  renderAll();
}

/* ================= Eventos ================= */
document.getElementById("weeksNav").addEventListener("click", e => {
  const b = e.target.closest("[data-w]");
  if (!b) return;
  curWeek = +b.dataset.w;
  curDay = firstOpenDay(curWeek);
  state.week = curWeek; state.day = curDay; save();
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("week").addEventListener("click", e => {
  const open = e.target.closest(".day-open");
  if (open) {
    curDay = +open.dataset.d;
    state.week = curWeek; state.day = curDay; save();
    renderWeek();
    const det = document.getElementById("detail");
    if (det && det.scrollIntoView) det.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  const tog = e.target.closest("[data-toggle]");
  if (tog) { const d = +tog.dataset.toggle; setDone(curWeek, d, !isDone(curWeek, d)); return; }
  const chip = e.target.closest("[data-v]");
  if (chip) {
    const k = chip.dataset.v;
    if (state.known[k]) delete state.known[k]; else state.known[k] = true;
    save(); renderWeek(); return;
  }
  const copy = e.target.closest("[data-copy]");
  if (copy) {
    const text = copy.parentElement.querySelector("pre").textContent;
    const ok = () => { copy.textContent = "Copiado"; setTimeout(() => { copy.textContent = "Copiar"; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, () => fallbackCopy(text, ok));
    } else fallbackCopy(text, ok);
  }
});

document.getElementById("week").addEventListener("change", e => {
  const cb = e.target.closest("[data-check]");
  if (cb) setDone(curWeek, +cb.dataset.check, cb.checked);
});

function fallbackCopy(text, ok) {
  const ta = document.createElement("textarea");
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); ok(); } catch (e) {}
  ta.remove();
}

document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Zerar todo o progresso (dias concluídos e palavras marcadas)?")) return;
  state.days = {}; state.known = {}; state.week = null; state.day = null;
  save();
  curWeek = 0; curDay = 0;
  renderAll();
});

/* ================= Exportar e importar progresso =================
   O progresso fica no navegador. O arquivo JSON leva o progresso
   de um aparelho para outro. */
document.getElementById("export").addEventListener("click", () => {
  const data = { app: "roteiro-ingles", version: 1, exportedAt: new Date().toISOString(), days: state.days, known: state.known };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "progresso-ingles-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

const importInput = document.getElementById("importFile");
document.getElementById("import").addEventListener("click", () => importInput.click());
importInput.addEventListener("change", () => {
  const file = importInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.app !== "roteiro-ingles" || typeof data.days !== "object" || typeof data.known !== "object") throw new Error("formato");
      if (!confirm("Substituir o progresso deste navegador pelo progresso do arquivo?")) return;
      state.days = data.days || {}; state.known = data.known || {};
      save();
      curWeek = firstOpenWeek(); curDay = firstOpenDay(curWeek);
      renderAll();
    } catch (e) {
      alert("Arquivo inválido. Use um arquivo gerado pelo botão Exportar progresso.");
    } finally {
      importInput.value = "";
    }
  };
  reader.readAsText(file);
});

renderAll();
