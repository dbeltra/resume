import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDefs,
  Article,
  Box,
  Edge,
  H,
  Prose,
  Intro,
  Pick,
  Snippet,
  useCopy,
} from "./ui";

// The financial-messaging demo and its test harness. The real code is closed
// source, so the snippets are rewritten and simplified for this page.

const CONSUMER = `class MessagesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.pollers = []
        for queue in settings.INBOUND_QUEUES:
            # the receiver's queue: decrypted messages and their rating
            self.poll(queue, every=READ_RATE, pane="receiver")
            # a copy of what crossed the network, still encrypted. Polled a
            # second faster, so the audience sees it in transit before it lands
            self.poll(queue + NETWORK_SUFFIX, every=READ_RATE - 1, pane="network")

    def poll(self, queue, every, pane):
        self.pollers.append(RepeatedTimer(every, self.forward, queue, pane))

    def forward(self, queue, pane):
        for msg in mq.get_all(queue):  # non-blocking gets until it's empty
            self.send(text_data=json.dumps({"pane": pane, **msg}))

    def disconnect(self, code):
        for timer in self.pollers:     # no reader threads left behind
            timer.stop()`;

const HARNESS = `# One API, several MQ client stacks: each request names a mode and the
# matching handler module does the talking.
def handle(request, action):
    args = validate(request)  # queue, count, descriptors…
    handler = import_module(f"messages.handlers.{args.mode}")  # pymqi | jmqi
    try:
        return JsonResponse(getattr(handler, action)(**args.params))
    except MQError as e:
        return JsonResponse({"error": e.reason_text}, status=502)

# messages/handlers/jmqi.py: the Java client only exists in Java, so
# Python boots a JVM once per process and calls the MQ classes through it.
if not jpype.isJVMStarted():
    jpype.startJVM(
        f"-javaagent:{AGENT}",
        "-Dfile.encoding=UTF-8",  # the default, Latin-1, can't encode "€"
        classpath=MQ_JARS,
    )`;

