import React, { useState } from "react";
import { Article, Bullets, H, Intro, Pick, Snippet, useCopy } from "./ui";

// 011h Procurement. The real code is closed source, so the snippets are
// rewritten and simplified for this page, and every name and price below is
// made up.

const LOCK = `async def next_sequence(self, session, purchase_order_id: UUID) -> int:
    # Two uploads to the same order would both read max + 1 and collide.
    # Locking the order's row deadlocked against ordinary order updates, so
    # take a transaction-scoped advisory lock on the order's id instead: it
    # serialises the numbering without touching the row.
    await session.execute(
        text("SELECT pg_advisory_xact_lock(:key)"),
        {"key": lock_key(purchase_order_id)},
    )
    current = await session.scalar(
        select(func.max(Attachment.sequence))
        .where(Attachment.purchase_order_id == purchase_order_id)
    )
    return (current or 0) + 1`;

const MATCH = `def match(quote, budget, llm, threshold=0.8) -> list[Match]:
    open_lines = {line.code: line for line in budget}
    results, leftovers = [], []

    # 1. exact codes first: free and certain
    for q in quote:
        line = open_lines.pop(q.code, None)
        if line:
            results.append(Match(q, line, "matched", 1.0))
        else:
            leftovers.append(q)

    # 2. the LLM proposes pairs for the rest; best first, and each budget
    #    line can only be claimed once. Below the threshold a person decides.
    taken = set()
    proposals = llm.propose(leftovers, list(open_lines.values()))
    for q, code, confidence in sorted(proposals, key=lambda p: -p[2]):
        if q.id in taken or code not in open_lines:
            continue
        status = "matched" if confidence >= threshold else "review"
        results.append(Match(q, open_lines.pop(code), status, confidence))
        taken.add(q.id)

    results += [Match(q, None, "unmatched", 0) for q in leftovers if q.id not in taken]
    return results`;

const SCENARIO = `Scenario: Taking a validated comparative back to draft
  Given a purchase order in status "VALIDATED" with a comparative
  When the buyer asks for "DRAFT" with the reason "Wrong provider awarded"
  Then the response status is 204
  And the purchase order is stored with status "PENDING_DRAFT"
  And an action request of type "DRAFT" is stored
  And the action log records "COMPARATIVE_DRAFT_REQUESTED"
  And an email is sent to the approver`;

// --- the walk-through -------------------------------------------------------

