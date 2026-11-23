import React, { useState } from "react";
import { Article, H, Intro, Snippet, useCopy } from "./ui";

// The admin CLI and the provisioning factory. The real code is closed
// source, so the snippets are rewritten and simplified for this page.

const PIPE = `$ pep-user-get alice@example.com
address: alice@example.com
username: Alice
fpr: 4F2A 81C0 … 9C1E

# every command reads records like these on stdin, so they chain
$ pep-user-get alice@example.com | pep-key-export > alice.asc
$ pep-user-list | pep-set-trusted`;

const ARGS = `def arguments(self):
    """Arguments from the command line, or one set per record when another
    command is piped in, so commands chain like any Unix tool."""
    if sys.stdin.isatty():
        yield vars(self.parser.parse_args())
        return
    for record in rec.read(sys.stdin):  # GNU recutils format
        missing = [f for f in self.required if f not in record]
        if missing:
            raise PipeError(f"record lacks {', '.join(missing)}")
        yield record`;

const FACTORY = `def run_as(user, *command):
    # The engine reads HOME once, when it loads, so each identity runs in
    # its own process with HOME pointed at that user's own folder.
    env = {**os.environ, "HOME": str(HOMES / user.uid)}
    done = subprocess.run(["pep", *command], env=env, capture_output=True, text=True)
    if done.returncode:
        raise IdentityError(user.uid, done.stderr.strip())
    return done.stdout


def pretrust(new, old):
    # new×everyone + old×new, not everyone×everyone: a re-run only pays
    # for the people it adds
    pairs = [*product(new, new + old), *product(old, new)]
    with ProcessPoolExecutor(max_workers=args.processes) as pool:
        jobs = {pool.submit(trust, a, b): (a, b) for a, b in pairs if a != b}
        for job in as_completed(jobs):
            if job.exception():  # one bad user doesn't stop the run
                report.fail(*jobs[job], job.exception())`;

const COPY = {
  en: {
    aria: (o, n) =>
      `${o} people already provisioned and ${n} new ones. Every pair trusts each other; only the pairs involving someone new are done in this run.`,
    already: "Already in",
    fresh: "New people",
    run: ["This run:", "trust pairs"],
    scratch: (n) =>
      `From scratch it would be ${n}. Lilac lines are the ones this run adds.`,
    title: "Admin CLI and bulk provisioning",
    pitch:
      "Command-line tools to manage p≡p’s keys and trust from a terminal, and a factory that sets up a whole company’s users in one run.",
    cliH: "The CLI",
    cli: "I started the toolkit and wrote its first commands: identities, key export and import, trust and trustwords, translations. A senior colleague later became its main author. Later I added piping: every command reads records on stdin, so they chain like any Unix tool.",
    session: "a terminal session · example data",
    factoryH: "The provisioning factory",
    factory:
      "A company rolling p≡p out needs every employee set up and already trusting their colleagues on day one. The factory, which I wrote on my own, reads a CSV of employees, creates each one’s keys in an isolated home, optionally makes everyone trust everyone, and packages each user’s setup into an encrypted, signed archive to deploy. Failures go to a report you can fix and feed back in, and re-runs skip who’s already done:",
  },
  es: {
    aria: (o, n) =>
      `${o} personas ya dadas de alta y ${n} nuevas. Cada pareja confía entre sí; en esta pasada solo se hacen las parejas con alguien nuevo.`,
    already: "Ya dentro",
    fresh: "Nuevas",
    run: ["Esta pasada:", "parejas de confianza"],
    scratch: (n) =>
      `Desde cero serían ${n}. Las líneas lila son las que añade esta pasada.`,
    title: "CLI de administración y altas masivas",
    pitch:
      "Herramientas de línea de comandos para gestionar las claves y la confianza de p≡p desde un terminal, y una fábrica que da de alta a todos los usuarios de una empresa de una sola vez.",
    cliH: "El CLI",
    cli: "Empecé el toolkit y escribí sus primeros comandos: identidades, exportar e importar claves, confianza y trustwords, traducciones. Más tarde, otra persona sénior del equipo pasó a ser su autora principal. Después añadí los pipes: cada comando lee registros por stdin, así que se encadenan como cualquier herramienta Unix.",
    session: "una sesión de terminal · datos de ejemplo",
    factoryH: "La fábrica de altas",
    factory:
      "Una empresa que despliega p≡p necesita a cada empleado configurado y confiando ya en sus compañeros desde el primer día. La fábrica, que escribí yo solo, lee un CSV de empleados, crea las claves de cada uno en un home aislado, opcionalmente hace que todos confíen en todos, y empaqueta la configuración de cada usuario en un archivo cifrado y firmado para desplegar. Los fallos van a un informe que puedes corregir y volver a pasar, y las repeticiones se saltan a quien ya está hecho:",
  },
  ca: {
    aria: (o, n) =>
      `${o} persones ja donades d’alta i ${n} de noves. Cada parella confia entre si; en aquesta passada només es fan les parelles amb algú nou.`,
    already: "Ja hi són",
    fresh: "Noves",
    run: ["Aquesta passada:", "parelles de confiança"],
    scratch: (n) =>
      `Des de zero en serien ${n}. Les línies lila són les que afegeix aquesta passada.`,
    title: "CLI d’administració i altes massives",
    pitch:
      "Eines de línia d’ordres per gestionar les claus i la confiança de p≡p des d’un terminal, i una fàbrica que dona d’alta tots els usuaris d’una empresa d’una sola vegada.",
    cliH: "El CLI",
    cli: "Vaig començar el toolkit i en vaig escriure les primeres ordres: identitats, exportar i importar claus, confiança i trustwords, traduccions. Més endavant, una altra persona sènior de l’equip en va passar a ser l’autora principal. Després hi vaig afegir els pipes: cada ordre llegeix registres per stdin, així que s’encadenen com qualsevol eina Unix.",
    session: "una sessió de terminal · dades d’exemple",
    factoryH: "La fàbrica d’altes",
    factory:
      "Una empresa que desplega p≡p necessita cada empleat configurat i confiant ja en els seus companys des del primer dia. La fàbrica, que vaig escriure jo sol, llegeix un CSV d’empleats, crea les claus de cadascú en un home aïllat, opcionalment fa que tothom confiï en tothom, i empaqueta la configuració de cada usuari en un arxiu xifrat i signat per desplegar. Els errors van a un informe que pots corregir i tornar a passar, i les repeticions se salten qui ja està fet:",
  },
};

