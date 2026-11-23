import React, { useState } from "react";
import { Article, Bullets, Chip, H, Intro, Snippet, useCopy } from "./ui";
import Dashboard from "./dashboard";
import PanelTop from "../../assets/images/sprint/panel-top.jpg";
import PanelBottom from "../../assets/images/sprint/panel-bottom.jpg";

// The 011h-sprint Claude Code plugin and its dashboard. The real code is
// closed source, so the snippet is rewritten and simplified for this page,
// with made-up tickets.

const GATE = `// One string per ticket with everything that can change. If none changed
// since the last pass, the whole pass is one line of output, so the loop
// can run all day without filling its own context.
const print = (t) =>
  [t.status, t.mr?.state, t.pipeline, t.openThreads, t.reverted].join("|");

const compare = (tickets, before = {}) => {
  const now = Object.fromEntries(tickets.map((t) => [t.key, print(t)]));
  // the union also catches tickets added to or dropped from the sprint
  const keys = new Set([...Object.keys(now), ...Object.keys(before)]);
  return { now, changed: [...keys].filter((k) => now[k] !== before[k]) };
};

const { now, changed } = compare(snapshot.tickets, state.fingerprint);
if (!changed.length)
  return say(\`No change (\${landed}/\${total} landed) since \${state.at}\`);`;

// --- part 2: a sprint, pass by pass -----------------------------------------

// where tickets stand after each pass; what each pass prints is in COPY
const PASSES = [
  { at: { "T-1": 4, "T-2": 0, "T-3": 0, "T-4": 5 } },
  { at: { "T-1": 5 } },
  { at: { "T-2": 1 } },
  { at: { "T-2": 2 } },
  { at: {}, quiet: true },
  { at: { "T-2": 3 } },
  { at: { "T-2": 4 } },
  { at: { "T-2": 5 }, end: true },
];
const TICKETS = [
  ["T-1", "BE"],
  ["T-2", "BE"],
  ["T-3", "FE"],
  ["T-4", "BE"],
];