export const COPY = {
  en: {
    problem:
      "The connector sat between two message queues and encrypted everything that crossed between them, without anyone noticing. That was the whole idea, and it made it very hard to demo, because there was nothing to see. The team needed to show a message going in, what an eavesdropper would get, and what came out the other side. The sales team used it to demo the product to several banks; I didn’t give the demos, I got it ready so they could.",
    builtH: "How it grew",
    built: [
      "I wrote every version. It started as a spike, a Django form that put messages on a queue and a small reader that printed them, which was enough to learn queue managers, channels and TLS. The first real demo had two endpoints, XML messages, queue browsing, ratings read from the connector’s log and an auto-send mode.",
      "Then I rewrote it in real time with Django Channels: three panes, a mode that drives the connector through its Java client, and a command that builds the demo’s config from the deployed connector’s own settings, so nobody had to write it by hand.",
      "Later it turned into a test harness: a JSON API that puts and gets messages through either the C or the Java MQ client, with exact message descriptors and many threads, plus load scripts and a Grafana dashboard over the connector’s Prometheus metrics.",
    ],
    trust: {
      verified: [
        "trusted",
        "Keys exchanged and verified: encrypted, and you know who sent it.",
      ],
      unverified: [
        "reliable",
        "Encrypted, but nobody has verified the keys yet.",
      ],
      none: [
        "unencrypted",
        "No key for the receiver yet, so it travels in the clear.",
      ],
    },
    msg: "Message to send",
    send: "Send",
    keys: "Receiver’s keys:",
    opts: ["verified", "not verified", "no key"],
    panes: [
      ["Sender", "put on queue A"],
      ["Network", "what crosses the wire"],
      ["Receiver", "got from queue B"],
    ],
    wire: {
      aria: "The browser talks to a Django Channels consumer over a WebSocket. The consumer puts messages on queue A. Connector A encrypts them, they cross the network, and connector B decrypts them onto queue B. The consumer polls queue B and a copy of the network traffic, and pushes both back to the browser.",
      put: "put",
      encrypt: "encrypt",
      network: "network",
      decrypt: "decrypt",
      poll: "poll queue B + a copy of the network traffic",
      browser: ["Browser", "3 panes"],
      queue: "Queue",
      connector: "Connector",
      encrypts: "encrypts",
      decrypts: "decrypts",
    },
    title: "Encrypted financial messaging, live",
    pitch:
      "A live demo, and later a test harness, for p≡p’s connector that encrypts financial messages as they travel over IBM MQ.",
    tryH: "Try it",
    try: "A miniature of the demo I built. Send a message and pick how far the receiver’s keys are trusted:",
    wiredH: "How the real one was wired",
    wired:
      "The browser and Django talk over a WebSocket. Django puts messages on the sender’s queue, and reader threads poll the receiver’s queue and a copy of the network traffic, pushing each message to its pane.",
    orderH: "Network before receiver",
    apiH: "One API, two MQ clients",
  },
  es: {
    problem:
      "El conector estaba entre dos colas de mensajes y cifraba todo lo que pasaba entre ellas sin que nadie lo notara. Esa era justo la idea, y por eso era tan difícil hacer una demo: no había nada que ver. El equipo necesitaba enseñar un mensaje entrando, lo que vería alguien escuchando y lo que salía por el otro lado. El equipo de ventas la usó para enseñar el producto a varios bancos; yo no hacía las demos, la dejaba lista para que pudieran hacerlas.",
    builtH: "Cómo fue creciendo",
    built: [
      "Escribí todas las versiones. Empezó como un spike, un formulario de Django que ponía mensajes en una cola y un pequeño lector que los mostraba, lo justo para aprender queue managers, canales y TLS. La primera demo de verdad tenía dos endpoints, mensajes XML, exploración de colas, valoraciones leídas del log del conector y un modo de envío automático.",
      "Después la reescribí en tiempo real con Django Channels: tres paneles, un modo que maneja el conector a través de su cliente Java y un comando que genera la configuración de la demo a partir de los ajustes del conector desplegado, para que nadie tuviera que escribirla a mano.",
      "Más tarde se convirtió en un banco de pruebas: una API JSON que pone y recoge mensajes con el cliente MQ de C o el de Java, con descriptores de mensaje exactos y muchos hilos, además de scripts de carga y un panel de Grafana sobre las métricas de Prometheus del conector.",
    ],
    trust: {
      verified: [
        "de confianza",
        "Claves intercambiadas y verificadas: cifrado, y sabes quién lo envía.",
      ],
      unverified: [
        "fiable",
        "Cifrado, pero nadie ha verificado todavía las claves.",
      ],
      none: [
        "sin cifrar",
        "El receptor aún no tiene clave, así que viaja en claro.",
      ],
    },
    msg: "Mensaje a enviar",
    send: "Enviar",
    keys: "Claves del receptor:",
    opts: ["verificadas", "sin verificar", "sin clave"],
    panes: [
      ["Emisor", "lo pone en la cola A"],
      ["Red", "lo que viaja por el cable"],
      ["Receptor", "lo recibe de la cola B"],
    ],
    wire: {
      aria: "El navegador habla con un consumer de Django Channels por WebSocket. El consumer pone los mensajes en la cola A. El conector A los cifra, cruzan la red y el conector B los descifra en la cola B. El consumer consulta la cola B y una copia del tráfico de red, y envía ambos de vuelta al navegador.",
      put: "pone",
      encrypt: "cifra",
      network: "red",
      decrypt: "descifra",
      poll: "consulta la cola B + una copia del tráfico de red",
      browser: ["Navegador", "3 paneles"],
      queue: "Cola",
      connector: "Conector",
      encrypts: "cifra",
      decrypts: "descifra",
    },
    title: "Mensajería financiera cifrada, en directo",
    pitch:
      "Una demo en directo, y más tarde un banco de pruebas, para el conector de p≡p que cifra mensajes financieros mientras viajan por IBM MQ.",
    tryH: "Pruébalo",
    try: "Una miniatura de la demo que construí. Envía un mensaje y elige hasta qué punto se confía en las claves del receptor:",
    wiredH: "Cómo estaba montada la de verdad",
    wired:
      "El navegador y Django hablan por WebSocket. Django pone los mensajes en la cola del emisor, y unos hilos lectores consultan la cola del receptor y una copia del tráfico de red, y envían cada mensaje a su panel.",
    orderH: "La red antes que el receptor",
    apiH: "Una API, dos clientes MQ",
  },
  ca: {
    problem:
      "El connector era entre dues cues de missatges i xifrava tot el que hi passava sense que ningú se n’adonés. Aquesta era justament la idea, i per això era tan difícil fer-ne una demo: no hi havia res a veure. L’equip necessitava ensenyar un missatge entrant, el que veuria algú escoltant i el que sortia per l’altra banda. L’equip de vendes la va fer servir per ensenyar el producte a diversos bancs; jo no feia les demos, la deixava a punt perquè les poguessin fer.",
    builtH: "Com va anar creixent",
    built: [
      "Vaig escriure totes les versions. Va començar com un spike, un formulari de Django que posava missatges en una cua i un petit lector que els mostrava, el just per aprendre queue managers, canals i TLS. La primera demo de debò tenia dos endpoints, missatges XML, exploració de cues, valoracions llegides del log del connector i un mode d’enviament automàtic.",
      "Després la vaig reescriure en temps real amb Django Channels: tres panells, un mode que fa anar el connector a través del seu client Java i una ordre que genera la configuració de la demo a partir de la del connector desplegat, perquè ningú no l’hagués d’escriure a mà.",
      "Més endavant es va convertir en un banc de proves: una API JSON que posa i recull missatges amb el client MQ de C o el de Java, amb descriptors de missatge exactes i molts fils, a més d’scripts de càrrega i un tauler de Grafana sobre les mètriques de Prometheus del connector.",
    ],
    trust: {
      verified: [
        "de confiança",
        "Claus intercanviades i verificades: xifrat, i saps qui l’envia.",
      ],
      unverified: [
        "fiable",
        "Xifrat, però ningú no n’ha verificat encara les claus.",
      ],
      none: [
        "sense xifrar",
        "El receptor encara no té clau, així que viatja en clar.",
      ],
    },
    msg: "Missatge a enviar",
    send: "Envia",
    keys: "Claus del receptor:",
    opts: ["verificades", "sense verificar", "sense clau"],
    panes: [
      ["Emissor", "el posa a la cua A"],
      ["Xarxa", "el que viatja pel cable"],
      ["Receptor", "el rep de la cua B"],
    ],
    wire: {
      aria: "El navegador parla amb un consumer de Django Channels per WebSocket. El consumer posa els missatges a la cua A. El connector A els xifra, travessen la xarxa i el connector B els desxifra a la cua B. El consumer consulta la cua B i una còpia del trànsit de xarxa, i envia tots dos de tornada al navegador.",
      put: "posa",
      encrypt: "xifra",
      network: "xarxa",
      decrypt: "desxifra",
      poll: "consulta la cua B + una còpia del trànsit de xarxa",
      browser: ["Navegador", "3 panells"],
      queue: "Cua",
      connector: "Connector",
      encrypts: "xifra",
      decrypts: "desxifra",
    },
    title: "Missatgeria financera xifrada, en directe",
    pitch:
      "Una demo en directe, i més endavant un banc de proves, per al connector de p≡p que xifra missatges financers mentre viatgen per IBM MQ.",
    tryH: "Prova-ho",
    try: "Una miniatura de la demo que vaig construir. Envia un missatge i tria fins a quin punt es confia en les claus del receptor:",
    wiredH: "Com estava muntada la de debò",
    wired:
      "El navegador i Django parlen per WebSocket. Django posa els missatges a la cua de l’emissor, i uns fils lectors consulten la cua del receptor i una còpia del trànsit de xarxa, i envien cada missatge al seu panell.",
    orderH: "La xarxa abans que el receptor",
    apiH: "Una API, dos clients MQ",
  },
};

