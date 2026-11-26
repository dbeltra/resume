import React, { useState } from "react";
import { Article, Chip, H, Intro, Prose, Snippet, useCopy } from "./ui";

// 011h Builder, the construction planning service. The real code is closed
// source, so the snippets are rewritten and simplified for this page, and
// the schedule below is made up.

const END = `def snapshot_end(bar: SnapshotBar, snapshot: Snapshot) -> date:
    # A snapshot is a promise made on a given day. If someone later adds a
    # holiday, today's bars move, but the promise shouldn't. So a snapshot
    # keeps the calendar it was saved with, and its ends are counted on it.
    return snapshot.calendar.add_working_days(bar.start, bar.working_days - 1)


def delay(bar: Bar, baseline: SnapshotBar, snapshot: Snapshot, calendar: Calendar) -> int:
    planned = snapshot_end(baseline, snapshot)
    # today's calendar decides how many working days late the bar is
    return calendar.working_days_between(planned, bar.end)  # > 0: it slipped`;

const SCENARIO = `Scenario: A holiday added after a snapshot doesn't move its planned end
  Given a planning with a bar from Monday to Wednesday
  And a snapshot of the planning
  When Tuesday becomes a non-working day
  Then the bar ends on Thursday
  And the snapshot still ends it on Wednesday`;

// --- the schedule ------------------------------------------------------------

const COLS = 20; // four working weeks
const AREAS = 4;
const STAGGER = 3; // each floor starts 3 working days after the one below
const TRADES = [
  ["structure", 3, "#b98ab9"],
  ["mep", 2, "#7094db"],
  ["finishes", 2, "#7fd1a8"],
];
const SLIP = { area: 1, trade: 1, days: 2 }; // MEP on floor 2
const HOLIDAY = 7; // the 8th working day

