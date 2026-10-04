/* Coach: avaliação semanal com o Claude e ajuste da semana seguinte.
   A chave da API fica só no navegador deste aparelho (localStorage) e nunca
   entra no repositório nem no arquivo de exportação de progresso.
   O SDK oficial é carregado da CDN apenas quando uma avaliação é pedida. */

const COACH = {
  MODEL: "claude-opus-5-5",
  MODEL_LABEL: "Claude Opus 5.5",
  SDK_URL: "https://esm.sh/@anthropic-ai/sdk@0.131.0",
  KEY_STORE: "roteiro-ingles-apikey"
};

const DIF_LABELS = ["", "Muito fácil", "Fácil", "Na medida", "Difícil", "Muito difícil"];

function coachGetKey() {
  try { return localStorage.getItem(COACH.KEY_STORE) || ""; } catch (e) { return ""; }
}
function coachSetKey(key) {
  try {
    if (key) localStorage.setItem(COACH.KEY_STORE, key);
    else localStorage.removeItem(COACH.KEY_STORE);
  } catch (e) {}
}

let sdkPromise = null;
function coachClient() {
  const apiKey = coachGetKey();
  if (!apiKey) throw new CoachError("Configure sua chave da API no botão Claude, no topo da página.");
  if (!sdkPromise) sdkPromise = import(COACH.SDK_URL);
  return sdkPromise.then(mod => {
    const Anthropic = mod.default;
    // O site é estático: a chamada sai direto do navegador, com a chave do próprio usuário.
    return new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
  });
}

class CoachError extends Error {}

/* Traduz erros da API para mensagens em português. */
function coachErrorMessage(err) {
  if (err instanceof CoachError) return err.message;
  const status = err && err.status;
  if (status === 401) return "Chave da API inválida. Confira a chave no botão Claude.";
  if (status === 403) return "A chave não tem permissão para usar este modelo.";
  if (status === 429) return "Limite de uso atingido. Tente de novo em alguns minutos.";
  if (status === 400) return "A API recusou o pedido (erro 400): " + ((err.error && err.error.error && err.error.error.message) || err.message);
  if (status >= 500) return "A API está instável no momento (erro " + status + "). Tente de novo mais tarde.";
  if (err && /fetch|network|Failed to/i.test(err.message || "")) return "Sem conexão com a API. Verifique a internet.";
  return "Erro inesperado: " + ((err && err.message) || err);
}

/* Confere a chave sem gerar custo (consulta de metadados do modelo). */
async function coachTestKey() {
  const client = await coachClient();
  const model = await client.models.retrieve(COACH.MODEL);
  return model.display_name || model.id;
}