// --- the live demo, in miniature --------------------------------------------

const TONE = {
  verified: "bg-p-ok/20 text-p-ok",
  unverified: "bg-p-warn/20 text-p-warn",
  none: "bg-p-fg/10 text-p-muted",
};
const SAMPLE =
  '<Payment><Amount ccy="EUR">1250.00</Amount><To>DE89 3704 0044 0532 0130 00</To></Payment>';
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// stand-in ciphertext: random base64 about as long as real output would be
const scramble = (text) =>
  Array.from(
    { length: Math.ceil(text.length * 1.35) + 24 },
    () => B64[Math.floor(Math.random() * 64)],
  ).join("");

const Pane = ({ title, sub, children }) => (
  <section className="flex min-h-[150px] min-w-0 flex-col rounded-md border border-p-line bg-p-surface">
    <header className="border-b border-p-line px-3 py-1.5">
      <div className="text-[12px] font-semibold text-p-fg">{title}</div>
      <div className="text-[10px] text-p-muted">{sub}</div>
    </header>
    <ol className="flex flex-col gap-1.5 p-2">{children}</ol>
  </section>
);

const Msg = ({ children, mono, badge }) => (
  <li className="rounded bg-p-fg/5 px-2 py-1.5 motion-safe:animate-[app-open_0.3s_ease-out]">
    <p
      className={`break-all text-[10px] leading-snug ${mono ? "font-mono text-p-pop" : "font-mono text-p-fg"}`}
    >
      {children}
    </p>
    {badge}
  </li>
);

