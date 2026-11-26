import React, { useState } from "react";
import { prefersReducedMotion } from "../../components/genie";
import {
  ArrowDefs,
  Article,
  Box,
  Edge,
  H,
  Intro,
  Pick,
  Prose,
  Snippet,
  useCopy,
} from "./ui";

// Planck Security Hub. The real code is closed source, so the snippets are
// rewritten and simplified for this page, never copied from the repos.

const SCAN = `// A scanner is any command: it reads the decrypted mail on stdin and
// answers with its exit code (0 = clean), so existing antivirus and
// DLP tools plug in without an SDK.
async fn run_scanners(plain: &[u8], scanners: &[Scanner]) -> Result<(), ScanError> {
    let mut rejected = Vec::new();
    for s in scanners {
        let mut child = Command::new("sh")
            .args(["-c", &s.cmd])
            .stdin(Stdio::piped())
            .spawn()?;
        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(plain).await?;
        } // stdin dropped here: the scanner sees EOF and can answer
        if !child.wait().await?.success() {
            rejected.push(s.name.clone());
        }
    }
    match rejected.is_empty() {
        true => Ok(()),
        false => Err(ScanError::Rejected(rejected)),
    }
}`;

const LOOP = `// The Hub emails the admin when a message is rejected, and that alert
// goes through the same Postfix. Without care it would be inspected,
// fail, and trigger another alert. So our own mail carries a one-time
// token the milter recognises, strips, and lets through.
async fn header(ctx: &mut Ctx, name: &str, value: &str) -> Status {
    if name.eq_ignore_ascii_case(INTERNAL_HEADER) && tokens::is_ours(value).await {
        ctx.internal = true;
    }
    ctx.message.push_header(name, value);
    Status::Continue
}

async fn end_of_message(ctx: &mut Ctx, actions: &Actions) -> Status {
    if ctx.internal {
        actions.remove_header(INTERNAL_HEADER).await; // don't leak the token
        return Status::Continue;
    }
    match inspect(&ctx.message).await {
        Ok(()) => Status::Continue,                    // relay it, still encrypted
        Err(e) if e.is_temporary() => Status::Tempfail, // the sender retries later
        Err(e) => {
            alert_admin(&e).await;
            Status::Discard
        }
    }
}`;

const BEFORE = `# The first version: Postfix piped every message into a Python script
# and read its exit code. 0 = delivered, 1 = keep it in the queue.
def filter_message(raw: bytes, settings) -> int:
    plain = decrypt(raw, settings.org_key)
    for scanner in settings.scanners:
        result = subprocess.run(scanner.cmd, shell=True, input=plain)
        if result.returncode != 0:
            alert_admin(scanner.name, raw)
            return 1
    reinject(raw, settings.next_hop)
    return 0`;

// Boxes of the diagram: [x, y, w, label, sub, accent]
// numbers are indexes into COPY.nodes; strings stay as they are
const NODES = [
  [20, 30, 120, 0, 1],
  [220, 30, 120, "Postfix", 2],
  [600, 30, 140, 3, 4],
  [200, 150, 160, "Hub milter", "Rust · tokio", true],
  [560, 150, 180, 5, 6],
  [20, 150, 120, "Admin", 7],
  [20, 280, 140, "Admin UI", "React"],
  [210, 280, 140, "Config API", "axum · JWT"],
  [400, 280, 120, "Redis", 8],
];