export const COPY = {
  en: {
    endH: "Delays against a snapshot",
    built: [
      "I’ve worked on it since July 2026 and written a large part of it. A planning gets its trains from a master template, and a train’s days are merged into bars; plannings can be reordered within a project. Bars go from one-day activities to multi-day ones that keep their working days when you move, copy or undo them, and they’re read through a new v2 contract. I also work on the Look-Ahead: each planning’s row order, late locations flagged on the week bars, and overdue cards grouped by area.",
      "Snapshots are the plan’s baselines. You can save, list, read, rename and delete them, delays are measured against each one on the calendar it was saved with, and when a bar moves to another area the day it moved is kept. Each process has a provider, cascaded to its activities and audited on every change. Underneath, check constraints cover ranges, dates and self-dependencies, alongside Postgres enums and case-insensitive unique names.",
      "It’s been a hard project. Working out the database structure took a lot, then making the queries fast, and after that the replanning engine.",
    ],
    trades: { structure: "Structure", mep: "MEP", finishes: "Finishes" },
    floor: (n) => `Floor ${n}`,
    save: "Save a snapshot",
    saved: "Snapshot saved",
    slip: "MEP on floor 2 slips 2 days",
    holiday: "Day 8 becomes a holiday",
    reset: "Reset",
    hint: "Save a snapshot first, then make things go wrong.",
    late: (what, n) => `${what}: ${n} working day${n === 1 ? "" : "s"} late`,
    onTime: "Everything is on time against the snapshot.",
    more: (n) => `+${n} more late bars`,
    legend: ["snapshot", "holiday"],
    aria: "A line-of-balance schedule: four floors, each running structure, MEP and finishes in turn, three working days behind the floor below.",
    title: "Construction planning",
    pitch:
      "The service behind 011h Builder, where site teams plan a building as trains of trades rolling floor by floor, and see what slipped against the plan they promised.",
    idea: "A building goes up floor by floor, and each floor goes through the same trades in the same order: a train. Builder lays those trains out on a calendar as bars, keeps a few weeks’ Look-Ahead for the site, and lets the team save snapshots of the plan to measure delays against later. Try it:",
    builtH: "What I’ve built",
  },
  es: {
    endH: "Retrasos respecto a una instantánea",
    built: [
      "He trabajado en él desde julio de 2026 y he escrito buena parte. Una planificación saca sus trenes de una plantilla maestra, y los días de un tren se fusionan en barras; dentro de un proyecto, las planificaciones se pueden reordenar. Las barras van de actividades de un día a otras de varios días que conservan sus días laborables al moverlas, copiarlas o deshacer, y se leen a través de un nuevo contrato v2. También trabajo en el Look-Ahead: el orden de filas de cada planificación, las ubicaciones con retraso marcadas en las barras semanales y las tarjetas vencidas agrupadas por zona.",
      "Las instantáneas son las líneas base del plan. Se pueden guardar, listar, leer, renombrar y borrar, los retrasos se miden respecto a cada una con el calendario con que se guardó, y si una barra cambia de zona queda registrado el día. Cada proceso tiene un proveedor, propagado a sus actividades y auditado en cada cambio. Por debajo hay restricciones de comprobación para rangos, fechas y autodependencias, enums de Postgres y nombres únicos sin distinguir mayúsculas.",
      "Está siendo un proyecto difícil. Dar con la estructura de la base de datos costó mucho, luego hacer que las consultas fueran rápidas, y después el motor de replanificación.",
    ],
    trades: {
      structure: "Estructura",
      mep: "Instalaciones",
      finishes: "Acabados",
    },
    floor: (n) => `Planta ${n}`,
    save: "Guardar una instantánea",
    saved: "Instantánea guardada",
    slip: "Instalaciones en la planta 2 se retrasa 2 días",
    holiday: "El día 8 pasa a ser festivo",
    reset: "Reiniciar",
    hint: "Guarda primero una instantánea y luego haz que algo salga mal.",
    late: (what, n) =>
      `${what}: ${n} día${n === 1 ? "" : "s"} laborable${n === 1 ? "" : "s"} de retraso`,
    onTime: "Todo va a tiempo respecto a la instantánea.",
    more: (n) => `+${n} barras más con retraso`,
    legend: ["instantánea", "festivo"],
    aria: "Una planificación de línea de balance: cuatro plantas, cada una con estructura, instalaciones y acabados por turnos, tres días laborables por detrás de la planta de abajo.",
    title: "Planificación de obra",
    pitch:
      "El servicio detrás de 011h Builder, donde los equipos de obra planifican un edificio como trenes de oficios que avanzan planta a planta, y ven qué se ha retrasado respecto al plan que prometieron.",
    idea: "Un edificio sube planta a planta, y cada planta pasa por los mismos oficios en el mismo orden: un tren. Builder coloca esos trenes en un calendario como barras, mantiene un Look-Ahead de unas semanas para la obra, y deja guardar instantáneas del plan para medir después los retrasos. Pruébalo:",
    builtH: "Lo que he construido",
  },
  ca: {
    endH: "Retards respecte a una instantània",
    built: [
      "Hi he treballat des del juliol del 2026 i n’he escrit bona part. Una planificació treu els trens d’una plantilla mestra, i els dies d’un tren es fusionen en barres; dins d’un projecte, les planificacions es poden reordenar. Les barres van d’activitats d’un dia a d’altres de diversos dies que conserven els seus dies feiners quan es mouen, es copien o es desfan, i es llegeixen a través d’un nou contracte v2. També treballo en el Look-Ahead: l’ordre de files de cada planificació, les ubicacions amb retard marcades a les barres setmanals i les targetes vençudes agrupades per zona.",
      "Les instantànies són les línies base del pla. Es poden desar, llistar, llegir, reanomenar i esborrar, els retards es mesuren respecte a cadascuna amb el calendari amb què es va desar, i si una barra canvia de zona en queda registrat el dia. Cada procés té un proveïdor, propagat a les seves activitats i auditat a cada canvi. Per sota hi ha restriccions de comprovació per a rangs, dates i autodependències, enums de Postgres i noms únics sense distingir majúscules.",
      "Està sent un projecte difícil. Trobar l’estructura de la base de dades va costar molt, després fer que les consultes fossin ràpides, i després el motor de replanificació.",
    ],
    trades: {
      structure: "Estructura",
      mep: "Instal·lacions",
      finishes: "Acabats",
    },
    floor: (n) => `Planta ${n}`,
    save: "Desa una instantània",
    saved: "Instantània desada",
    slip: "Instal·lacions a la planta 2 es retarda 2 dies",
    holiday: "El dia 8 passa a ser festiu",
    reset: "Reinicia",
    hint: "Desa primer una instantània i després fes que alguna cosa surti malament.",
    late: (what, n) =>
      `${what}: ${n} dia${n === 1 ? "" : "s"} feiner${n === 1 ? "" : "s"} de retard`,
    onTime: "Tot va a temps respecte a la instantània.",
    more: (n) => `+${n} barres més amb retard`,
    legend: ["instantània", "festiu"],
    aria: "Una planificació de línia de balanç: quatre plantes, cadascuna amb estructura, instal·lacions i acabats per torns, tres dies feiners per darrere de la planta de sota.",
    title: "Planificació d’obra",
    pitch:
      "El servei darrere de 011h Builder, on els equips d’obra planifiquen un edifici com a trens d’oficis que avancen planta a planta, i veuen què s’ha retardat respecte al pla que van prometre.",
    idea: "Un edifici puja planta a planta, i cada planta passa pels mateixos oficis en el mateix ordre: un tren. Builder col·loca aquests trens en un calendari com a barres, manté un Look-Ahead d’unes setmanes per a l’obra, i permet desar instantànies del pla per mesurar-hi després els retards. Prova-ho:",
    builtH: "El que he construït",
  },
};