/* ================= Esquema da resposta ================= */
const COACH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["diagnostico", "nivel_percebido", "nivel_conteudo", "cartoes_novos_por_dia", "minitalk_minutos", "foco_da_semana", "dicas", "dias"],
  properties: {
    diagnostico: { type: "string", description: "2 a 4 frases sobre como foi a semana e o que muda." },
    nivel_percebido: { type: "string", enum: ["facil_demais", "adequado", "dificil_demais"] },
    nivel_conteudo: { type: "string", enum: ["N1", "N1/N2", "N2", "N2/N3", "N3"] },
    cartoes_novos_por_dia: { type: "integer", description: "Entre 5 e 15." },
    minitalk_minutos: { type: "integer", description: "Entre 1 e 6." },
    foco_da_semana: { type: "string", description: "Uma frase com o foco principal da próxima semana." },
    dicas: { type: "array", items: { type: "string" }, description: "Até 3 dicas práticas." },
    dias: {
      type: "array",
      description: "Somente os dias que mudam. Lista vazia se o plano original já está adequado.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dia", "motivo", "tarefas"],
        properties: {
          dia: { type: "integer", description: "0 = segunda ... 6 = domingo." },
          motivo: { type: "string", description: "Uma frase explicando a mudança." },
          tarefas: {
            type: "array",
            description: "Todas as tarefas do dia, somando 30 minutos.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["minutos", "o_que_fazer", "recurso"],
              properties: {
                minutos: { type: "integer" },
                o_que_fazer: { type: "string" },
                recurso: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};

const COACH_SYSTEM = [
  "Você é um especialista em ensino de inglês para brasileiros, com foco em Natural Method e Comprehensible Input.",
  "Você acompanha um roteiro semanal de 30 minutos ativos por dia e ajusta a próxima semana com base nas avaliações do aluno.",
  "",
  "Como avaliar:",
  "- Use os dados: dificuldade de 1 (muito fácil) a 5 (muito difícil), compreensão do áudio em %, tempo real gasto em relação aos 30 minutos, notas do aluno e dias não concluídos.",
  "- Meta: compreensão entre 70% e 90% e dificuldade 3 na maior parte dos dias. Acima disso, o material está fácil demais. Abaixo, difícil demais.",
  "- Com menos de 3 dias avaliados, faça ajustes leves e diga isso no diagnóstico.",
  "",
  "Como ajustar a próxima semana:",
  "- Mantenha o tema, a gramática e a estrutura dos 7 dias. Mude só o necessário: nível do conteúdo, repetição, troca de tarefas, tempo de cada tarefa.",
  "- Cada dia ajustado lista todas as tarefas do dia, não só a que mudou, e soma exatamente 30 minutos.",
  "- Em 'dias', inclua apenas os dias que mudam. Se o plano já está adequado, devolva a lista vazia.",
  "- Use os recursos do plano original ou ferramentas já citadas (Anki, Language Reactor, YouGlish, Cambridge Dictionary, ChatGPT ou Claude em modo de voz). Não invente títulos de vídeos, episódios ou artigos.",
  "- Se as notas mostram travas na fala ou medo de falar, priorize prática oral curta e segura.",
  "",
  "Estilo: português do Brasil, frases curtas, tom direto e institucional. Não use travessão nem emojis."
].join("\n");

/* ================= Montagem do pedido ================= */
function coachDayLine(wi, d) {
  const day = effectiveDay(wi, d).day;
  const fb = state.feedback[dk(wi, d)] || {};
  const parts = [DAY_NAMES[d] + " (" + day.t + ")", isDone(wi, d) ? "concluído" : "não concluído"];
  if (fb.dif) parts.push("dificuldade " + fb.dif + "/5 (" + DIF_LABELS[fb.dif] + ")");
  if (fb.comp != null && fb.comp !== "") parts.push("compreensão " + fb.comp + "%");
  if (fb.min) parts.push("tempo real " + fb.min + " min");
  if (fb.nota) parts.push("notas do aluno: \"" + fb.nota + "\"");
  return "- " + parts.join("; ");
}

function coachWeekBlock(wi, title) {
  const w = WEEKS[wi];
  const groups = VOCAB[wi];
  const totalV = groups.reduce((a, g) => a + g.items.length, 0);
  const knownV = groups.reduce((a, g) => a + g.items.filter(it => state.known[wi + "|" + it.en]).length, 0);
  const lines = [title + ": Semana " + w.n + " (" + w.pt + ")", "Vocabulário: o aluno marcou " + knownV + " de " + totalV + " palavras como conhecidas."];
  const adj = state.adapt[wi];
  if (adj && adj.data) lines.push("Ajuste aplicado nesta semana: conteúdo " + adj.data.nivel_conteudo + ", " + adj.data.cartoes_novos_por_dia + " cartões por dia, mini-talk de " + adj.data.minitalk_minutos + " min.");
  for (let d = 0; d < 7; d++) lines.push(coachDayLine(wi, d));
  return lines.join("\n");
}

function coachTaskText(t) {
  const r = t[2];
  const rec = !r ? "" : (typeof r === "string" ? r : r.n);
  return "[" + t[0] + " min] " + t[1] + (rec ? " (recurso: " + rec + ")" : "");
}

function coachBuildPrompt(wi) {
  const next = WEEKS[wi + 1];
  const parts = [
    "PERFIL DO ALUNO",
    "- Brasileiro, nível entre B1 e B2. Quer chegar ao avançado.",
    "- Objetivos: assistir filmes sem legenda, palestrar em inglês e perder o medo de falar.",
    "- Maiores dificuldades: vocabulário, fala e compreensão de fala nativa.",
    "- Interesses: tecnologia, IA, atualidades e mobilidade urbana.",
    "- Rotina: 30 minutos ativos por dia, mais inglês passivo nos tempos mortos.",
    "",
    coachWeekBlock(wi, "SEMANA CONCLUÍDA")
  ];
  if (wi > 0) parts.push("", coachWeekBlock(wi - 1, "SEMANA ANTERIOR"));
  parts.push("", "PRÓXIMA SEMANA (plano original): Semana " + next.n + " (" + next.pt + "). Gramática: " + next.grammar.t + ".");
  ALL_DAYS[wi + 1].forEach((day, d) => {
    parts.push(d + " " + DAY_NAMES[d] + ": " + day.t);
    day.tasks.forEach(t => parts.push("   " + coachTaskText(t)));
  });
  parts.push("", "Avalie a semana concluída e ajuste a próxima semana conforme as instruções.");
  return parts.join("\n");
}

/* ================= Validação da resposta ================= */
function coachSanitize(data) {
  const clamp = (v, lo, hi, def) => Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : def;
  const out = {
    diagnostico: String(data.diagnostico || ""),
    nivel_percebido: data.nivel_percebido,
    nivel_conteudo: data.nivel_conteudo,
    cartoes_novos_por_dia: clamp(data.cartoes_novos_por_dia, 5, 15, 10),
    minitalk_minutos: clamp(data.minitalk_minutos, 1, 6, 2),
    foco_da_semana: String(data.foco_da_semana || ""),
    dicas: (Array.isArray(data.dicas) ? data.dicas : []).slice(0, 3).map(String),
    dias: [],
    descartados: 0
  };
  const seen = {};
  (Array.isArray(data.dias) ? data.dias : []).forEach(x => {
    const d = x && x.dia;
    const tasks = (x && Array.isArray(x.tarefas)) ? x.tarefas.filter(t => t && t.minutos > 0 && t.o_que_fazer) : [];
    const sum = tasks.reduce((a, t) => a + t.minutos, 0);
    // Só aceita dias válidos, sem repetição, com 25 a 35 minutos no total.
    if (!Number.isInteger(d) || d < 0 || d > 6 || seen[d] || !tasks.length || sum < 25 || sum > 35) { out.descartados++; return; }
    seen[d] = true;
    out.dias.push({ dia: d, motivo: String(x.motivo || ""), tarefas: tasks.map(t => [Math.round(t.minutos), String(t.o_que_fazer), String(t.recurso || "")]) });
  });
  return out;
}

/* ================= Chamada ao Claude ================= */
async function coachRequest(wi) {
  if (!WEEKS[wi + 1]) throw new CoachError("Não há próxima semana para ajustar.");
  const client = await coachClient();
  const response = await client.beta.messages.create({
    model: COACH.MODEL,
    max_tokens: 16000,
    system: COACH_SYSTEM,
    messages: [{ role: "user", content: coachBuildPrompt(wi) }],
    output_config: { effort: "medium", format: { type: "json_schema", schema: COACH_SCHEMA } },
    // Se um filtro de segurança recusar o pedido, a API tenta de novo em outro modelo.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default"
  });
  if (response.stop_reason === "refusal") throw new CoachError("O Claude recusou o pedido. Revise as notas da semana e tente de novo.");
  if (response.stop_reason === "max_tokens") throw new CoachError("A resposta ficou incompleta. Tente de novo.");
  const textBlock = response.content.find(b => b.type === "text");
  if (!textBlock) throw new CoachError("O Claude não devolveu uma resposta em texto.");
  let data;
  try { data = JSON.parse(textBlock.text); } catch (e) { throw new CoachError("Não foi possível ler a resposta do Claude."); }
  return {
    source: "claude",
    model: response.model || COACH.MODEL,
    date: new Date().toISOString(),
    usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
    data: coachSanitize(data)
  };
}

/* ================= Plano do Claude: copiar e colar no claude.ai =================
   Usa a assinatura do usuário no claude.ai, sem chave da API. O pedido leva as
   mesmas instruções e o mesmo formato de resposta da chamada pela API. */
function coachManualPrompt(wi) {
  const next = WEEKS[wi + 1];
  const template = {
    semana: next.n,
    diagnostico: "2 a 4 frases sobre como foi a semana e o que muda",
    nivel_percebido: "facil_demais | adequado | dificil_demais",
    nivel_conteudo: "N1 | N1/N2 | N2 | N2/N3 | N3",
    cartoes_novos_por_dia: 10,
    minitalk_minutos: 2,
    foco_da_semana: "uma frase",
    dicas: ["até 3 dicas práticas"],
    dias: [{ dia: 0, motivo: "uma frase", tarefas: [{ minutos: 10, o_que_fazer: "descrição da tarefa", recurso: "recurso usado" }] }]
  };
  return [
    COACH_SYSTEM,
    "",
    coachBuildPrompt(wi),
    "",
    "FORMATO DA RESPOSTA",
    "Responda somente com um bloco de código JSON, sem texto antes ou depois, neste formato:",
    "```json",
    JSON.stringify(template, null, 2),
    "```",
    "Regras do JSON:",
    "- \"semana\" deve ser " + next.n + ".",
    "- \"nivel_percebido\" e \"nivel_conteudo\": use exatamente um dos valores listados.",
    "- \"cartoes_novos_por_dia\" entre 5 e 15; \"minitalk_minutos\" entre 1 e 6 (números inteiros).",
    "- \"dias\": só os dias que mudam (0 = segunda ... 6 = domingo), cada um com todas as tarefas do dia somando 30 minutos. Use [] se nada muda."
  ].join("\n");
}

function coachParseManual(wi, text) {
  const next = WEEKS[wi + 1];
  let raw = String(text || "").trim();
  if (!raw) throw new CoachError("Cole a resposta do Claude no campo antes de aplicar.");
  // Aceita a resposta com ou sem bloco de código e com texto em volta.
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) raw = fence[1];
  const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
  if (start < 0) throw new CoachError("Não encontrei um JSON na resposta. Copie a resposta inteira do Claude.");
  if (end <= start) throw new CoachError("O JSON da resposta está incompleto. Copie a resposta inteira do Claude.");
  let data;
  try { data = JSON.parse(raw.slice(start, end + 1)); } catch (e) { throw new CoachError("O JSON da resposta está incompleto ou inválido. Peça ao Claude para reenviar só o JSON."); }
  if (data.semana != null && Number(data.semana) !== next.n) throw new CoachError("Esta resposta é para a Semana " + data.semana + ", mas o pedido é para a Semana " + next.n + ". Copie o pedido de novo.");
  const enumOk = COACH_SCHEMA.properties.nivel_percebido.enum.includes(data.nivel_percebido) && COACH_SCHEMA.properties.nivel_conteudo.enum.includes(data.nivel_conteudo);
  if (!enumOk || typeof data.diagnostico !== "string" || !Array.isArray(data.dias)) throw new CoachError("A resposta não está no formato pedido. Peça ao Claude para seguir o formato do JSON.");
  return {
    source: "manual",
    model: "Claude (seu plano no claude.ai)",
    date: new Date().toISOString(),
    data: coachSanitize(data)
  };
}

/* ================= Reserva: regras automáticas (sem API) ================= */
function coachRules(wi) {
  const fbs = [0, 1, 2, 3, 4, 5, 6].map(d => state.feedback[dk(wi, d)]).filter(Boolean);
  const difs = fbs.map(f => f.dif).filter(Boolean);
  const comps = fbs.map(f => f.comp).filter(v => v != null && v !== "").map(Number);
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const dif = avg(difs), comp = avg(comps);
  const prev = state.adapt[wi] && state.adapt[wi].data;
  const levels = ["N1", "N1/N2", "N2", "N2/N3", "N3"];
  let li = prev ? Math.max(0, levels.indexOf(prev.nivel_conteudo)) : 1;
  let cards = prev ? prev.cartoes_novos_por_dia : 10;
  const nextTalk = WEEKS[wi + 1] && WEEKS[wi + 1].talk ? WEEKS[wi + 1].talk.min : 2;
  let talk = nextTalk, nivel = "adequado", diag;

  if (dif == null && comp == null) {
    diag = "Não há avaliações registradas nesta semana. O plano da próxima semana segue sem mudanças.";
  } else if ((dif != null && dif <= 2) || (comp != null && comp > 90)) {
    nivel = "facil_demais"; li = Math.min(4, li + 1); cards = Math.min(15, cards + 2); talk = Math.min(6, nextTalk + 1);
    diag = "A semana ficou fácil (dificuldade média " + (dif != null ? dif.toFixed(1) : "sem dado") + ", compreensão média " + (comp != null ? Math.round(comp) + "%" : "sem dado") + "). Suba um nível no conteúdo e alongue a mini-talk.";
  } else if ((dif != null && dif >= 4) || (comp != null && comp < 70)) {
    nivel = "dificil_demais"; li = Math.max(0, li - 1); cards = Math.max(5, cards - 2); talk = Math.max(1, nextTalk - 1);
    diag = "A semana ficou difícil (dificuldade média " + (dif != null ? dif.toFixed(1) : "sem dado") + ", compreensão média " + (comp != null ? Math.round(comp) + "%" : "sem dado") + "). Use conteúdo mais fácil e repita o mesmo vídeo mais vezes.";
  } else {
    diag = "A semana ficou na medida (dificuldade média " + (dif != null ? dif.toFixed(1) : "sem dado") + ", compreensão média " + (comp != null ? Math.round(comp) + "%" : "sem dado") + "). Mantenha o nível.";
  }
  return {
    source: "regras",
    model: "Regras automáticas",
    date: new Date().toISOString(),
    data: {
      diagnostico: diag,
      nivel_percebido: nivel,
      nivel_conteudo: levels[li],
      cartoes_novos_por_dia: cards,
      minitalk_minutos: talk,
      foco_da_semana: nivel === "dificil_demais" ? "Repetir mais e escolher vídeos com fala mais lenta." : nivel === "facil_demais" ? "Buscar conteúdo nativo e mais rápido." : "Manter o ritmo e a consistência.",
      dicas: [],
      dias: [],
      descartados: 0
    }
  };
}