// --- the pre-trust mesh -----------------------------------------------------

const Slider = ({ label, value, min, max, onChange }) => (
  <label className="flex items-center gap-2">
    <span className="w-[86px]">{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      className="w-28 accent-[#b98ab9]"
    />
    <span className="w-4 text-ink-text">{value}</span>
  </label>
);

const Mesh = () => {
  const [old, setOld] = useState(6);
  const [fresh, setFresh] = useState(2);
  const t = useCopy(COPY);
  const all = old + fresh;
  const dots = Array.from({ length: all }, (_, i) => {
    const a = (i / all) * 2 * Math.PI - Math.PI / 2;
    return [130 + 100 * Math.cos(a), 125 + 100 * Math.sin(a), i >= old];
  });
  const lines = [];
  dots.forEach(([x1, y1, n1], i) =>
    dots
      .slice(i + 1)
      .forEach(([x2, y2, n2], j) =>
        lines.push({ k: `${i}-${i + j + 1}`, x1, y1, x2, y2, now: n1 || n2 }),
      ),
  );
  // directed pairs: a trusts b
  const thisRun = fresh * (all - 1) + old * fresh;
  const scratch = all * (all - 1);

  return (
    <figure className="flex flex-col items-center gap-4 rounded-lg border border-[#2e313a] bg-[#191b20] p-4 sm:flex-row">
      <svg
        viewBox="0 0 260 250"
        role="img"
        aria-label={t.aria(old, fresh)}
        className="w-[220px] flex-none"
      >
        {lines.map((l) => (
          <line
            key={l.k}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.now ? "#b98ab9" : "#3a3f4c"}
            strokeWidth={l.now ? 1.4 : 1}
          />
        ))}
        {dots.map(([x, y, isNew], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="9"
            fill={isNew ? "#b98ab9" : "#262932"}
            stroke={isNew ? "#191b20" : "#6b7080"}
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="flex flex-col gap-2 text-[12px] text-ink-muted">
        <Slider
          label={t.already}
          value={old}
          min={2}
          max={14}
          onChange={setOld}
        />
        <Slider
          label={t.fresh}
          value={fresh}
          min={0}
          max={6}
          onChange={setFresh}
        />
        <p className="mt-2 text-[13px] text-ink-text">
          {t.run[0]} <b className="text-lilac-text">{thisRun}</b> {t.run[1]}
        </p>
        <p>{t.scratch(scratch)}</p>
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "argparse",
  "GNU recutils",
  "multiprocessing",
  "pytest",
  "Babel",
];

const Cli = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="p≡p Security · 2020–2022"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <H>{t.cliH}</H>
      <p className="mb-4">{t.cli}</p>
      <Snippet caption={t.session} language="bash" code={PIPE} />
      <div className="mt-4">
        <Snippet file="commands/base.py" language="python" code={ARGS} />
      </div>
      <H>{t.factoryH}</H>
      <p className="mb-4">{t.factory}</p>
      <Mesh />
      <div className="mt-4">
        <Snippet file="factory.py" language="python" code={FACTORY} />
      </div>
    </Article>
  );
};

export default Cli;