const Demo = () => {
  const t = useCopy(COPY);
  const [text, setText] = useState(SAMPLE);
  const [trust, setTrust] = useState("verified");
  const [msgs, setMsgs] = useState([]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const id = Date.now();
    const m = { id, text, trust, cipher: scramble(text), stage: 0 };
    setMsgs((ms) => [m, ...ms].slice(0, 3));
    // network first, then the receiver, like the real demo's pollers
    [1, 2].forEach((stage) =>
      timers.current.push(
        setTimeout(
          () =>
            setMsgs((ms) => ms.map((x) => (x.id === id ? { ...x, stage } : x))),
          stage * 900,
        ),
      ),
    );
  };

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-3">
      <form onSubmit={send} className="mb-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={t.msg}
          className="min-w-0 flex-1 rounded-md border border-p-line bg-p-surface px-2.5 py-1.5 font-mono text-[11px] text-p-fg outline-none focus:border-p-pop"
        />
        <button
          type="submit"
          className="flex-none rounded-md bg-p-pop/80 px-3 text-[12px] font-semibold text-white hover:bg-p-pop"
        >
          {t.send}
        </button>
      </form>
      <div className="mb-1 flex flex-wrap items-center gap-2 px-1 text-[11px] text-p-muted">
        <Pick
          label={t.keys}
          options={[
            ["verified", t.opts[0]],
            ["unverified", t.opts[1]],
            ["none", t.opts[2]],
          ]}
          value={trust}
          onChange={setTrust}
        />
      </div>
      <p className="mb-3 px-1 text-[12px] text-p-fg">{t.trust[trust][1]}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Pane title={t.panes[0][0]} sub={t.panes[0][1]}>
          {msgs.map((m) => (
            <Msg key={m.id}>{m.text}</Msg>
          ))}
        </Pane>
        <Pane title={t.panes[1][0]} sub={t.panes[1][1]}>
          {msgs
            .filter((m) => m.stage >= 1)
            .map((m) => (
              <Msg key={m.id} mono={m.trust !== "none"}>
                {m.trust === "none" ? m.text : m.cipher}
              </Msg>
            ))}
        </Pane>
        <Pane title={t.panes[2][0]} sub={t.panes[2][1]}>
          {msgs
            .filter((m) => m.stage >= 2)
            .map((m) => (
              <Msg
                key={m.id}
                badge={
                  <span
                    className={`mt-1 inline-block rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.12em] ${TONE[m.trust]}`}
                  >
                    {t.trust[m.trust][0]}
                  </span>
                }
              >
                {m.text}
              </Msg>
            ))}
        </Pane>
      </div>
    </figure>
  );
};

// --- how the demo is wired ----------------------------------------------------

export const Wiring = () => {
  const w = useCopy(COPY).wire;
  return (
    <figure className="overflow-x-auto rounded-lg border border-p-line bg-p-sunk p-3">
      <svg
        viewBox="0 -24 800 210"
        role="img"
        aria-label={w.aria}
        className="min-w-[600px]"
      >
        <ArrowDefs />
        <Edge d="M140 50 H198" label="WebSocket" x={170} y={26} />
        <Edge d="M200 66 H142" />
        <Edge d="M330 58 H378" label={w.put} x={354} y={50} />
        <Edge
          d="M440 82 V126"
          label={w.encrypt}
          x={446}
          y={110}
          anchor="start"
        />
        <Edge d="M500 152 H548" label={w.network} x={524} y={144} />
        <Edge
          d="M610 128 V84"
          label={w.decrypt}
          x={616}
          y={110}
          anchor="start"
        />
        <Edge
          d="M610 32 C 560 -12, 320 -12, 268 31"
          label={w.poll}
          x={440}
          y={-8}
          dashed
        />
        <Box x={20} y={34} w={120} label={w.browser[0]} sub={w.browser[1]} />
        <Box
          x={200}
          y={34}
          w={130}
          label="Django"
          sub="Channels consumer"
          accent
        />
        <Box x={380} y={34} w={120} label={`${w.queue} A`} sub="IBM MQ" />
        <Box
          x={380}
          y={128}
          w={120}
          label={`${w.connector} A`}
          sub={w.encrypts}
        />
        <Box
          x={550}
          y={128}
          w={120}
          label={`${w.connector} B`}
          sub={w.decrypts}
        />
        <Box x={550} y={34} w={120} label={`${w.queue} B`} sub="IBM MQ" />
      </svg>
    </figure>
  );
};

const STACK = [
  "Python",
  "Django",
  "Channels",
  "WebSockets",
  "IBM MQ",
  "pymqi",
  "JPype",
  "Prometheus",
  "Grafana",
];

const Mq = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="p≡p Security · 2020–2022"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mt-6">{t.problem}</p>
      <H>{t.tryH}</H>
      <p className="mb-4">{t.try}</p>
      <Demo />
      <H>{t.wiredH}</H>
      <p className="mb-4">{t.wired}</p>
      <Wiring />
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.orderH}</H>
      <Snippet file="consumers.py" language="python" code={CONSUMER} />
      <H>{t.apiH}</H>
      <Snippet file="handlers.py" language="python" code={HARNESS} />
    </Article>
  );
};

export default Mq;
