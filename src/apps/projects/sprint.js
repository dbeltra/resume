import React, { useState } from "react";
import {
  Article,
  Bullets,
  Chip,
  H,
  Intro,
  Prose,
  Snippet,
  useCopy,
} from "./ui";
import ChatShot from "../../assets/images/sprint/chat.jpg";
import ChangesShot from "../../assets/images/sprint/changes.jpg";
import TasksShot from "../../assets/images/sprint/tasks.jpg";

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

// one screenshot at a time, with arrows and dots
const Carousel = ({ shots, caps }) => {
  const [i, setI] = useState(0);
  const go = (d) => setI((i + d + shots.length) % shots.length);
  const arrow =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-2.5 py-1 text-[16px] text-white transition-colors hover:bg-black/75";
  return (
    <figure>
      <div className="relative">
        <div className="overflow-hidden rounded-lg border border-p-line shadow-[0_1px_3px_rgba(0,0,0,0.08),0_6px_16px_rgba(0,0,0,0.1)]">
          <div
            style={{ transform: `translateX(-${i * 100}%)` }}
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
          >
            {shots.map((src, k) => (
              <img
                key={src}
                src={src}
                alt={caps[k]}
                aria-hidden={k !== i}
                className={`aspect-[14/9] w-full flex-none object-cover transition-opacity duration-700 ${k === i ? "" : "opacity-40"}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className={`${arrow} left-2`}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className={`${arrow} right-2`}
        >
          ›
        </button>
      </div>
      <figcaption className="mt-2 flex items-start gap-3 text-[11px] leading-snug text-p-muted">
        <span
          key={i}
          className="flex-1 motion-safe:animate-[case-rise_0.5s_cubic-bezier(0.165,0.84,0.44,1)_both]"
        >
          {caps[i]}
        </span>
        <span className="flex flex-none gap-1.5 pt-1">
          {shots.map((src, k) => (
            <button
              key={src}
              type="button"
              aria-label={`${k + 1}`}
              aria-current={k === i}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all duration-500 ${k === i ? "w-5 bg-p-fg" : "w-2 bg-p-fg/25 hover:bg-p-fg/50"}`}
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
};

export const COPY = {
  en: {
    story:
      "I built it because I kept doing the same loop by hand, sprint after sprint, and it was worth automating. It started as a bare /sprint skill in the terminal, then got a web dashboard next to the terminal, and in the end I moved the terminal into the dashboard so everything is in one place. Colleagues have been suggesting features since, and several of them have used it, or a fork of their own.",
    inside: [
      "It trusts what happened over what the board says: a ticket has landed when its merge request is merged and not reverted, whatever its status is. Each ticket gets its own worktree and fresh sessions for plan, build, ship and review, so the sprint session only dispatches and can run all day. It had about 25 releases in its first two months, on top of the team’s shared plugins, which I’ve contributed to as well.",
    ],
    dash: "The dashboard is a local web page to watch it from: every Claude session in a tab, the sprint beside it, and anything that needs a person brought to the front. Here it is running on a made-up sprint and repo:",
    dashBullets: [
      "Each tab is a real Claude Code session with a terminal, held by a separate process, so restarting the page or the server loses nothing.",
      "The chat view is rebuilt from the session’s log and screen. Questions and permission prompts become cards you answer with a click, and edits and subagents are summed up.",
      "Merge requests are reviewed in place: diffs, threads, failed CI logs, approve and merge. Reviews of colleagues’ work are proposed comments that only go out when you press Post.",
      "A small Claude Code mod reports when a session finishes or needs you, within a couple of seconds, with a notification and a chime.",
      "Since the page can open shells, it only listens locally, checks every request’s origin, and never lets a link run a command.",
    ],
    realCaps: [
      "The chat view: a Claude session as a conversation, the files it edited, and the sprint beside it",
      "Changes: the session’s uncommitted diff; a note on a line goes to Claude",
      "My tasks: each ticket’s place in the piv cycle, and what waits on me",
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
    how: "it loops: checks every ticket against what really happened in GitLab and CI, lands merged work, drives open merge requests through review, and proposes the next task, favouring whatever unblocks the other layer. It never starts anything without a yes. Step through a sprint:",
    point: ["Point", "at a Jira board and"],
    dashH: "The dashboard",
  },
  es: {
    story:
      "Lo construí porque me encontraba haciendo el mismo ciclo a mano, sprint tras sprint, y valía la pena automatizarlo. Empezó como una skill /sprint a secas en el terminal, luego tuvo un dashboard web al lado del terminal, y al final metí el terminal dentro del dashboard para tenerlo todo en un sitio. Desde entonces otras personas del equipo han ido proponiendo funcionalidades, y varias lo han usado, o han usado su propio fork.",
    inside: [
      "Se fía de lo que ha pasado y no de lo que dice el tablero: un ticket está integrado cuando su merge request está mergeada y no revertida, diga lo que diga su estado. Cada ticket tiene su worktree y sesiones nuevas para plan, build, ship y revisión, así que la sesión del sprint solo reparte trabajo y puede funcionar todo el día. Tuvo unas 25 versiones en sus dos primeros meses, encima de los plugins compartidos del equipo, en los que también he contribuido.",
    ],
    dash: "El dashboard es una página web local desde donde seguirlo: cada sesión de Claude en una pestaña, el sprint al lado y, delante, todo lo que necesita a una persona. Aquí funcionando con un sprint y un repo inventados:",
    dashBullets: [
      "Cada pestaña es una sesión real de Claude Code con su terminal, sostenida por un proceso aparte, así que reiniciar la página o el servidor no pierde nada.",
      "La vista de chat se reconstruye a partir del log y la pantalla de la sesión. Las preguntas y los permisos se convierten en tarjetas que respondes con un clic, y las ediciones y los subagentes se resumen.",
      "Las merge requests se revisan ahí mismo: diffs, hilos, logs de CI fallidos, aprobar y mergear. Las revisiones del trabajo de otras personas son comentarios propuestos que solo salen cuando pulsas Post.",
      "Un pequeño mod de Claude Code avisa cuando una sesión termina o te necesita, en un par de segundos, con una notificación y un sonido.",
      "Como la página puede abrir shells, solo escucha en local, comprueba el origen de cada petición y nunca deja que un enlace ejecute un comando.",
    ],
    realCaps: [
      "La vista de chat: una sesión de Claude como conversación, los ficheros que ha tocado y el sprint al lado",
      "Cambios: el diff sin commitear de la sesión; una nota en una línea le llega a Claude",
      "Mis tareas: en qué punto del ciclo piv está cada ticket y qué espera de mí",
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
    how: "y entra en bucle: contrasta cada ticket con lo que de verdad pasó en GitLab y en CI, cierra el trabajo mergeado, lleva las merge requests abiertas por la revisión y propone la siguiente tarea, priorizando lo que desbloquea a la otra capa. Nunca empieza nada sin un sí. Avanza por un sprint:",
    point: ["Apunta", "a un tablero de Jira"],
    dashH: "El dashboard",
  },
  ca: {
    story:
      "El vaig construir perquè em trobava fent el mateix cicle a mà, sprint rere sprint, i valia la pena automatitzar-lo. Va començar com una skill /sprint sense res més al terminal, després va tenir un dashboard web al costat del terminal, i al final vaig ficar el terminal dins del dashboard per tenir-ho tot en un lloc. Des d’aleshores altres persones de l’equip hi han anat proposant funcionalitats, i diverses l’han fet servir, o n’han fet servir el seu propi fork.",
    inside: [
      "Es refia del que ha passat i no del que diu el tauler: un tiquet està integrat quan la seva merge request té merge i no s’ha revertit, digui el que digui el seu estat. Cada tiquet té el seu worktree i sessions noves per a pla, build, ship i revisió, així que la sessió del sprint només reparteix feina i pot funcionar tot el dia. Va tenir unes 25 versions en els seus dos primers mesos, a sobre dels plugins compartits de l’equip, als quals també he contribuït.",
    ],
    dash: "El dashboard és una pàgina web local des d’on seguir-lo: cada sessió de Claude en una pestanya, el sprint al costat i, al davant, tot el que necessita una persona. Aquí funcionant amb un sprint i un repo inventats:",
    dashBullets: [
      "Cada pestanya és una sessió real de Claude Code amb el seu terminal, sostinguda per un procés a part, així que reiniciar la pàgina o el servidor no perd res.",
      "La vista de xat es reconstrueix a partir del log i la pantalla de la sessió. Les preguntes i els permisos es converteixen en targetes que respons amb un clic, i les edicions i els subagents es resumeixen.",
      "Les merge requests es revisen al mateix lloc: diffs, fils, logs de CI fallits, aprovar i fer merge. Les revisions de la feina d’altres persones són comentaris proposats que només surten quan prems Post.",
      "Un petit mod de Claude Code avisa quan una sessió acaba o et necessita, en un parell de segons, amb una notificació i un so.",
      "Com que la pàgina pot obrir shells, només escolta en local, comprova l’origen de cada petició i mai no deixa que un enllaç executi una ordre.",
    ],
    realCaps: [
      "La vista de xat: una sessió de Claude com a conversa, els fitxers que ha tocat i el sprint al costat",
      "Canvis: el diff sense commit de la sessió; una nota en una línia li arriba a Claude",
      "Les meves tasques: en quin punt del cicle piv és cada tiquet i què espera de mi",
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
    how: "i entra en bucle: contrasta cada tiquet amb el que de debò ha passat a GitLab i a CI, tanca la feina amb merge, porta les merge requests obertes per la revisió i proposa la tasca següent, prioritzant el que desbloqueja l’altra capa. Mai no comença res sense un sí. Avança per un sprint:",
    point: ["Apunta", "a un tauler de Jira"],
    dashH: "El dashboard",
  },
};

// `start` a later pass, for the Projects card's still
export const Sprint = ({ start = 0 }) => {
  const t = useCopy(COPY);
  const [n, setN] = useState(start);
  const shown = PASSES.slice(0, n + 1);
  const at = Object.assign({}, ...shown.map((p) => p.at));
  const pass = PASSES[n];

  return (
    <figure className="grid gap-3 rounded-lg border border-p-line bg-p-sunk p-3 sm:grid-cols-[1fr_1.1fr]">
      {/* the sprint session */}
      <div className="flex min-h-[260px] flex-col p-dark rounded-md bg-[#12141a] p-3 font-mono text-[11px]">
        <div className="mb-2 font-sans text-[10px] uppercase tracking-[0.14em] text-p-muted">
          /sprint · Claude Code
        </div>
        <ol className="flex flex-col gap-1.5">
          {shown.map((p, i) => (
            <li key={i} className={p.quiet ? "text-p-muted" : "text-p-fg"}>
              {t.passes[i].log.map((l) => (
                <div key={l}>
                  <span className="text-p-pop-text">⏺ </span>
                  {l}
                </div>
              ))}
              {t.passes[i].ask && (
                <div className="text-p-warn">? {t.passes[i].ask}</div>
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
      <div className="flex flex-col gap-1.5 rounded-md border border-p-line bg-p-surface p-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-p-muted">
          {t.panel}
        </div>
        {TICKETS.map(([key, layer], ti) => (
          <div
            key={key}
            className="rounded border border-p-line bg-p-raised px-2.5 py-1.5"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-p-fg">{key}</span>
              <span className="min-w-0 flex-1 truncate text-p-muted">
                {t.tickets[ti]}
              </span>
              <span className="rounded bg-p-fg/10 px-1 text-[9px] text-p-muted">
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
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < at[key] ? (at[key] === 5 ? "bg-p-ok" : "bg-p-pop") : "bg-p-fg/10"}`}
                />
              ))}
            </div>
            <div className="mt-0.5 text-[9px] text-p-muted">
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
        kicker="011h · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mt-6">{t.story}</p>
      <p className="my-3">
        {t.point[0]} <code className="text-p-pop-text">/sprint</code>{" "}
        {t.point[1]} {t.how}
      </p>
      <Sprint />
      <div className="mt-4">
        <Prose items={t.inside} />
      </div>
      <div className="mt-4">
        <Snippet file="snapshot.js" language="javascript" code={GATE} />
      </div>
      <H>{t.dashH}</H>
      <p className="mb-4">{t.dash}</p>
      {/* the real dashboard, run on a made-up sprint and repo */}
      <Carousel shots={[ChatShot, ChangesShot, TasksShot]} caps={t.realCaps} />
      <Bullets items={t.dashBullets} className="mt-4" />
    </Article>
  );
};

export default SprintAgent;