export const COPY = {
  en: {
    nodes: [
      "Sender",
      "encrypted mail",
      "mail server",
      "Next hop",
      "inbox / relay",
      "Scanners",
      "antivirus · DLP",
      "alert + log",
      "settings",
    ],
    say: "Scanners say:",
    clean: "clean",
    threat: "threat",
    encrypted: "encrypted",
    plaintext: "plaintext",
    relay: "relay the original, still encrypted",
    verdict: "verdict",
    stdin: "plaintext on stdin",
    exit: "exit code",
    fail: "fail",
    reload: "reload",
    plane: "control plane",
    aria: "Mail flows from the sender into Postfix, which hands it to the Hub milter. The milter decrypts a copy and streams the plaintext to each scanner. If they all pass, Postfix relays the original encrypted mail to the next hop; if one fails, the mail is discarded and the admin is alerted. Below, the admin UI saves settings through the config API into Redis, and the milter reloads them.",
    pitch:
      "An email security gateway that lets a company’s existing antivirus and data-loss scanners read end-to-end encrypted email, without changing the scanners.",
    problem:
      "Planck encrypts email end to end with PGP. That’s great for privacy, but the antivirus and DLP appliances companies already run now see only ciphertext, and most of them can’t be changed.",
    how: "The Hub plugs into Postfix as a milter. Mail is also encrypted to an organisation key, so the Hub decrypts a copy, streams the plaintext through every scanner and acts on the verdict. Clean mail goes on exactly as it arrived, still encrypted. Pick a verdict and watch a message go through:",
    builtH: "My part",
    built: [
      "I was the main author of the Rust Hub, from the first milter prototype to the 4.0 releases. The milter rebuilds each SMTP transaction into a whole message, decrypts it, runs the scanners, and then has to give Postfix the right answer for whatever happened: relay it, try again later, or discard it.",
      "Around that there’s a config API in axum (JWT, settings in Redis) and a React admin for settings, keys and a live log. When you save something there, the Postfix and milter config get rewritten and the milter restarts, so a change doesn’t need a redeploy. It installs from one Docker Compose file, and every push runs clippy, cargo-audit, an SBOM scan and coverage.",
    ],
    scanH: "A scanner is just a command",
    loopH: "The Hub’s own alerts",
    beforeH: "The Python version it replaced",
    before:
      "Planck had decided to move to Rust, for efficiency and because robustness matters in a security company. It started as planck_proxy, a script Postfix ran for every message. I took the inherited script and turned it into a tested, Dockerised package, then rewrote it in Rust as a milter, which talks to Postfix during the SMTP session instead of being spawned once per mail.",
  },
  es: {
    nodes: [
      "Remitente",
      "correo cifrado",
      "servidor de correo",
      "Siguiente salto",
      "buzón / relay",
      "Escáneres",
      "antivirus · DLP",
      "alerta + log",
      "ajustes",
    ],
    say: "Los escáneres dicen:",
    clean: "limpio",
    threat: "amenaza",
    encrypted: "cifrado",
    plaintext: "texto plano",
    relay: "reenvía el original, aún cifrado",
    verdict: "veredicto",
    stdin: "texto plano por stdin",
    exit: "código de salida",
    fail: "falla",
    reload: "recarga",
    plane: "plano de control",
    aria: "El correo va del remitente a Postfix, que se lo pasa al milter del Hub. El milter descifra una copia y envía el texto plano a cada escáner. Si todos lo aprueban, Postfix reenvía el correo original cifrado al siguiente salto; si uno falla, el correo se descarta y se avisa al administrador. Debajo, la interfaz de administración guarda los ajustes en Redis a través de la API de configuración, y el milter los recarga.",
    pitch:
      "Una pasarela de seguridad de correo que permite a los antivirus y escáneres de fuga de datos que una empresa ya tiene leer correo cifrado de extremo a extremo, sin cambiar los escáneres.",
    problem:
      "Planck cifra el correo de extremo a extremo con PGP. Genial para la privacidad, pero los antivirus y los sistemas DLP que las empresas ya usan pasan a ver solo texto cifrado, y la mayoría no se pueden cambiar.",
    how: "El Hub se conecta a Postfix como milter. El correo también se cifra para una clave de la organización, así que el Hub descifra una copia, pasa el texto plano por cada escáner y actúa según el veredicto. El correo limpio sigue tal como llegó, todavía cifrado. Elige un veredicto y mira cómo pasa un mensaje:",
    builtH: "Mi parte",
    built: [
      "Fui el autor principal del Hub en Rust, desde el primer prototipo del milter hasta las versiones 4.0. El milter reconstruye cada transacción SMTP en un mensaje entero, lo descifra, pasa los escáneres y luego tiene que darle a Postfix la respuesta correcta según lo que haya pasado: reenviarlo, reintentarlo más tarde o descartarlo.",
      "Alrededor hay una API de configuración en axum (JWT, ajustes en Redis) y un panel en React para ajustes, claves y un log en directo. Cuando guardas algo ahí, se reescribe la configuración de Postfix y del milter y el milter se reinicia, así que un cambio no necesita redesplegar. Se instala con un solo fichero de Docker Compose, y cada push pasa clippy, cargo-audit, un análisis del SBOM y cobertura.",
    ],
    scanH: "Un escáner es solo un comando",
    loopH: "Las alertas del propio Hub",
    beforeH: "La versión anterior, en Python",
    before:
      "Planck había decidido pasarse a Rust, por eficiencia y porque en una empresa de ciberseguridad la robustez importa. Empezó como planck_proxy, un script que Postfix ejecutaba para cada mensaje. Convertí el script heredado en un paquete con tests y Docker, y después lo reescribí en Rust como milter, que habla con Postfix durante la sesión SMTP en lugar de lanzarse una vez por correo.",
  },
  ca: {
    nodes: [
      "Remitent",
      "correu xifrat",
      "servidor de correu",
      "Següent salt",
      "bústia / relay",
      "Escàners",
      "antivirus · DLP",
      "alerta + log",
      "configuració",
    ],
    say: "Els escàners diuen:",
    clean: "net",
    threat: "amenaça",
    encrypted: "xifrat",
    plaintext: "text pla",
    relay: "reenvia l’original, encara xifrat",
    verdict: "veredicte",
    stdin: "text pla per stdin",
    exit: "codi de sortida",
    fail: "falla",
    reload: "recàrrega",
    plane: "pla de control",
    aria: "El correu va del remitent a Postfix, que el passa al milter del Hub. El milter desxifra una còpia i envia el text pla a cada escàner. Si tots l’aproven, Postfix reenvia el correu original xifrat al següent salt; si un falla, el correu es descarta i s’avisa l’administrador. A sota, la interfície d’administració desa la configuració a Redis a través de l’API de configuració, i el milter la recarrega.",
    pitch:
      "Una passarel·la de seguretat de correu que permet als antivirus i escàners de fuga de dades que una empresa ja té llegir correu xifrat d’extrem a extrem, sense canviar els escàners.",
    problem:
      "Planck xifra el correu d’extrem a extrem amb PGP. Molt bé per a la privadesa, però els antivirus i els sistemes DLP que les empreses ja fan servir passen a veure només text xifrat, i la majoria no es poden canviar.",
    how: "El Hub es connecta a Postfix com a milter. El correu també es xifra per a una clau de l’organització, així que el Hub en desxifra una còpia, passa el text pla per cada escàner i actua segons el veredicte. El correu net continua tal com ha arribat, encara xifrat. Tria un veredicte i mira com passa un missatge:",
    builtH: "La meva part",
    built: [
      "Vaig ser l’autor principal del Hub en Rust, des del primer prototip del milter fins a les versions 4.0. El milter reconstrueix cada transacció SMTP en un missatge sencer, el desxifra, hi passa els escàners i després ha de donar a Postfix la resposta correcta segons el que hagi passat: reenviar-lo, tornar-ho a provar més tard o descartar-lo.",
      "Al voltant hi ha una API de configuració en axum (JWT, configuració a Redis) i un panell en React per a la configuració, les claus i un log en directe. Quan hi deses alguna cosa, es reescriu la configuració de Postfix i del milter i el milter es reinicia, així que un canvi no necessita tornar a desplegar. S’instal·la amb un sol fitxer de Docker Compose, i cada push passa clippy, cargo-audit, una anàlisi de l’SBOM i cobertura.",
    ],
    scanH: "Un escàner és només una ordre",
    loopH: "Les alertes del mateix Hub",
    beforeH: "La versió anterior, en Python",
    before:
      "Planck havia decidit passar-se a Rust, per eficiència i perquè en una empresa de ciberseguretat la robustesa importa. Va començar com a planck_proxy, un script que Postfix executava per a cada missatge. Vaig convertir l’script heretat en un paquet amb tests i Docker, i després el vaig reescriure en Rust com a milter, que parla amb Postfix durant la sessió SMTP en lloc d’executar-se un cop per correu.",
  },
};