const COPY = {
  en: {
    realH: "The real thing",
    real: "The Sprint panel itself, run on a made-up sprint: what needs you, what you can start, what’s in flight and what the agent did last.",
    realCaps: [
      "The top: progress per layer, and what needs you",
      "Further down: in flight, waiting, and the log",
    ],
    stats: [
      ["6", "stages per ticket"],
      ["Jira → MR", "end to end"],
      ["A yes", "before it starts anything"],
    ],
    stages: ["To do", "Plan", "Build", "Ship", "Review", "Landed"],
    tickets: [
      "Orders API: search endpoint",
      "Orders API: CSV export",
      "Orders page: search box",
      "Audit log for order changes",
    ],
    passes: [
      { log: ["Sprint 14 · backend · 1/3 landed"] },
      {
        log: [
          "T-1: CI green and approved → merged, moved to Testing.",
          "The frontend’s search box is unblocked.",
        ],
        ask: "Next: T-2 CSV export, top of the board. Start it?",
      },
      { log: ["T-2: own worktree, Plan tab opened."] },
      { log: ["T-2: plan ready → Build tab."] },
      { log: ["No change (2/3 landed) since 10:40."] },
      { log: ["T-2: tests and checks pass → Ship tab opens the MR."] },
      {
        log: [
          "T-2: 2 review comments → a fresh subagent fixed them, replied and pushed.",
        ],
      },
      {
        log: [
          "T-2: merged. Backend done: 3/3 landed.",
          "Only frontend work is left, so I’m stopping here.",
        ],
      },
    ],
    again: "Run it again",
    yes: "Yes, start it",
    next: "Next pass",
    panel: "Dashboard · sprint",
    title: "A sprint, run by an agent",
    pitch:
      "A Claude Code plugin I wrote that runs our sprints end to end, with a local dashboard to watch it and a person approving every step.",
    howH: "How it works",
    how: "it loops: checks every ticket against what really happened in GitLab and CI, lands merged work, drives open merge requests through review, and proposes the next task, favouring whatever unblocks the other layer. It never starts anything without a yes. Step through a sprint:",
    point: ["Point", "at a Jira board and"],
    insideH: "What’s inside",
    inside: [
      [
        "Truth over the board.",
        "Landed means merged and not reverted, whatever the ticket says.",
      ],
      [
        "Clean context.",
        "Each ticket gets its own worktree and fresh sessions for plan, build, ship and review, so the sprint session stays a dispatcher that can run all day.",
      ],
      [
        "Fast.",
        "Two months, about 25 releases, on top of the team’s shared plugins, which I contribute to as well.",
      ],
    ],
    dashH: "The dashboard",
    dash: "An agent that runs all day needs somewhere to watch it. The dashboard is a local web page: every Claude session in a tab, the sprint beside it, and anything that needs a person brought to the front. A few screens:",
    dashBullets: [
      [
        "Sessions that stay.",
        "Each tab is a real Claude Code session with a terminal, held by a separate process, so restarting the page or the server loses nothing.",
      ],
      [
        "A chat view.",
        "Rebuilt from the session’s log and screen: questions and permission prompts become cards you answer with a click, and edits and subagents are summed up.",
      ],
      [
        "Review in place.",
        "Merge request diffs, threads, failed CI logs, approve and merge. Reviews of colleagues’ work are proposed comments that only go out when you press Post.",
      ],
      [
        "It tells you.",
        "A small Claude Code mod reports when a session finishes or needs you, within a couple of seconds, with a notification and a chime.",
      ],
      [
        "Safe by default.",
        "A page that can open shells only listens locally, checks every request’s origin, and never lets a link run a command.",
      ],
    ],
  },
  es: {
    realH: "El de verdad",
    real: "El panel del sprint real, con un sprint inventado: lo que te necesita, lo que puedes empezar, lo que está en marcha y lo último que ha hecho el agente.",
    realCaps: [
      "Arriba: el progreso por capa y lo que te necesita",
      "Más abajo: en marcha, en espera y el registro",
    ],
    stats: [
      ["6", "fases por ticket"],
      ["Jira → MR", "de punta a punta"],
      ["Un sí", "antes de empezar nada"],
    ],
    stages: ["Por hacer", "Plan", "Build", "Ship", "Revisión", "Integrado"],
    tickets: [
      "API de pedidos: endpoint de búsqueda",
      "API de pedidos: exportar a CSV",
      "Página de pedidos: buscador",
      "Registro de auditoría de pedidos",
    ],
    passes: [
      { log: ["Sprint 14 · backend · 1/3 integrados"] },
      {
        log: [
          "T-1: CI en verde y aprobado → mergeado, pasa a Testing.",
          "El buscador del frontend queda desbloqueado.",
        ],
        ask: "Siguiente: T-2 exportar a CSV, primero del tablero. ¿Lo empiezo?",
      },
      { log: ["T-2: worktree propio, pestaña Plan abierta."] },
      { log: ["T-2: plan listo → pestaña Build."] },
      { log: ["Sin cambios (2/3 integrados) desde las 10:40."] },
      {
        log: [
          "T-2: tests y comprobaciones en verde → la pestaña Ship abre la MR.",
        ],
      },
      {
        log: [
          "T-2: 2 comentarios de revisión → un subagente nuevo los corrigió, respondió e hizo push.",
        ],
      },
      {
        log: [
          "T-2: mergeado. Backend terminado: 3/3 integrados.",
          "Solo queda trabajo de frontend, así que paro aquí.",
        ],
      },
    ],
    again: "Otra vez",
    yes: "Sí, empiézalo",
    next: "Siguiente pasada",
    panel: "Dashboard · sprint",
    title: "Un sprint, llevado por un agente",
    pitch:
      "Un plugin de Claude Code que escribí y que lleva nuestros sprints de principio a fin, con un dashboard local para seguirlo y una persona aprobando cada paso.",
    howH: "Cómo funciona",
    how: "y entra en bucle: contrasta cada ticket con lo que de verdad pasó en GitLab y en CI, cierra el trabajo mergeado, lleva las merge requests abiertas por la revisión y propone la siguiente tarea, priorizando lo que desbloquea a la otra capa. Nunca empieza nada sin un sí. Avanza por un sprint:",
    point: ["Apunta", "a un tablero de Jira"],
    insideH: "Qué hay dentro",
    inside: [
      [
        "La realidad por encima del tablero.",
        "Integrado quiere decir mergeado y no revertido, diga lo que diga el ticket.",
      ],
      [
        "Contexto limpio.",
        "Cada ticket tiene su worktree y sesiones nuevas para plan, build, ship y revisión, así que la sesión del sprint se queda en despachador y puede funcionar todo el día.",
      ],
      [
        "Rápido.",
        "Dos meses, unas 25 versiones, encima de los plugins compartidos del equipo, en los que también contribuyo.",
      ],
    ],
    dashH: "El dashboard",
    dash: "Un agente que funciona todo el día necesita un sitio desde donde seguirlo. El dashboard es una página web local: cada sesión de Claude en una pestaña, el sprint al lado y, delante, todo lo que necesita a una persona. Algunas pantallas:",
    dashBullets: [
      [
        "Sesiones que se quedan.",
        "Cada pestaña es una sesión real de Claude Code con su terminal, sostenida por un proceso aparte, así que reiniciar la página o el servidor no pierde nada.",
      ],
      [
        "Una vista de chat.",
        "Reconstruida a partir del log y la pantalla de la sesión: las preguntas y los permisos se convierten en tarjetas que respondes con un clic, y las ediciones y los subagentes se resumen.",
      ],
      [
        "Revisión en el sitio.",
        "Diffs de merge requests, hilos, logs de CI fallidos, aprobar y mergear. Las revisiones del trabajo de otras personas son comentarios propuestos que solo salen cuando pulsas Post.",
      ],
      [
        "Te avisa.",
        "Un pequeño mod de Claude Code informa cuando una sesión termina o te necesita, en un par de segundos, con una notificación y un sonido.",
      ],
      [
        "Seguro por defecto.",
        "Una página que puede abrir shells solo escucha en local, comprueba el origen de cada petición y nunca deja que un enlace ejecute un comando.",
      ],
    ],
  },
  ca: {
    realH: "El de debò",
    real: "El panell del sprint real, amb un sprint inventat: el que et necessita, el que pots començar, el que està en marxa i l’últim que ha fet l’agent.",
    realCaps: [
      "A dalt: el progrés per capa i el que et necessita",
      "Més avall: en marxa, en espera i el registre",
    ],
    stats: [
      ["6", "fases per tiquet"],
      ["Jira → MR", "de punta a punta"],
      ["Un sí", "abans de començar res"],
    ],
    stages: ["Per fer", "Pla", "Build", "Ship", "Revisió", "Integrat"],
    tickets: [
      "API de comandes: endpoint de cerca",
      "API de comandes: exportar a CSV",
      "Pàgina de comandes: cercador",
      "Registre d’auditoria de comandes",
    ],
    passes: [
      { log: ["Sprint 14 · backend · 1/3 integrats"] },
      {
        log: [
          "T-1: CI en verd i aprovat → fet merge, passa a Testing.",
          "El cercador del frontend queda desbloquejat.",
        ],
        ask: "Següent: T-2 exportar a CSV, el primer del tauler. El començo?",
      },
      { log: ["T-2: worktree propi, pestanya Pla oberta."] },
      { log: ["T-2: pla llest → pestanya Build."] },
      { log: ["Cap canvi (2/3 integrats) des de les 10:40."] },
      {
        log: [
          "T-2: tests i comprovacions en verd → la pestanya Ship obre la MR.",
        ],
      },
      {
        log: [
          "T-2: 2 comentaris de revisió → un subagent nou els ha corregit, ha respost i ha fet push.",
        ],
      },
      {
        log: [
          "T-2: fet merge. Backend acabat: 3/3 integrats.",
          "Només queda feina de frontend, així que m’aturo aquí.",
        ],
      },
    ],
    again: "Un altre cop",
    yes: "Sí, comença’l",
    next: "Següent passada",
    panel: "Dashboard · sprint",
    title: "Un sprint, portat per un agent",
    pitch:
      "Un plugin de Claude Code que vaig escriure i que porta els nostres sprints de cap a peus, amb un dashboard local per seguir-lo i una persona aprovant cada pas.",
    howH: "Com funciona",
    how: "i entra en bucle: contrasta cada tiquet amb el que de debò ha passat a GitLab i a CI, tanca la feina amb merge, porta les merge requests obertes per la revisió i proposa la tasca següent, prioritzant el que desbloqueja l’altra capa. Mai no comença res sense un sí. Avança per un sprint:",
    point: ["Apunta", "a un tauler de Jira"],
    insideH: "Què hi ha a dins",
    inside: [
      [
        "La realitat per sobre del tauler.",
        "Integrat vol dir amb merge i no revertit, digui el que digui el tiquet.",
      ],
      [
        "Context net.",
        "Cada tiquet té el seu worktree i sessions noves per a pla, build, ship i revisió, així que la sessió del sprint es queda en despatxador i pot funcionar tot el dia.",
      ],
      [
        "Ràpid.",
        "Dos mesos, unes 25 versions, a sobre dels plugins compartits de l’equip, als quals també contribueixo.",
      ],
    ],
    dashH: "El dashboard",
    dash: "Un agent que funciona tot el dia necessita un lloc des d’on seguir-lo. El dashboard és una pàgina web local: cada sessió de Claude en una pestanya, el sprint al costat i, al davant, tot el que necessita una persona. Algunes pantalles:",
    dashBullets: [
      [
        "Sessions que es queden.",
        "Cada pestanya és una sessió real de Claude Code amb el seu terminal, sostinguda per un procés a part, així que reiniciar la pàgina o el servidor no perd res.",
      ],
      [
        "Una vista de xat.",
        "Reconstruïda a partir del log i la pantalla de la sessió: les preguntes i els permisos es converteixen en targetes que respons amb un clic, i les edicions i els subagents es resumeixen.",
      ],
      [
        "Revisió al mateix lloc.",
        "Diffs de merge requests, fils, logs de CI fallits, aprovar i fer merge. Les revisions de la feina d’altres persones són comentaris proposats que només surten quan prems Post.",
      ],
      [
        "T’avisa.",
        "Un petit mod de Claude Code informa quan una sessió acaba o et necessita, en un parell de segons, amb una notificació i un so.",
      ],
      [
        "Segur per defecte.",
        "Una pàgina que pot obrir shells només escolta en local, comprova l’origen de cada petició i mai no deixa que un enllaç executi una ordre.",
      ],
    ],
  },
};