const LINES = [
  ["05.01", 0, "ud", 48, 410],
  ["05.02", 1, "ud", 24, 690],
  ["05.03", 2, "m²", 96, 58.5],
  ["05.04", 3, "m", 72, 32],
];
const PROVIDERS = [
  ["North Windows", [398, 702, 55, 30.5]],
  ["Delta Aluminium", [421, 668, 52.4, 33]],
  ["Levante PVC", [389, 685, 57.9, 29]],
];
const GOAL = 5; // % under the estimate
const eur = (n) =>
  `€${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const estimate = LINES.reduce((s, l) => s + l[3] * l[4], 0);
const totals = PROVIDERS.map(([, p]) =>
  LINES.reduce((s, l, i) => s + l[3] * p[i], 0),
);
const bestTotal = totals.indexOf(Math.min(...totals));

// [budget line, status, why]: quote text and reasons are in COPY.quote
const QUOTE = [
  ["05.01", "matched"],
  ["05.02", "matched"],
  ["05.03", "review"],
  [null, "unmatched"],
];

const COPY = {
  en: {
    stats: [
      ["~15", "bounded contexts"],
      ["Hexagonal", "architecture"],
      ["Offer → payment", "in one module"],
    ],
    lines: [
      "PVC window 120×140",
      "Balcony door 80×210",
      "Aluminium roller shutter",
      "Stone window sill",
    ],
    th: ["Line", "Estimate"],
    total: "Total",
    vs: "vs estimate",
    green: (goal, max) =>
      `Green is the best price per line. Savings goal: ${goal}% under the estimate, ${max} or less.`,
    importP:
      "Levante PVC sent their quote as a PDF. Each of its lines is matched to the budget:",
    quote: [
      ["PVC window 1200x1400, white", "same code"],
      ["Balcony door 0.8 x 2.1 m", "AI 0.91"],
      ["Roller shutter, extruded alu.", "AI 0.72"],
      ["Delivery and unloading", "no budget line"],
    ],
    status: { matched: "matched", review: "review", unmatched: "unmatched" },
    confirm: "Confirm",
    chain: ["Site manager", "Procurement lead", "Finance"],
    states: ["Open", "Pending validation", "Validated"],
    best: "Best total:",
    awardP:
      "Award it and send it for validation; who has to approve depends on the amount.",
    statusL: "Status:",
    award: "Award and send to validation",
    accepted: "accepted",
    accept: "Accept",
    reject: "Reject",
    waiting: "waiting",
    rejectNote: "A rejection sends the order back to Open.",
    sign: [
      "Contract built from the templates: conditions and annexes, as a PDF",
      "Sent for e-signature",
      "Signed by both sides",
      "ContractSigned event published for the other services",
    ],
    next: "Next",
    generate: "Generate the contract",
    signed: [
      "Signed",
      "From here the order lives on: extensions, advance payments, monthly proformas, and closing each accounting period.",
    ],
    steps: ["1 · Compare", "2 · Import a quote", "3 · Award", "4 · Contract"],
    project: "Riverside, 24 homes · Exterior joinery",
    title: "Procurement for construction",
    pitch:
      "The service behind 011h Procurement: comparing providers’ offers for each part of a building’s budget, approving the award, and carrying the contract from signature to the last payment.",
    problemH: "The problem",
    problem:
      "A building’s budget is split into dozens of purchase groups, from windows to plumbing, and each one is bought by comparing offers from several providers. The module carries that whole path inside the platform, with the money adding up and an audit trail at every step.",
    walkH: "Walk a purchase group through it",
    walk: "Made-up project, providers, prices and approvers:",
    builtH: "What I built",
    built:
      "Before moving to Builder, I was the service’s main contributor, across most of its domains:",
    bullets: [
      [
        "The comparative.",
        "Providers, offers per line, the best price, the difference from the estimate and the savings goal.",
      ],
      [
        "Approvals.",
        "The validation chain, accept and reject with notifications, and taking a validated order back to draft without leaving a live signature request behind.",
      ],
      [
        "Contracts.",
        "Documents assembled from templates, with ordered annexes, turned into PDFs, signed electronically and announced to the rest of the platform as events.",
      ],
      [
        "Finance.",
        "Extensions, advance payments, monthly proformas and accounting periods, with Excel in and out.",
      ],
      [
        "The AI price import.",
        "A provider’s PDF or Excel quote read into the comparative, with a person confirming anything the matcher isn’t sure about.",
      ],
      [
        "The unglamorous part.",
        "Decimal money with consistent rounding, database locks against races, connection pool hygiene.",
      ],
    ],
    howH: "How it’s built",
    how: "Domain-driven design with a hexagonal architecture: about fifteen bounded contexts, each with its domain (entities, value objects like Price and Status, repository ports), one use case per class, and adapters for Postgres, object storage, the LLM, documents and RabbitMQ. Versioned APIs with their OpenAPI contracts checked in CI, and integration tests written as Gherkin scenarios against a real database.",
    matchH: "Matching a quote to the budget",
    lockH: "Numbering without deadlocks",
    testH: "Tests that read like the spec",
  },
  es: {
    stats: [
      ["~15", "contextos delimitados"],
      ["Hexagonal", "arquitectura"],
      ["Oferta → pago", "en un módulo"],
    ],
    lines: [
      "Ventana de PVC 120×140",
      "Puerta balconera 80×210",
      "Persiana de aluminio",
      "Vierteaguas de piedra",
    ],
    th: ["Partida", "Estimado"],
    total: "Total",
    vs: "vs estimado",
    green: (goal, max) =>
      `En verde, el mejor precio de cada partida. Objetivo de ahorro: un ${goal}% por debajo del estimado, ${max} o menos.`,
    importP:
      "Levante PVC envió su presupuesto en PDF. Cada una de sus líneas se cruza con el presupuesto de obra:",
    quote: [
      ["Ventana PVC 1200x1400, blanca", "mismo código"],
      ["Puerta balconera 0,8 x 2,1 m", "IA 0,91"],
      ["Persiana, alu. extruido", "IA 0,72"],
      ["Transporte y descarga", "sin partida"],
    ],
    status: {
      matched: "emparejada",
      review: "revisar",
      unmatched: "sin pareja",
    },
    confirm: "Confirmar",
    chain: ["Jefe de obra", "Responsable de compras", "Finanzas"],
    states: ["Abierta", "Pendiente de validación", "Validada"],
    best: "Mejor total:",
    awardP:
      "Adjudícala y envíala a validación; quién tiene que aprobar depende del importe.",
    statusL: "Estado:",
    award: "Adjudicar y enviar a validación",
    accepted: "aceptado",
    accept: "Aceptar",
    reject: "Rechazar",
    waiting: "en espera",
    rejectNote: "Un rechazo devuelve el pedido a Abierta.",
    sign: [
      "Contrato generado a partir de las plantillas: condiciones y anexos, en PDF",
      "Enviado a firma electrónica",
      "Firmado por ambas partes",
      "Evento ContractSigned publicado para los demás servicios",
    ],
    next: "Siguiente",
    generate: "Generar el contrato",
    signed: [
      "Firmado",
      "A partir de aquí el pedido sigue vivo: ampliaciones, anticipos, proformas mensuales y el cierre de cada periodo contable.",
    ],
    steps: [
      "1 · Comparar",
      "2 · Importar un presupuesto",
      "3 · Adjudicar",
      "4 · Contrato",
    ],
    project: "Riverside, 24 viviendas · Carpintería exterior",
    title: "Compras para la construcción",
    pitch:
      "El servicio detrás de 011h Procurement: comparar las ofertas de los proveedores para cada parte del presupuesto de un edificio, aprobar la adjudicación y llevar el contrato desde la firma hasta el último pago.",
    problemH: "El problema",
    problem:
      "El presupuesto de un edificio se divide en decenas de grupos de compra, de las ventanas a la fontanería, y cada uno se compra comparando ofertas de varios proveedores. El módulo lleva todo ese camino dentro de la plataforma, con las cuentas cuadrando y un registro de auditoría en cada paso.",
    walkH: "Lleva un grupo de compra de principio a fin",
    walk: "Proyecto, proveedores, precios y aprobadores inventados:",
    builtH: "Lo que construí",
    built:
      "Antes de pasar a Builder, fui el principal contribuidor del servicio, en la mayoría de sus dominios:",
    bullets: [
      [
        "El comparativo.",
        "Proveedores, ofertas por partida, el mejor precio, la diferencia con el estimado y el objetivo de ahorro.",
      ],
      [
        "Aprobaciones.",
        "La cadena de validación, aceptar y rechazar con notificaciones, y devolver un pedido validado a borrador sin dejar una solicitud de firma viva.",
      ],
      [
        "Contratos.",
        "Documentos montados a partir de plantillas, con anexos ordenados, convertidos a PDF, firmados electrónicamente y anunciados al resto de la plataforma como eventos.",
      ],
      [
        "Finanzas.",
        "Ampliaciones, anticipos, proformas mensuales y periodos contables, con Excel de entrada y salida.",
      ],
      [
        "La importación de precios con IA.",
        "El presupuesto de un proveedor, en PDF o Excel, volcado en el comparativo, con una persona confirmando lo que el emparejador no tiene claro.",
      ],
      [
        "La parte menos vistosa.",
        "Dinero en Decimal con redondeo coherente, bloqueos de base de datos contra condiciones de carrera e higiene del pool de conexiones.",
      ],
    ],
    howH: "Cómo está hecho",
    how: "Diseño guiado por el dominio con arquitectura hexagonal: unos quince bounded contexts, cada uno con su dominio (entidades, value objects como Price y Status, puertos de repositorio), un caso de uso por clase, y adaptadores para Postgres, almacenamiento de objetos, el LLM, documentos y RabbitMQ. APIs versionadas con sus contratos OpenAPI comprobados en CI, y tests de integración escritos como escenarios Gherkin contra una base de datos real.",
    matchH: "Emparejar un presupuesto con la obra",
    lockH: "Numerar sin interbloqueos",
    testH: "Tests que se leen como la especificación",
  },
  ca: {
    stats: [
      ["~15", "contextos delimitats"],
      ["Hexagonal", "arquitectura"],
      ["Oferta → pagament", "en un mòdul"],
    ],
    lines: [
      "Finestra de PVC 120×140",
      "Porta balconera 80×210",
      "Persiana d’alumini",
      "Ampit de pedra",
    ],
    th: ["Partida", "Estimat"],
    total: "Total",
    vs: "vs estimat",
    green: (goal, max) =>
      `En verd, el millor preu de cada partida. Objectiu d’estalvi: un ${goal}% per sota de l’estimat, ${max} o menys.`,
    importP:
      "Levante PVC va enviar el seu pressupost en PDF. Cadascuna de les seves línies es creua amb el pressupost d’obra:",
    quote: [
      ["Finestra PVC 1200x1400, blanca", "mateix codi"],
      ["Porta balconera 0,8 x 2,1 m", "IA 0,91"],
      ["Persiana, alu. extrudit", "IA 0,72"],
      ["Transport i descàrrega", "sense partida"],
    ],
    status: {
      matched: "aparellada",
      review: "revisar",
      unmatched: "sense parella",
    },
    confirm: "Confirma",
    chain: ["Cap d’obra", "Responsable de compres", "Finances"],
    states: ["Oberta", "Pendent de validació", "Validada"],
    best: "Millor total:",
    awardP:
      "Adjudica-la i envia-la a validació; qui l’ha d’aprovar depèn de l’import.",
    statusL: "Estat:",
    award: "Adjudica i envia a validació",
    accepted: "acceptat",
    accept: "Accepta",
    reject: "Rebutja",
    waiting: "en espera",
    rejectNote: "Un rebuig torna la comanda a Oberta.",
    sign: [
      "Contracte generat a partir de les plantilles: condicions i annexos, en PDF",
      "Enviat a signatura electrònica",
      "Signat per totes dues parts",
      "Esdeveniment ContractSigned publicat per als altres serveis",
    ],
    next: "Següent",
    generate: "Genera el contracte",
    signed: [
      "Signat",
      "A partir d’aquí la comanda continua viva: ampliacions, bestretes, proformes mensuals i el tancament de cada període comptable.",
    ],
    steps: [
      "1 · Compara",
      "2 · Importa un pressupost",
      "3 · Adjudica",
      "4 · Contracte",
    ],
    project: "Riverside, 24 habitatges · Fusteria exterior",
    title: "Compres per a la construcció",
    pitch:
      "El servei darrere de 011h Procurement: comparar les ofertes dels proveïdors per a cada part del pressupost d’un edifici, aprovar l’adjudicació i portar el contracte des de la signatura fins a l’últim pagament.",
    problemH: "El problema",
    problem:
      "El pressupost d’un edifici es divideix en desenes de grups de compra, de les finestres a la fontaneria, i cadascun es compra comparant ofertes de diversos proveïdors. El mòdul porta tot aquest camí dins de la plataforma, amb els comptes quadrant i un registre d’auditoria a cada pas.",
    walkH: "Porta un grup de compra de cap a peus",
    walk: "Projecte, proveïdors, preus i aprovadors inventats:",
    builtH: "El que vaig construir",
    built:
      "Abans de passar a Builder, vaig ser el principal contribuïdor del servei, en la majoria dels seus dominis:",
    bullets: [
      [
        "El comparatiu.",
        "Proveïdors, ofertes per partida, el millor preu, la diferència amb l’estimat i l’objectiu d’estalvi.",
      ],
      [
        "Aprovacions.",
        "La cadena de validació, acceptar i rebutjar amb notificacions, i tornar una comanda validada a esborrany sense deixar una sol·licitud de signatura viva.",
      ],
      [
        "Contractes.",
        "Documents muntats a partir de plantilles, amb annexos ordenats, convertits a PDF, signats electrònicament i anunciats a la resta de la plataforma com a esdeveniments.",
      ],
      [
        "Finances.",
        "Ampliacions, bestretes, proformes mensuals i períodes comptables, amb Excel d’entrada i de sortida.",
      ],
      [
        "La importació de preus amb IA.",
        "El pressupost d’un proveïdor, en PDF o Excel, bolcat al comparatiu, amb una persona confirmant el que l’aparellador no té clar.",
      ],
      [
        "La part menys vistosa.",
        "Diners en Decimal amb un arrodoniment coherent, bloquejos de base de dades contra condicions de cursa i higiene del pool de connexions.",
      ],
    ],
    howH: "Com està fet",
    how: "Disseny guiat pel domini amb arquitectura hexagonal: uns quinze bounded contexts, cadascun amb el seu domini (entitats, value objects com Price i Status, ports de repositori), un cas d’ús per classe, i adaptadors per a Postgres, emmagatzematge d’objectes, l’LLM, documents i RabbitMQ. APIs versionades amb els seus contractes OpenAPI comprovats a CI, i tests d’integració escrits com a escenaris Gherkin contra una base de dades real.",
    matchH: "Aparellar un pressupost amb l’obra",
    lockH: "Numerar sense interbloquejos",
    testH: "Tests que es llegeixen com l’especificació",
  },
};

const TONE = {
  matched: "bg-[#7fd1a8]/20 text-[#7fd1a8]",
  review: "bg-[#f5c451]/20 text-[#f5c451]",
  unmatched: "bg-white/10 text-ink-muted",
};

const Btn = (props) => (
  <button
    type="button"
    className="rounded-full bg-lilac/80 px-3 py-1 text-[12px] font-semibold text-white hover:bg-lilac disabled:opacity-40"
    {...props}
  />
);

export const Compare = () => {
  const t = useCopy(COPY);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-[11px]">
        <thead className="text-left text-ink-muted">
          <tr>
            <th className="py-1 font-normal">{t.th[0]}</th>
            <th className="py-1 text-right font-normal">{t.th[1]}</th>
            {PROVIDERS.map(([name]) => (
              <th key={name} className="py-1 text-right font-normal">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-ink-text">
          {LINES.map(([code, text, unit, qty, cost], i) => {
            const prices = PROVIDERS.map(([, p]) => p[i]);
            const best = Math.min(...prices);
            return (
              <tr key={code} className="border-t border-[#2e313a]">
                <td className="py-1.5 pr-2">
                  <span className="text-ink-muted">{code}</span> {t.lines[text]}
                  <span className="text-ink-muted">
                    {" "}
                    · {qty} {unit}
                  </span>
                </td>
                <td className="py-1.5 text-right text-ink-muted">
                  {eur(cost)}
                </td>
                {prices.map((p, j) => (
                  <td
                    key={j}
                    className={`py-1.5 text-right ${p === best ? "font-semibold text-[#7fd1a8]" : ""}`}
                  >
                    {eur(p)}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr className="border-t border-[#3a3f4c] font-semibold">
            <td className="py-1.5">{t.total}</td>
            <td className="py-1.5 text-right text-ink-muted">
              {eur(estimate)}
            </td>
            {totals.map((sum, j) => (
              <td
                key={j}
                className={`py-1.5 text-right ${j === bestTotal ? "text-[#7fd1a8]" : ""}`}
              >
                {eur(sum)}
                <div className="text-[9px] font-normal text-ink-muted">
                  {(((sum - estimate) / estimate) * 100).toFixed(1)}% {t.vs}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-ink-muted">
        {t.green(GOAL, eur(estimate * (1 - GOAL / 100)))}
      </p>
    </div>
  );
};

const Import = () => {
  const t = useCopy(COPY);
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-ink-muted">{t.importP}</p>
      {QUOTE.map(([code, status], i) => {
        const s = status === "review" && ok ? "matched" : status;
        const [text, why] = t.quote[i];
        return (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded border border-[#2e313a] bg-[#262932] px-2.5 py-1.5 text-[11px]"
          >
            <span className="min-w-0 flex-1 text-ink-text">“{text}”</span>
            <span className="text-ink-muted">→ {code || "—"}</span>
            <span className="text-[10px] text-ink-muted">{why}</span>
            <span
              className={`rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest ${TONE[s]}`}
            >
              {t.status[s]}
            </span>
            {status === "review" && !ok && (
              <Btn onClick={() => setOk(true)}>{t.confirm}</Btn>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Award = () => {
  const t = useCopy(COPY);
  const [sent, setSent] = useState(false);
  const [yes, setYes] = useState(0);
  const status = t.states[!sent ? 0 : yes === t.chain.length ? 2 : 1];
  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <p className="text-ink-muted">
        {t.best} <b className="text-ink-text">{PROVIDERS[bestTotal][0]}</b>,{" "}
        {eur(totals[bestTotal])}. {t.awardP}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-ink-muted">{t.statusL}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-ink-text">
          {status}
        </span>
      </div>
      {!sent ? (
        <div>
          <Btn onClick={() => setSent(true)}>{t.award}</Btn>
        </div>
      ) : (
        <ol className="flex flex-col gap-1">
          {t.chain.map((role, i) => (
            <li
              key={role}
              className="flex items-center gap-2 rounded border border-[#2e313a] bg-[#262932] px-2.5 py-1.5"
            >
              <span className="flex-1 text-ink-text">{role}</span>
              {i < yes ? (
                <span className="text-[#7fd1a8]">{t.accepted}</span>
              ) : i === yes ? (
                <>
                  <Btn onClick={() => setYes(yes + 1)}>{t.accept}</Btn>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setYes(0);
                    }}
                    className="rounded-full px-2 py-1 text-ink-muted hover:bg-white/10"
                  >
                    {t.reject}
                  </button>
                </>
              ) : (
                <span className="text-ink-muted">{t.waiting}</span>
              )}
            </li>
          ))}
        </ol>
      )}
      {sent && yes === 0 && <p className="text-ink-muted">{t.rejectNote}</p>}
    </div>
  );
};

const Contract = () => {
  const t = useCopy(COPY);
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col gap-1.5 text-[11px]">
      {t.sign.slice(0, n).map((s) => (
        <div
          key={s}
          className="flex items-center gap-2 text-ink-text motion-safe:animate-[app-open_0.3s_ease-out]"
        >
          <span className="text-[#7fd1a8]">✓</span>
          {s}
        </div>
      ))}
      {n < t.sign.length ? (
        <div>
          <Btn onClick={() => setN(n + 1)}>{n ? t.next : t.generate}</Btn>
        </div>
      ) : (
        <p className="mt-1 text-ink-muted">
          {t.statusL} <b className="text-ink-text">{t.signed[0]}</b>.{" "}
          {t.signed[1]}
        </p>
      )}
    </div>
  );
};

const STEPS = {
  compare: Compare,
  import: Import,
  award: Award,
  contract: Contract,
};

const Walkthrough = () => {
  const t = useCopy(COPY);
  const [step, setStep] = useState("compare");
  const Body = STEPS[step];
  return (
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
      <div className="mb-1 px-1 text-[11px] text-ink-muted">{t.project}</div>
      <div className="mb-3 flex flex-wrap items-center gap-1 px-1 text-[11px] text-ink-muted">
        <Pick
          label=""
          options={Object.keys(STEPS).map((k, i) => [k, t.steps[i]])}
          value={step}
          onChange={setStep}
        />
      </div>
      <div className="min-h-[190px] rounded-md border border-[#2e313a] bg-[#1e2026] p-3">
        <Body />
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "SQLAlchemy",
  "Alembic",
  "RabbitMQ",
  "protobuf",
  "Behave",
  "LLMs",
];

const Procurement = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        stats={t.stats}
        kicker="011h · 2025–2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <H>{t.problemH}</H>
      <p>{t.problem}</p>
      <H>{t.walkH}</H>
      <p className="mb-4">{t.walk}</p>
      <Walkthrough />
      <H>{t.builtH}</H>
      <p className="mb-2">{t.built}</p>
      <Bullets items={t.bullets} />
      <H>{t.howH}</H>
      <p>{t.how}</p>
      <H>{t.matchH}</H>
      <Snippet file="line_matcher.py" language="python" code={MATCH} />
      <H>{t.lockH}</H>
      <Snippet file="attachments_repository.py" language="python" code={LOCK} />
      <H>{t.testH}</H>
      <Snippet
        file="comparative_action_request.feature"
        language="gherkin"
        code={SCENARIO}
      />
    </Article>
  );
};

export default Procurement;