// The envelope's trip for each verdict, through the box centres. Colour
// switches (discrete keyTimes) are where it reaches/leaves the milter, as
// fractions of the path length: lilac = encrypted, amber = plaintext.
const TRIPS = {
  clean: {
    path: "M80 54 H280 V178 H650 H280 V54 H670",
    times: "0;0.205;0.674",
    colors: "#b98ab9;#f5c451;#b98ab9",
  },
  threat: {
    path: "M80 54 H280 V178 H650 H280 H80",
    times: "0;0.256;0.842",
    colors: "#b98ab9;#f5c451;#e5797a",
  },
};

export const HubDiagram = () => {
  const [verdict, setVerdict] = useState("clean");
  const trip = TRIPS[verdict];
  const still = prefersReducedMotion();
  const t = useCopy(COPY);
  const word = (v) => (typeof v === "number" ? t.nodes[v] : v);

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2 px-1 text-[11px] text-p-muted">
        <Pick
          label={t.say}
          options={[
            ["clean", t.clean],
            ["threat", t.threat],
          ]}
          value={verdict}
          onChange={setVerdict}
        />
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <i className="size-2 rounded-full bg-p-pop" /> {t.encrypted}
          </span>
          <span className="flex items-center gap-1">
            <i className="size-2 rounded-full bg-p-warn" /> {t.plaintext}
          </span>
        </span>
      </div>
      <div className="overflow-x-auto">
        {/* keyed so a new verdict restarts the SMIL timeline from 0 */}
        <svg
          key={verdict}
          viewBox="0 0 760 340"
          role="img"
          aria-label={t.aria}
          className="min-w-[560px]"
        >
          <ArrowDefs />
          <Edge d="M140 54 H218" label="SMTP" x={180} y={46} />
          <Edge d="M340 54 H598" label={t.relay} x={470} y={46} />
          <Edge d="M268 78 V148" label="milter" x={262} y={118} anchor="end" />
          <Edge
            d="M292 148 V80"
            label={t.verdict}
            x={298}
            y={118}
            anchor="start"
          />
          <Edge d="M360 170 H558" label={t.stdin} x={460} y={162} />
          <Edge d="M560 190 H362" label={t.exit} x={460} y={206} dashed />
          <Edge d="M200 178 H142" label={t.fail} x={171} y={170} />
          <Edge d="M160 304 H208" />
          <Edge d="M350 304 H398" />
          <Edge
            d="M280 280 V208"
            label={t.reload}
            x={286}
            y={248}
            anchor="start"
            dashed
          />
          <text
            x={20}
            y={268}
            className="fill-p-muted text-[10px] uppercase tracking-[0.18em]"
          >
            {t.plane}
          </text>
          {NODES.map(([x, y, w, label, sub, accent]) => (
            <Box
              key={label}
              label={word(label)}
              sub={word(sub)}
              {...{ x, y, w, accent }}
              h={y === 150 ? 56 : 48}
            />
          ))}
          {!still && (
            <circle r="7" stroke="rgb(var(--p-sunk))" strokeWidth="2">
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path={trip.path}
              />
              <animate
                attributeName="fill"
                dur="5s"
                repeatCount="indefinite"
                calcMode="discrete"
                keyTimes={trip.times}
                values={trip.colors}
              />
            </circle>
          )}
        </svg>
      </div>
    </figure>
  );
};

const STACK = [
  "Rust",
  "tokio",
  "axum",
  "Redis",
  "React",
  "Tailwind",
  "Postfix",
  "Docker",
  "GitHub Actions",
];

const SecurityHub = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="Planck Security · 2024"
        title="Planck Security Hub"
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mt-6">{t.problem}</p>
      <p className="mb-4 mt-3">{t.how}</p>
      <HubDiagram />
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.scanH}</H>
      <Snippet file="scanners.rs" language="rust" code={SCAN} />
      <H>{t.loopH}</H>
      <Snippet file="milter.rs" language="rust" code={LOOP} />
      <H>{t.beforeH}</H>
      <p className="mb-4">{t.before}</p>
      <Snippet file="proxy.py" language="python" code={BEFORE} />
    </Article>
  );
};

export default SecurityHub;
