import React, { useState } from "react";
import {
  ArrowDefs,
  Article,
  Box,
  Bullets,
  Edge,
  H,
  Intro,
  Pick,
  Snippet,
  useCopy,
} from "./ui";

// Autopractik, the driving-school platform at Ancora Dual. Closed source, so
// the snippet is rewritten from scratch; the school's rules, prices and
// people in the mock are made up.

const REFUND = `# A school sets its own cancellation rules: cancel more than N hours before
# the lesson and get P% back. The furthest-out rule you're past wins.
def refund(lesson, rules, now):
    hours_left = (lesson.starts_at - now).total_seconds() / 3600
    best = None
    for rule in sorted(rules, key=lambda r: r.hours):
        if hours_left > rule.hours:
            best = rule
    if lesson.from_pack:
        # a lesson paid with a pack goes back to the pack, or doesn't
        return Refund(lesson_back=bool(best and best.returns_pack))
    percent = best.percent if best else 0
    return Refund(amount=lesson.price * percent / 100)  # credited to the balance`;

// the made-up school's rules: [more than N hours before, % back, pack lesson back]
const RULES = [
  [48, 100, true],
  [24, 50, true],
  [6, 25, false],
];
const PRICE = 32;

const COPY = {
  en: {
    stats: [
      ["3", "branded apps, one codebase"],
      ["4", "kinds of user"],
      ["5", "ways to pay"],
    ],
    title: "Autopractik, a platform for driving schools",
    pitch:
      "A web platform where driving schools run their whole business, and their students book and pay for driving lessons from a phone app. I had a main role in building it.",
    ruleH: "Try a cancellation",
    rule: "Every school decides how much a student gets back for cancelling late. A made-up school’s rules:",
    rules: (h, p, pack) =>
      `More than ${h} h before: ${p}% back${pack ? ", pack lessons return to the pack" : ""}`,
    else: "Later than that: nothing back",
    hours: "Cancel",
    hoursBefore: (h) => `${h} h before the lesson`,
    paid: "Paid lesson · €32",
    pack: "From a pack",
    back: (n) => `€${n} back to the student’s balance`,
    none: "Nothing back",
    packBack: "The lesson goes back into the pack",
    packLost: "The pack lesson is spent",
    mapH: "One backend, many schools",
    map: "Every school, its staff, teachers and students share one Django backend. A middleware works out which school each request belongs to from who’s logged in, so every query stays inside that school.",
    nodes: {
      manager: ["Manager", "schools + staff"],
      web: ["Web", "students"],
      apps: ["Phone apps", "3 brands"],
      api: ["Django", "which school?"],
      db: ["Postgres", "one database"],
      pay: ["Payments", "Redsys · PayPal"],
      jobs: ["Celery", "push · email"],
    },
    aria: "The manager, the website and three branded phone apps all talk to one Django backend, which works out the school for each request and stores everything in one Postgres database. Payments go through Redsys and PayPal; Celery sends push notifications and email.",
    builtH: "What’s in it",
    bullets: [
      [
        "Booking.",
        "Teachers’ timetables, vehicles and holidays per school; students book practical lessons into the free slots.",
      ],
      [
        "Money.",
        "Lesson packs and a balance per student, topped up by card through Redsys, PayPal, transfer or cash, with invoices and refunds.",
      ],
      [
        "Exams.",
        "Theory and practical exams, who’s sitting them and how they did.",
      ],
      [
        "Phone apps.",
        "Cordova and Backbone, with push notifications. The same app shipped as Autopractik, Cocheescuela and Mastervial.",
      ],
      ["A CRM.", "Leads and versions for selling the platform to new schools."],
    ],
    codeH: "Working out the refund",
    baseH: "The same base, other clients",
    base: "Autopractik sat on the agency’s own Django and Backbone base, a configurable back office plus a phone app skeleton. The same base ran Sanident, work orders between dental clinics and their lab, and Rapidisegur, insurance repair claims with an app where technicians log visits, take photos and collect the customer’s signature.",
  },
  es: {
    stats: [
      ["3", "apps de marca, un solo código"],
      ["4", "tipos de usuario"],
      ["5", "formas de pago"],
    ],
    title: "Autopractik, una plataforma para autoescuelas",
    pitch:
      "Una plataforma web donde las autoescuelas llevan todo el negocio y sus alumnos reservan y pagan las prácticas desde una app. Tuve un papel principal en su desarrollo.",
    ruleH: "Prueba a cancelar",
    rule: "Cada autoescuela decide cuánto recupera un alumno si cancela tarde. Las normas de una autoescuela inventada:",
    rules: (h, p, pack) =>
      `Más de ${h} h antes: ${p}% de vuelta${pack ? ", las prácticas de bono vuelven al bono" : ""}`,
    else: "Más tarde: nada de vuelta",
    hours: "Cancelar",
    hoursBefore: (h) => `${h} h antes de la práctica`,
    paid: "Práctica pagada · 32 €",
    pack: "De un bono",
    back: (n) => `${n} € de vuelta al saldo del alumno`,
    none: "Nada de vuelta",
    packBack: "La práctica vuelve al bono",
    packLost: "La práctica del bono se pierde",
    mapH: "Un backend, muchas autoescuelas",
    map: "Cada autoescuela, su personal, sus profesores y sus alumnos comparten un mismo backend en Django. Un middleware deduce a qué autoescuela pertenece cada petición según quién ha iniciado sesión, así que cada consulta se queda dentro de esa autoescuela.",
    nodes: {
      manager: ["Gestor", "autoescuelas + personal"],
      web: ["Web", "alumnos"],
      apps: ["Apps", "3 marcas"],
      api: ["Django", "¿qué autoescuela?"],
      db: ["Postgres", "una base de datos"],
      pay: ["Pagos", "Redsys · PayPal"],
      jobs: ["Celery", "push · email"],
    },
    aria: "El gestor, la web y tres apps de marca hablan con un único backend en Django, que deduce la autoescuela de cada petición y lo guarda todo en una sola base de datos Postgres. Los pagos pasan por Redsys y PayPal; Celery envía notificaciones push y emails.",
    builtH: "Qué incluye",
    bullets: [
      [
        "Reservas.",
        "Horarios de los profesores, vehículos y festivos de cada autoescuela; los alumnos reservan prácticas en los huecos libres.",
      ],
      [
        "Dinero.",
        "Bonos de prácticas y un saldo por alumno, que se recarga con tarjeta por Redsys, PayPal, transferencia o en efectivo, con facturas y devoluciones.",
      ],
      [
        "Exámenes.",
        "Exámenes teóricos y prácticos, quién se presenta y cómo le ha ido.",
      ],
      [
        "Apps.",
        "Cordova y Backbone, con notificaciones push. La misma app se publicó como Autopractik, Cocheescuela y Mastervial.",
      ],
      [
        "Un CRM.",
        "Captaciones y versiones para vender la plataforma a nuevas autoescuelas.",
      ],
    ],
    codeH: "Calcular la devolución",
    baseH: "La misma base, otros clientes",
    base: "Autopractik se apoyaba en la base propia de la agencia en Django y Backbone: un back office configurable y el esqueleto de una app. Sobre la misma base funcionaban Sanident, órdenes de trabajo entre clínicas dentales y su laboratorio, y Rapidisegur, siniestros de reparaciones para aseguradoras con una app donde los operarios registran visitas, hacen fotos y recogen la firma del cliente.",
  },
  ca: {
    stats: [
      ["3", "apps de marca, un sol codi"],
      ["4", "tipus d’usuari"],
      ["5", "maneres de pagar"],
    ],
    title: "Autopractik, una plataforma per a autoescoles",
    pitch:
      "Una plataforma web on les autoescoles porten tot el negoci i els seus alumnes reserven i paguen les pràctiques des d’una app. Hi vaig tenir un paper principal.",
    ruleH: "Prova de cancel·lar",
    rule: "Cada autoescola decideix quant recupera un alumne si cancel·la tard. Les normes d’una autoescola inventada:",
    rules: (h, p, pack) =>
      `Més de ${h} h abans: ${p}% de tornada${pack ? ", les pràctiques de bo tornen al bo" : ""}`,
    else: "Més tard: res de tornada",
    hours: "Cancel·lar",
    hoursBefore: (h) => `${h} h abans de la pràctica`,
    paid: "Pràctica pagada · 32 €",
    pack: "D’un bo",
    back: (n) => `${n} € de tornada al saldo de l’alumne`,
    none: "Res de tornada",
    packBack: "La pràctica torna al bo",
    packLost: "La pràctica del bo es perd",
    mapH: "Un backend, moltes autoescoles",
    map: "Cada autoescola, el seu personal, els professors i els alumnes comparteixen un mateix backend en Django. Un middleware dedueix a quina autoescola pertany cada petició segons qui ha iniciat sessió, així que cada consulta es queda dins d’aquella autoescola.",
    nodes: {
      manager: ["Gestor", "autoescoles + personal"],
      web: ["Web", "alumnes"],
      apps: ["Apps", "3 marques"],
      api: ["Django", "quina autoescola?"],
      db: ["Postgres", "una base de dades"],
      pay: ["Pagaments", "Redsys · PayPal"],
      jobs: ["Celery", "push · email"],
    },
    aria: "El gestor, la web i tres apps de marca parlen amb un únic backend en Django, que dedueix l’autoescola de cada petició i ho desa tot en una sola base de dades Postgres. Els pagaments passen per Redsys i PayPal; Celery envia notificacions push i correus.",
    builtH: "Què hi ha",
    bullets: [
      [
        "Reserves.",
        "Horaris dels professors, vehicles i festius de cada autoescola; els alumnes reserven pràctiques als forats lliures.",
      ],
      [
        "Diners.",
        "Bons de pràctiques i un saldo per alumne, que es recarrega amb targeta per Redsys, PayPal, transferència o en efectiu, amb factures i devolucions.",
      ],
      [
        "Exàmens.",
        "Exàmens teòrics i pràctics, qui s’hi presenta i com li ha anat.",
      ],
      [
        "Apps.",
        "Cordova i Backbone, amb notificacions push. La mateixa app es va publicar com a Autopractik, Cocheescuela i Mastervial.",
      ],
      [
        "Un CRM.",
        "Captacions i versions per vendre la plataforma a noves autoescoles.",
      ],
    ],
    codeH: "Calcular la devolució",
    baseH: "La mateixa base, altres clients",
    base: "Autopractik s’aguantava sobre la base pròpia de l’agència en Django i Backbone: un back office configurable i l’esquelet d’una app. Sobre la mateixa base funcionaven Sanident, ordres de treball entre clíniques dentals i el seu laboratori, i Rapidisegur, sinistres de reparacions per a asseguradores amb una app on els operaris registren visites, fan fotos i recullen la signatura del client.",
  },
};

