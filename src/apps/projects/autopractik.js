import React, { useState } from "react";
import {
  Article,
  H,
  Intro,
  Pick,
  Prose,
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
    built: [
      "Each school runs its staff, teachers’ timetables, vehicles and holidays from the back office, and students book practical lessons into the free slots. They pay with lesson packs or a balance they top up by card through Redsys, PayPal, transfer or cash, and the platform does the invoices and refunds. It also keeps track of theory and practical exams, who’s sitting them and how they did, and has a small CRM for selling it to new schools.",
      "All the schools share one Django backend and one Postgres database. A middleware works out which school a request belongs to from who’s logged in, so every query stays inside that school, and Celery sends the push notifications and email. The phone app is Cordova and Backbone, and the same app shipped under three names: Autopractik, Cocheescuela and Mastervial.",
    ],
    title: "Autopractik, a platform for driving schools",
    pitch:
      "A web platform where driving schools run their whole business, and their students book and pay for driving lessons from a phone app. I built it with a couple of colleagues, and we all did a bit of everything: the website, the CRM and the companion app for teachers and students.",
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
    builtH: "What’s in it",
    baseH: "The same base, other clients",
    base: "Autopractik sat on the agency’s own Django and Backbone base, a configurable back office plus a phone app skeleton. The same base ran Sanident, work orders between dental clinics and their lab, and Rapidisegur, insurance repair claims with an app where technicians log visits, take photos and collect the customer’s signature.",
  },
  es: {
    built: [
      "Cada autoescuela gestiona desde el back office su personal, los horarios de los profesores, los vehículos y los festivos, y los alumnos reservan prácticas en los huecos libres. Pagan con bonos de prácticas o con un saldo que recargan con tarjeta por Redsys, PayPal, transferencia o en efectivo, y la plataforma hace las facturas y las devoluciones. También lleva los exámenes teóricos y prácticos, quién se presenta y cómo le ha ido, y tiene un pequeño CRM para vendérsela a nuevas autoescuelas.",
      "Todas las autoescuelas comparten un mismo backend en Django y una sola base de datos Postgres. Un middleware deduce a qué autoescuela pertenece cada petición según quién ha iniciado sesión, así que cada consulta se queda dentro de esa autoescuela, y Celery envía las notificaciones push y los correos. La app es Cordova y Backbone, y la misma app se publicó con tres nombres: Autopractik, Cocheescuela y Mastervial.",
    ],
    title: "Autopractik, una plataforma para autoescuelas",
    pitch:
      "Una plataforma web donde las autoescuelas llevan todo el negocio y sus alumnos reservan y pagan las prácticas desde una app. La construí con un par de personas más del equipo, y hacíamos un poco de todo: la web, el CRM y la app para profesores y alumnos.",
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
    builtH: "Qué incluye",
    baseH: "La misma base, otros clientes",
    base: "Autopractik se apoyaba en la base propia de la agencia en Django y Backbone: un back office configurable y el esqueleto de una app. Sobre la misma base funcionaban Sanident, órdenes de trabajo entre clínicas dentales y su laboratorio, y Rapidisegur, siniestros de reparaciones para aseguradoras con una app donde los operarios registran visitas, hacen fotos y recogen la firma del cliente.",
  },
  ca: {
    built: [
      "Cada autoescola gestiona des del back office el seu personal, els horaris dels professors, els vehicles i els festius, i els alumnes reserven pràctiques als forats lliures. Paguen amb bons de pràctiques o amb un saldo que recarreguen amb targeta per Redsys, PayPal, transferència o en efectiu, i la plataforma fa les factures i les devolucions. També porta els exàmens teòrics i pràctics, qui s’hi presenta i com li ha anat, i té un petit CRM per vendre-la a noves autoescoles.",
      "Totes les autoescoles comparteixen un mateix backend en Django i una sola base de dades Postgres. Un middleware dedueix a quina autoescola pertany cada petició segons qui ha iniciat sessió, així que cada consulta es queda dins d’aquella autoescola, i Celery envia les notificacions push i els correus. L’app és Cordova i Backbone, i la mateixa app es va publicar amb tres noms: Autopractik, Cocheescuela i Mastervial.",
    ],
    title: "Autopractik, una plataforma per a autoescoles",
    pitch:
      "Una plataforma web on les autoescoles porten tot el negoci i els seus alumnes reserven i paguen les pràctiques des d’una app. La vaig construir amb un parell de persones més de l’equip, i fèiem una mica de tot: la web, el CRM i l’app per a professors i alumnes.",
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
    builtH: "Què hi ha",
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
        stack={STACK}
      />
      <H>{t.ruleH}</H>
      <p className="mb-4">{t.rule}</p>
      <Cancel />
      <div className="mt-4">
        <Snippet file="lessons.py" language="python" code={REFUND} />
      </div>
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.baseH}</H>
      <p>{t.base}</p>
    </Article>
  );
};

export default Autopractik;
