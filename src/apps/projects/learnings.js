import React, { useState } from "react";
import { Article, Bullets, Chip, H, Intro, Snippet, useCopy } from "./ui";

// 011h site learnings: a WhatsApp voice note turned into a structured lesson
// learned. The real code is closed source, so the snippet is rewritten and
// simplified for this page, with made-up data.

const CAS = `# The webhook (a new message) and the sweeper (a timer running out) can
# touch the same capture at once, on different replicas. Every write
# carries the version it read, and Lua makes check-and-write one atomic
# step. (Not WATCH/MULTI: a pooled client can't hold on to a connection.)
SAVE_IF_CURRENT = """
local seen = redis.call('GET', KEYS[2]) or '0'
if seen ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2])
redis.call('INCR', KEYS[2])
return 1
"""

async def save(self, capture: Capture, read_version: int) -> bool:
    ok = await self.redis.eval(
        SAVE_IF_CURRENT, 2,
        self.key(capture.id), self.version_key(capture.id),
        read_version, capture.to_json(),
    )
    return bool(ok)  # False: something newer won; re-read and decide again`;

// --- part 1: a lesson learned, by voice note --------------------------------

const COPY = {
  en: {
    story: "By late 2026 workers on site were using it, and it had captured several real lessons.",
    idea: "Nobody on a construction site stops to fill in a form, so lessons learned get lost. Try it:",
    bullets: [
      "The WhatsApp gateway: signed webhooks, voice notes and photos, sessions, and a router that tells a delivery note from a lesson learned.",
      "The capture conversation itself, built with a colleague: transcription, extraction, the recap, and confirm or correct.",
      "The timers. A reminder goes out after a quiet spell and abandoned captures are closed on schedule, and every write is version-checked so a timer never overwrites a newer message.",
      "The learnings service, most of which I wrote in 2026: the review back office with statuses and reasons, the event transport, and sharing with site teams, including what they opened and answered.",
    ],
    recap: {
      problem:
        "Rain got into the formwork the night before the pour on level 2.",
      impact:
        "The pour moved by a day and the concrete order had to be rebooked.",
      solution:
        "Cover open formwork with tarps whenever rain is forecast within 24 h.",
    },
    fixedImpact:
      "The pour moved by two days and the concrete order had to be rebooked.",
    keys: { problem: "problem", impact: "impact", solution: "solution" },
    phone: "WhatsApp · site team",
    voice: "🎤 Voice note · 0:21",
    send: "Send it to the assistant",
    got: "Got it. Here’s what I understood:",
    chapter: "Chapter: Structure · Is this right?",
    chat: [
      "It was two days, not one.",
      "Fixed. Anything else?",
      "That’s it 👍",
      "Thanks! Sent to the team for review.",
    ],
    confirm: "Confirm",
    correct: "Correct it",
    office: "Back office · review",
    nothing: "Nothing yet. Learnings land here once the worker confirms.",
    card: "Formwork and rain",
    shared: "Shared",
    inReview: "In review",
    approve: "Approve and share",
    sent: "Sent to 3 site teams · 0 opened yet",
    again: "Start over",
    pipe: [
      "WhatsApp voice note",
      "Transcribe",
      "Extract problem · impact · solution",
      "Recap, confirm or correct",
      "Event to the learnings service",
      "Review, then share",
    ],
    title: "Lessons learned, by voice note",
    pitch:
      "A site worker sends a WhatsApp voice note; the assistant turns it into a structured lesson learned, checks it back with them, and sends it for review and on to other sites.",
    builtH: "What I built",
    built:
      "The assistant’s agent loop is a colleague’s work. I built the WhatsApp channel and the learnings on top of it:",
  },
  es: {
    story: "A finales de 2026 el personal de obra ya lo usaba, y había recogido varias lecciones reales.",
    idea: "En una obra nadie se para a rellenar un formulario, así que las lecciones aprendidas se pierden. Pruébalo:",
    bullets: [
      "La pasarela de WhatsApp: webhooks firmados, notas de voz y fotos, sesiones, y un enrutador que distingue un albarán de una lección aprendida.",
      "La conversación de captura, hecha junto a otra persona del equipo: transcripción, extracción, el resumen, y confirmar o corregir.",
      "Los temporizadores. Sale un recordatorio tras un rato sin respuesta y las capturas abandonadas se cierran a su hora, y cada escritura se comprueba por versión para que un temporizador nunca pise un mensaje más reciente.",
      "El servicio de lecciones, que escribí en buena parte en 2026: el back office de revisión con estados y motivos, el transporte de eventos, y la difusión a los equipos de obra, incluido qué abrieron y qué respondieron.",
    ],
    recap: {
      problem:
        "La lluvia entró en el encofrado la noche antes del hormigonado de la planta 2.",
      impact:
        "El hormigonado se retrasó un día y hubo que volver a pedir el hormigón.",
      solution:
        "Tapar con lonas el encofrado abierto siempre que se prevea lluvia en 24 h.",
    },
    fixedImpact:
      "El hormigonado se retrasó dos días y hubo que volver a pedir el hormigón.",
    keys: { problem: "problema", impact: "impacto", solution: "solución" },
    phone: "WhatsApp · equipo de obra",
    voice: "🎤 Nota de voz · 0:21",
    send: "Enviarla al asistente",
    got: "Entendido. Esto es lo que he entendido:",
    chapter: "Capítulo: Estructura · ¿Es correcto?",
    chat: [
      "Fueron dos días, no uno.",
      "Corregido. ¿Algo más?",
      "Eso es todo 👍",
      "¡Gracias! Enviado al equipo para revisión.",
    ],
    confirm: "Confirmar",
    correct: "Corregir",
    office: "Back office · revisión",
    nothing: "Nada todavía. Las lecciones llegan aquí cuando se confirma.",
    card: "Encofrado y lluvia",
    shared: "Compartida",
    inReview: "En revisión",
    approve: "Aprobar y compartir",
    sent: "Enviada a 3 equipos de obra · 0 abiertas por ahora",
    again: "Empezar de nuevo",
    pipe: [
      "Nota de voz de WhatsApp",
      "Transcribir",
      "Extraer problema · impacto · solución",
      "Resumen, confirmar o corregir",
      "Evento al servicio de lecciones",
      "Revisar y compartir",
    ],
    title: "Lecciones aprendidas, por nota de voz",
    pitch:
      "Un trabajador de obra envía una nota de voz por WhatsApp; el asistente la convierte en una lección aprendida estructurada, la repasa con quien la envió y la envía a revisión y a otras obras.",
    builtH: "Lo que construí",
    built:
      "El bucle de agente del asistente es obra de otra persona del equipo. Yo construí el canal de WhatsApp y las lecciones encima:",
  },
  ca: {
    story: "A finals del 2026 el personal d’obra ja el feia servir, i havia recollit diverses lliçons reals.",
    idea: "En una obra ningú no s’atura a omplir un formulari, així que les lliçons apreses es perden. Prova-ho:",
    bullets: [
      "La passarel·la de WhatsApp: webhooks signats, notes de veu i fotos, sessions, i un enrutador que distingeix un albarà d’una lliçó apresa.",
      "La conversa de captura, feta amb una altra persona de l’equip: transcripció, extracció, el resum, i confirmar o corregir.",
      "Els temporitzadors. Surt un recordatori després d’una estona sense resposta i les captures abandonades es tanquen a l’hora, i cada escriptura es comprova per versió perquè un temporitzador mai no trepitgi un missatge més recent.",
      "El servei de lliçons, que vaig escriure en bona part el 2026: el back office de revisió amb estats i motius, el transport d’esdeveniments, i la difusió als equips d’obra, inclòs què van obrir i què van respondre.",
    ],
    recap: {
      problem:
        "La pluja va entrar a l’encofrat la nit abans del formigonat de la planta 2.",
      impact:
        "El formigonat es va endarrerir un dia i es va haver de tornar a demanar el formigó.",
      solution:
        "Tapar amb lones l’encofrat obert sempre que es prevegi pluja en 24 h.",
    },
    fixedImpact:
      "El formigonat es va endarrerir dos dies i es va haver de tornar a demanar el formigó.",
    keys: { problem: "problema", impact: "impacte", solution: "solució" },
    phone: "WhatsApp · equip d’obra",
    voice: "🎤 Nota de veu · 0:21",
    send: "Envia-la a l’assistent",
    got: "Entesos. Això és el que he entès:",
    chapter: "Capítol: Estructura · És correcte?",
    chat: [
      "Van ser dos dies, no un.",
      "Corregit. Alguna cosa més?",
      "Això és tot 👍",
      "Gràcies! Enviat a l’equip per revisar.",
    ],
    confirm: "Confirma",
    correct: "Corregeix",
    office: "Back office · revisió",
    nothing: "Res encara. Les lliçons arriben aquí quan es confirma.",
    card: "Encofrat i pluja",
    shared: "Compartida",
    inReview: "En revisió",
    approve: "Aprova i comparteix",
    sent: "Enviada a 3 equips d’obra · 0 obertes de moment",
    again: "Torna a començar",
    pipe: [
      "Nota de veu de WhatsApp",
      "Transcriure",
      "Extreure problema · impacte · solució",
      "Resum, confirmar o corregir",
      "Esdeveniment al servei de lliçons",
      "Revisar i compartir",
    ],
    title: "Lliçons apreses, per nota de veu",
    pitch:
      "Un treballador d’obra envia una nota de veu per WhatsApp; l’assistent la converteix en una lliçó apresa estructurada, la repassa amb qui l’ha enviat i l’envia a revisió i a altres obres.",
    builtH: "El que vaig construir",
    built:
      "El bucle d’agent de l’assistent és obra d’una altra persona de l’equip. Jo vaig construir el canal de WhatsApp i les lliçons a sobre:",
  },
};