// the same rule as the snippet: the furthest-out threshold you're past wins
const ruleFor = (hours) => RULES.filter(([h]) => hours > h).at(0);

export const Cancel = () => {
  const t = useCopy(COPY);
  const [hours, setHours] = useState(30);
  const [kind, setKind] = useState("paid");
  const rule = ruleFor(hours);
  const [ok, text] =
    kind === "paid"
      ? rule
        ? [true, t.back(((PRICE * rule[1]) / 100).toFixed(2))]
        : [false, t.none]
      : rule?.[2]
        ? [true, t.packBack]
        : [false, t.packLost];

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-4 text-[13px]">
      <ul className="space-y-1 text-p-muted">
        {RULES.map(([h, p, pack]) => (
          <li
            key={h}
            className={rule?.[0] === h ? "font-semibold text-p-fg" : ""}
          >
            {t.rules(h, p, pack)}
          </li>
        ))}
        <li className={rule ? "" : "font-semibold text-p-fg"}>{t.else}</li>
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-p-muted">
        <Pick
          label=""
          options={[
            ["paid", t.paid],
            ["pack", t.pack],
          ]}
          value={kind}
          onChange={setKind}
        />
      </div>
      <label className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-p-muted">
        <span>{t.hours}</span>
        <input
          type="range"
          min="1"
          max="72"
          value={hours}
          onChange={(e) => setHours(+e.target.value)}
          className="w-48 accent-p-pop"
        />
        <span className="text-p-fg">{t.hoursBefore(hours)}</span>
      </label>
      <p
        className={`mt-4 rounded-md px-3 py-2 font-semibold ${ok ? "bg-p-ok/15 text-p-ok" : "bg-p-bad/15 text-p-bad"}`}
      >
        {text}
      </p>
    </figure>
  );
};

