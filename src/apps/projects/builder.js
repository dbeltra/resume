import React, { useState } from "react";
import { Article, Bullets, Chip, H, Intro, Snippet, useCopy } from "./ui";

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

const COPY = {
  en: {
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
    ideaH: "The idea",
    idea: "A building goes up floor by floor, and each floor goes through the same trades in the same order: a train. Builder lays those trains out on a calendar as bars, keeps a few weeks’ Look-Ahead for the site, and lets the team save snapshots of the plan to measure delays against later. Try it:",
    builtH: "What I build",
    built:
      "It’s the project I’m on now, and I’ve been its main contributor since the summer:",
    bullets: [
      [
        "Plannings and trains.",
        "Plannings in a reorderable order per project, trains imported from a master template, and a train’s days merged into bars.",
      ],
      [
        "Bars.",
        "From one-day activities to multi-day bars that keep their working days when moved, copied or undone, behind a new v2 read contract.",
      ],
      [
        "The Look-Ahead.",
        "Each planning’s row order, late locations flagged on the week bars, and overdue cards grouped by area.",
      ],
      [
        "Providers.",
        "A provider per process, cascaded to its activities, with every change audited.",
      ],
      [
        "Snapshots.",
        "Save, list, read, rename and delete a planning’s baselines; delays measured against them, each on the calendar it was saved with; and the day a bar moved to another area kept.",
      ],
      [
        "Data that can’t go wrong.",
        "Check constraints for ranges, dates and self-dependencies, Postgres enums, and case-insensitive unique names.",
      ],
    ],
    endH: "A promise keeps its own calendar",
    testH: "The test that pins it down",
  },
  es: {
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
    ideaH: "La idea",
    idea: "Un edificio sube planta a planta, y cada planta pasa por los mismos oficios en el mismo orden: un tren. Builder coloca esos trenes en un calendario como barras, mantiene un Look-Ahead de unas semanas para la obra, y deja guardar instantáneas del plan para medir después los retrasos. Pruébalo:",
    builtH: "Lo que construyo",
    built:
      "Es el proyecto en el que estoy ahora, y desde el verano soy su principal contribuidor:",
    bullets: [
      [
        "Planificaciones y trenes.",
        "Planificaciones con un orden reordenable por proyecto, trenes importados de una plantilla maestra, y los días de un tren fusionados en barras.",
      ],
      [
        "Barras.",
        "De actividades de un día a barras de varios días que conservan sus días laborables al moverlas, copiarlas o deshacer, tras un nuevo contrato de lectura v2.",
      ],
      [
        "El Look-Ahead.",
        "El orden de filas de cada planificación, las ubicaciones con retraso marcadas en las barras semanales, y las tarjetas vencidas agrupadas por zona.",
      ],
      [
        "Proveedores.",
        "Un proveedor por proceso, propagado a sus actividades, con cada cambio auditado.",
      ],
      [
        "Instantáneas.",
        "Guardar, listar, leer, renombrar y borrar las líneas base de una planificación; los retrasos medidos respecto a ellas, cada una con el calendario con que se guardó; y el día en que una barra cambió de zona, registrado.",
      ],
      [
        "Datos que no pueden fallar.",
        "Restricciones de comprobación para rangos, fechas y autodependencias, enums de Postgres, y nombres únicos sin distinguir mayúsculas.",
      ],
    ],
    endH: "Una promesa conserva su propio calendario",
    testH: "El test que lo deja claro",
  },
  ca: {
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
    ideaH: "La idea",
    idea: "Un edifici puja planta a planta, i cada planta passa pels mateixos oficis en el mateix ordre: un tren. Builder col·loca aquests trens en un calendari com a barres, manté un Look-Ahead d’unes setmanes per a l’obra, i permet desar instantànies del pla per mesurar-hi després els retards. Prova-ho:",
    builtH: "El que construeixo",
    built:
      "És el projecte on soc ara, i des de l’estiu en soc el principal contribuïdor:",
    bullets: [
      [
        "Planificacions i trens.",
        "Planificacions amb un ordre reordenable per projecte, trens importats d’una plantilla mestra, i els dies d’un tren fusionats en barres.",
      ],
      [
        "Barres.",
        "D’activitats d’un dia a barres de diversos dies que conserven els seus dies feiners quan es mouen, es copien o es desfan, darrere d’un nou contracte de lectura v2.",
      ],
      [
        "El Look-Ahead.",
        "L’ordre de files de cada planificació, les ubicacions amb retard marcades a les barres setmanals, i les targetes vençudes agrupades per zona.",
      ],
      [
        "Proveïdors.",
        "Un proveïdor per procés, propagat a les seves activitats, amb cada canvi auditat.",
      ],
      [
        "Instantànies.",
        "Desar, llistar, llegir, reanomenar i esborrar les línies base d’una planificació; els retards mesurats respecte a elles, cadascuna amb el calendari amb què es va desar; i el dia que una barra va canviar de zona, registrat.",
      ],
      [
        "Dades que no poden fallar.",
        "Restriccions de comprovació per a rangs, dates i autodependències, enums de Postgres, i noms únics sense distingir majúscules.",
      ],
    ],
    endH: "Una promesa conserva el seu propi calendari",
    testH: "El test que ho deixa clar",
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

const Schedule = () => {
  const t = useCopy(COPY);
  const [holiday, setHoliday] = useState(false);
  const [slipped, setSlipped] = useState(false);
  const [snapshot, setSnapshot] = useState(null); // the bars, on its calendar
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
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
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
          className="px-2 text-[11px] text-ink-muted underline hover:text-ink-text"
        >
          {t.reset}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div role="img" aria-label={t.aria} className="min-w-[560px]">
          {[...Array(AREAS).keys()].reverse().map((a) => (
            <div
              key={a}
              className="grid border-b border-[#2e313a] last:border-b-0"
              style={{
                gridTemplateColumns: `64px repeat(${COLS}, minmax(0, 1fr))`,
              }}
            >
              <div
                className={`${cell} text-[10px] text-ink-muted`}
                style={{ gridRow: 1, gridColumn: 1 }}
              >
                {t.floor(a + 1)}
              </div>
              {[...Array(COLS).keys()].map((c) => (
                <div
                  key={c}
                  className={`h-7 border-l border-white/5 ${holidays.has(c) ? "bg-[repeating-linear-gradient(45deg,rgba(229,121,122,0.25)_0_4px,transparent_4px_8px)]" : ""}`}
                  style={{ gridRow: 1, gridColumn: c + 2 }}
                />
              ))}
              {snapshot &&
                snapshot
                  .filter(([ba]) => ba === a)
                  .map(([, k, s, e]) => (
                    <div
                      key={`s${k}`}
                      className="my-1 rounded border border-dashed border-white/50"
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
            className="grid pt-1 text-center text-[9px] text-ink-muted"
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
          {!snapshot && <li className="text-ink-muted">{t.hint}</li>}
          {snapshot && !late.length && (
            <li className="text-[#7fd1a8]">{t.onTime}</li>
          )}
          {late.slice(0, 3).map(([a, k, n]) => (
            <li key={`${a}-${k}`} className="text-[#f5c451]">
              {t.late(`${t.trades[TRADES[k][0]]} · ${t.floor(a + 1)}`, n)}
            </li>
          ))}
          {late.length > 3 && (
            <li className="text-ink-muted">{t.more(late.length - 3)}</li>
          )}
        </ul>
        <span className="flex gap-3 text-[10px] text-ink-muted">
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-4 rounded-sm border border-dashed border-white/50" />
            {t.legend[0]}
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-4 rounded-sm bg-[#e5797a]/40" />
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
      <H>{t.ideaH}</H>
      <p className="mb-4">{t.idea}</p>
      <Schedule />
      <H>{t.builtH}</H>
      <p className="mb-2">{t.built}</p>
      <Bullets items={t.bullets} />
      <H>{t.endH}</H>
      <Snippet file="snapshot_delays.py" language="python" code={END} />
      <H>{t.testH}</H>
      <Snippet
        file="snapshot_calendar.feature"
        language="gherkin"
        code={SCENARIO}
      />
    </Article>
  );
};

export default Builder;