const Bubble = ({ me, children }) => (
  <div
    className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[12px] leading-snug motion-safe:animate-[app-open_0.3s_ease-out] ${me ? "self-end bg-[#1f5c4a] text-white" : "self-start bg-p-raised text-p-fg"}`}
  >
    {children}
  </div>
);

export const Capture = () => {
  const t = useCopy(COPY);
  // 0 voice note sent · 1 recap · 2 corrected · 3 confirmed · 4 approved
  const [step, setStep] = useState(0);
  const [fixed, setFixed] = useState(false);
  const recap = fixed ? { ...t.recap, impact: t.fixedImpact } : t.recap;

  return (
    <figure className="grid gap-3 rounded-lg border border-p-line bg-p-sunk p-3 sm:grid-cols-[1fr_220px]">
      {/* the site worker's phone */}
      <div className="flex min-h-[300px] flex-col gap-2 rounded-md bg-p-sunk p-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-p-muted">
          {t.phone}
        </div>
        <Bubble me>{t.voice}</Bubble>
        {step === 0 && (
          <div className="mt-auto flex justify-center">
            <Chip onClick={() => setStep(1)}>{t.send}</Chip>
          </div>
        )}
        {step >= 1 && (
          <Bubble>
            {t.got}
            <dl className="mt-1.5 flex flex-col gap-1 border-l-2 border-p-ok pl-2">
              {Object.entries(recap).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-p-ok">
                    {t.keys[k]}
                  </dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-1.5 text-[10px] text-p-muted">{t.chapter}</div>
          </Bubble>
        )}
        {step >= 2 && <Bubble me>{t.chat[0]}</Bubble>}
        {step >= 2 && <Bubble>{t.chat[1]}</Bubble>}
        {step >= 3 && <Bubble me>{t.chat[2]}</Bubble>}
        {step >= 3 && <Bubble>{t.chat[3]}</Bubble>}
        {(step === 1 || step === 2) && (
          <div className="mt-auto flex justify-center gap-2 pt-2">
            <Chip onClick={() => setStep(3)}>{t.confirm}</Chip>
            {step === 1 && (
              <Chip
                onClick={() => {
                  setFixed(true);
                  setStep(2);
                }}
              >
                {t.correct}
              </Chip>
            )}
          </div>
        )}
      </div>
      {/* the back office */}
      <div className="flex flex-col gap-2 rounded-md border border-p-line bg-p-surface p-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-p-muted">
          {t.office}
        </div>
        {step < 3 ? (
          <p className="m-auto text-center text-[11px] text-p-muted">
            {t.nothing}
          </p>
        ) : (
          <div className="rounded border border-p-line bg-p-raised p-2.5 text-[11px] motion-safe:animate-[app-open_0.3s_ease-out]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-p-fg">{t.card}</span>
              <span
                className={`rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.1em] ${step === 4 ? "bg-p-ok/20 text-p-ok" : "bg-p-warn/20 text-p-warn"}`}
              >
                {step === 4 ? t.shared : t.inReview}
              </span>
            </div>
            <p className="mt-1 text-p-muted">{recap.solution}</p>
            {step === 3 ? (
              <div className="mt-2 flex gap-1.5">
                <Chip onClick={() => setStep(4)}>{t.approve}</Chip>
              </div>
            ) : (
              <p className="mt-2 text-p-ok">{t.sent}</p>
            )}
          </div>
        )}
        {step === 4 && (
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setFixed(false);
            }}
            className="mt-auto self-start text-[11px] text-p-muted underline hover:text-p-fg"
          >
            {t.again}
          </button>
        )}
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "FastAPI",
  "Redis",
  "RabbitMQ",
  "protobuf",
  "Whisper",
  "LLMs",
  "WhatsApp",
];

const Learnings = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="011h · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mb-3 mt-6">{t.idea}</p>
      <Capture />
      <ol className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-p-muted">
        {t.pipe.map((p, i) => (
          <li key={p} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">→</span>}
            <span className="rounded-full bg-p-fg/10 px-2 py-0.5 text-p-fg">
              {p}
            </span>
          </li>
        ))}
      </ol>
      <H>{t.builtH}</H>
      <p className="mb-2">{t.built}</p>
      <Bullets items={t.bullets} />
      <p className="mt-3">{t.story}</p>
      <div className="mt-4">
        <Snippet file="capture_store.py" language="python" code={CAS} />
      </div>
    </Article>
  );
};

export default Learnings;