export const Sprint = () => {
  const t = useCopy(COPY);
  const [n, setN] = useState(0);
  const shown = PASSES.slice(0, n + 1);
  const at = Object.assign({}, ...shown.map((p) => p.at));
  const pass = PASSES[n];

  return (
    <figure className="grid gap-3 rounded-lg border border-[#2e313a] bg-[#191b20] p-3 sm:grid-cols-[1fr_1.1fr]">
      {/* the sprint session */}
      <div className="flex min-h-[260px] flex-col rounded-md bg-[#12141a] p-3 font-mono text-[11px]">
        <div className="mb-2 font-sans text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          /sprint · Claude Code
        </div>
        <ol className="flex flex-col gap-1.5">
          {shown.map((p, i) => (
            <li
              key={i}
              className={p.quiet ? "text-ink-muted" : "text-ink-text"}
            >
              {t.passes[i].log.map((l) => (
                <div key={l}>
                  <span className="text-lilac-text">⏺ </span>
                  {l}
                </div>
              ))}
              {t.passes[i].ask && (
                <div className="text-[#f5c451]">? {t.passes[i].ask}</div>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-auto flex gap-2 pt-3 font-sans">
          {pass.end ? (
            <Chip onClick={() => setN(0)}>{t.again}</Chip>
          ) : (
            <Chip onClick={() => setN(n + 1)}>
              {t.passes[n].ask ? t.yes : t.next}
            </Chip>
          )}
        </div>
      </div>
      {/* the dashboard's sprint panel */}
      <div className="flex flex-col gap-1.5 rounded-md border border-[#2e313a] bg-[#1e2026] p-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          {t.panel}
        </div>
        {TICKETS.map(([key, layer], ti) => (
          <div
            key={key}
            className="rounded border border-[#2e313a] bg-[#262932] px-2.5 py-1.5"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-ink-text">{key}</span>
              <span className="min-w-0 flex-1 truncate text-ink-muted">
                {t.tickets[ti]}
              </span>
              <span className="rounded bg-white/10 px-1 text-[9px] text-ink-muted">
                {layer}
              </span>
            </div>
            <div
              className="mt-1.5 flex gap-0.5"
              aria-label={`${key}: ${t.stages[at[key]]}`}
            >
              {t.stages.slice(1).map((s, i) => (
                <span
                  key={s}
                  title={s}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < at[key] ? (at[key] === 5 ? "bg-[#7fd1a8]" : "bg-lilac") : "bg-white/10"}`}
                />
              ))}
            </div>
            <div className="mt-0.5 text-[9px] text-ink-muted">
              {t.stages[at[key]]}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
};

const STACK = [
  "Claude Code",
  "Node",
  "xterm.js",
  "WebSockets",
  "Jira",
  "GitLab",
];

const SprintAgent = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        stats={t.stats}
        kicker="011h · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <H>{t.howH}</H>
      <p className="mb-3">
        {t.point[0]} <code className="text-lilac-text">/sprint</code>{" "}
        {t.point[1]} {t.how}
      </p>
      <Sprint />
      <H>{t.insideH}</H>
      <Bullets items={t.inside} />
      <div className="mt-4">
        <Snippet file="snapshot.js" language="javascript" code={GATE} />
      </div>
      <H>{t.dashH}</H>
      <p className="mb-4">{t.dash}</p>
      <Dashboard />
      <Bullets items={t.dashBullets} className="mt-4" />
      <H>{t.realH}</H>
      <p className="mb-4">{t.real}</p>
      {/* screenshots of the real dashboard, run against a made-up state.json */}
      <div className="grid grid-cols-2 gap-4">
        {[PanelTop, PanelBottom].map((src, i) => (
          <figure key={src}>
            <img
              src={src}
              alt={t.realCaps[i]}
              loading="lazy"
              className="w-full rounded-lg border border-[#2e313a] shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
            />
            <figcaption className="mt-2 text-[11px] leading-snug text-ink-muted">
              {t.realCaps[i]}
            </figcaption>
          </figure>
        ))}
      </div>
    </Article>
  );
};

export default SprintAgent;