const Map = () => {
  const t = useCopy(COPY);
  const n = t.nodes;
  return (
    <figure className="overflow-x-auto rounded-lg border border-p-line bg-p-sunk p-3">
      <svg
        viewBox="0 0 760 240"
        role="img"
        aria-label={t.aria}
        className="min-w-[560px]"
      >
        <ArrowDefs />
        <Edge d="M180 44 H240 V106 H298" />
        <Edge d="M180 120 H298" />
        <Edge d="M180 196 H240 V134 H298" />
        <Edge d="M460 120 H558" />
        <Edge d="M380 92 V60 H558" dashed />
        <Edge d="M380 148 V180 H558" dashed />
        <Box x={20} y={20} w={160} {...lbl(n.manager)} />
        <Box x={20} y={96} w={160} {...lbl(n.web)} />
        <Box x={20} y={172} w={160} {...lbl(n.apps)} />
        <Box x={300} y={92} w={160} h={56} accent {...lbl(n.api)} />
        <Box x={560} y={36} w={180} {...lbl(n.pay)} />
        <Box x={560} y={96} w={180} {...lbl(n.db)} />
        <Box x={560} y={156} w={180} {...lbl(n.jobs)} />
      </svg>
    </figure>
  );
};
const lbl = ([label, sub]) => ({ label, sub });

const STACK = [
  "Django",
  "Backbone",
  "Cordova",
  "PostgreSQL",
  "Celery",
  "S3",
  "Redsys",
  "PayPal",
  "Firebase push",
];

const Autopractik = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="Ancora Dual · 2016–2018"
        title={t.title}
        pitch={t.pitch}
        stats={t.stats}
        stack={STACK}
      />
      <H>{t.ruleH}</H>
      <p className="mb-4">{t.rule}</p>
      <Cancel />
      <H>{t.mapH}</H>
      <p className="mb-4">{t.map}</p>
      <Map />
      <H>{t.builtH}</H>
      <Bullets items={t.bullets} />
      <H>{t.codeH}</H>
      <Snippet file="lessons.py" language="python" code={REFUND} />
      <H>{t.baseH}</H>
      <p>{t.base}</p>
    </Article>
  );
};

export default Autopractik;