// bars as [area, trade, first column, last column] on a calendar
const layout = (holidays, slipped) => {
  const working = [...Array(COLS + 10).keys()].filter((c) => !holidays.has(c));
  const bars = [];
  for (let a = 0; a < AREAS; a++) {
    let start = a * STAGGER;
    TRADES.forEach(([, days], k) => {
      if (slipped && a === SLIP.area && k === SLIP.trade) start += SLIP.days;
      bars.push([a, k, working[start], working[start + days - 1]]);
      start += days;
    });
  }
  return bars;
};

// `slip` starts with a snapshot saved and a floor slipped against it, for the
// Projects card's still
export const Schedule = ({ slip = false }) => {
  const t = useCopy(COPY);
  const [holiday, setHoliday] = useState(false);
  const [slipped, setSlipped] = useState(slip);
  // the bars, on its calendar
  const [snapshot, setSnapshot] = useState(() =>
    slip ? layout(new Set(), false) : null,
  );
  const holidays = new Set(holiday ? [HOLIDAY] : []);
  const bars = layout(holidays, slipped);
  const working = (from, to) =>
    [...Array(Math.max(to - from, 0)).keys()].filter(
      (i) => !holidays.has(from + 1 + i),
    ).length;
  const late = snapshot
    ? bars
        .map(([a, k, , end], i) => [a, k, working(snapshot[i][3], end)])
        .filter(([, , n]) => n > 0)
        .sort((x, y) => y[2] - x[2])
    : [];
  const cell = "flex h-7 items-center";

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip onClick={() => setSnapshot(layout(holidays, slipped))}>
          {snapshot ? `✓ ${t.saved}` : t.save}
        </Chip>
        <Chip aria-pressed={slipped} onClick={() => setSlipped(!slipped)}>
          {slipped ? "✓ " : ""}
          {t.slip}
        </Chip>
        <Chip aria-pressed={holiday} onClick={() => setHoliday(!holiday)}>
          {holiday ? "✓ " : ""}
          {t.holiday}
        </Chip>
        <button
          type="button"
          onClick={() => {
            setHoliday(false);
            setSlipped(false);
            setSnapshot(null);
          }}
          className="px-2 text-[11px] text-p-muted underline hover:text-p-fg"
        >
          {t.reset}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div role="img" aria-label={t.aria} className="min-w-[560px]">
          {[...Array(AREAS).keys()].reverse().map((a) => (
            <div
              key={a}
              className="grid border-b border-p-line last:border-b-0"
              style={{
                gridTemplateColumns: `64px repeat(${COLS}, minmax(0, 1fr))`,
              }}
            >
              <div
                className={`${cell} text-[10px] text-p-muted`}
                style={{ gridRow: 1, gridColumn: 1 }}
              >
                {t.floor(a + 1)}
              </div>
              {[...Array(COLS).keys()].map((c) => (
                <div
                  key={c}
                  className={`h-7 border-l border-p-fg/5 ${holidays.has(c) ? "bg-[repeating-linear-gradient(45deg,rgba(229,121,122,0.25)_0_4px,transparent_4px_8px)]" : ""}`}
                  style={{ gridRow: 1, gridColumn: c + 2 }}
                />
              ))}
              {snapshot &&
                snapshot
                  .filter(([ba]) => ba === a)
                  .map(([, k, s, e]) => (
                    <div
                      key={`s${k}`}
                      className="my-1 rounded border border-dashed border-p-fg/50"
                      style={{ gridRow: 1, gridColumn: `${s + 2} / ${e + 3}` }}
                    />
                  ))}
              {bars
                .filter(([ba, , s]) => ba === a && s < COLS)
                .map(([, k, s, e]) => (
                  <div
                    key={k}
                    className="z-10 my-1.5 truncate rounded px-1 text-[9px] font-semibold leading-4 text-[#15171c] transition-all duration-300"
                    style={{
                      gridRow: 1,
                      gridColumn: `${s + 2} / ${Math.min(e, COLS - 1) + 3}`,
                      background: TRADES[k][2],
                    }}
                  >
                    {t.trades[TRADES[k][0]]}
                  </div>
                ))}
            </div>
          ))}
          <div
            className="grid pt-1 text-center text-[9px] text-p-muted"
            style={{
              gridTemplateColumns: `64px repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            <span />
            {[...Array(COLS).keys()].map((c) => (
              <span key={c}>{c + 1}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3 text-[12px]">
        <ul className="flex flex-col gap-0.5">
          {!snapshot && <li className="text-p-muted">{t.hint}</li>}
          {snapshot && !late.length && (
            <li className="text-p-ok">{t.onTime}</li>
          )}
          {late.slice(0, 3).map(([a, k, n]) => (
            <li key={`${a}-${k}`} className="text-p-warn">
              {t.late(`${t.trades[TRADES[k][0]]} · ${t.floor(a + 1)}`, n)}
            </li>
          ))}
          {late.length > 3 && (
            <li className="text-p-muted">{t.more(late.length - 3)}</li>
          )}
        </ul>
        <span className="flex gap-3 text-[10px] text-p-muted">
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-4 rounded-sm border border-dashed border-p-fg/50" />
            {t.legend[0]}
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-4 rounded-sm bg-p-bad/40" />
            {t.legend[1]}
          </span>
        </span>
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "SQLAlchemy",
  "Redis",
  "Alembic",
  "Behave",
];

const Builder = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="011h · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mb-4 mt-6">{t.idea}</p>
      <Schedule />
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.endH}</H>
      <Snippet file="snapshot_delays.py" language="python" code={END} />
      <div className="mt-4">
        <Snippet
          file="snapshot_calendar.feature"
          language="gherkin"
          code={SCENARIO}
        />
      </div>
    </Article>
  );
};

export default Builder;
