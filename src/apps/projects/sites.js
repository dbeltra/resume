import React, { useState } from "react";
import {
  Article,
  Bullets,
  H,
  Intro,
  Pick,
  Shots,
  Snippet,
  useCopy,
} from "./ui";
import Pep2018 from "../../assets/images/archive/pep-2018.jpg";
import Pep2019 from "../../assets/images/archive/pep-2019.jpg";
import Planck2023 from "../../assets/images/archive/planck-2023.jpg";

// pages as the Internet Archive kept them: [image, snapshot]
const ARCHIVE = [
  [
    Pep2018,
    "https://web.archive.org/web/20180515172754/https://www.pep.security/",
  ],
  [
    Pep2019,
    "https://web.archive.org/web/20190720144309/https://www.pep.security/en/",
  ],
  [
    Planck2023,
    "https://web.archive.org/web/20230712092951/https://www.planck.security/",
  ],
];

// The company websites. The real code is closed source, so the snippets are
// rewritten and simplified for this page.

const UTM = `class CampaignMiddleware:
    """Remembers which campaign brought a visitor, on our own server:
    no third-party tracker involved."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        utm = {k: v for k, v in request.GET.items() if k.startswith("utm_")}
        if request.method == "GET" and utm:
            if not request.session.session_key:
                request.session.save()  # a key to tie the visits together
            CampaignVisit.objects.create(
                session_key=request.session.session_key,
                page=request.path,
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
                **{field: utm.get(field, "") for field in UTM_FIELDS},
            )
        return self.get_response(request)`;

const TRIAL = `@ratelimit(key="ip", rate="5/h", block=True)  # bots love a free trial
def trial_signup(request):
    form = TrialForm(request.POST)
    if not form.is_valid():
        return render(request, "trial.html", {"form": form})

    contact, _ = Contact.objects.update_or_create(
        email=form.cleaned_data["email"], defaults=form.contact_fields()
    )
    download = Download.objects.create(contact=contact, product=form.product)
    crm.upsert(contact)  # find by email in the CRM, then create or update
    send_template_mail("trial", to=contact.email, link=download.signed_url())
    return redirect("trial-thanks")


class Download(models.Model):
    def signed_url(self):
        # the download server checks the same signature, so links can't be guessed
        sig = hmac.new(settings.DOWNLOAD_KEY, str(self.pk).encode(), "sha256")
        return f"{settings.DOWNLOAD_HOST}/{self.pk}/{sig.hexdigest()}"`;

// --- the eras --------------------------------------------------------------

const YEARS = ["2018", "2018", "2020", "2023"]; // text in COPY.eras
const COPY = {
  en: {
    stats: [
      ["4", "versions"],
      ["5+ years", "looking after it"],
      ["Static → CMS", "run by editors"],
    ],
    eras: [
      [
        "Static HTML",
        "An agency’s hand-coded front page. Every change meant a developer.",
      ],
      [
        "Mezzanine",
        "I moved it onto a Django CMS: page blocks, translations, forms, jobs.",
      ],
      [
        "Redesign",
        "A new look, a dark theme, and layout options editors could change in the admin.",
      ],
      [
        "Planck rebuild",
        "The rebrand: trial signups, signed downloads, CRM sync and an API for the back office.",
      ],
    ],
    beforeMe: "before me",
    blocks: {
      slider: "Slider header",
      content: "Content",
      timeline: "Timeline",
      testimonial: "Testimonial",
      dropdown: "Dropdown",
    },
    language: "Language:",
    admin: "Admin · page blocks",
    up: "Move up",
    down: "Move down",
    remove: "Remove",
    empty: "An empty page. Add a block.",
    title: "Company websites, from static to CMS",
    pitch:
      "I joined p≡p to look after its website and stayed for over five years: I moved it from static HTML to a CMS editors could run themselves, redesigned it, and rebuilt it for the Planck rebrand.",
    versionsH: "Four versions",
    blocksH: "Pages as blocks",
    blocksP:
      "Editors built pages from blocks in the Mezzanine admin, each one with its own fields in every language. Try it: add, reorder or remove blocks, and switch the language.",
    builtH: "What I built",
    bullets: [
      [
        "The CMS.",
        "The Mezzanine setup and every custom app on top: page blocks, multilingual fields, a jobs board and a theme.",
      ],
      [
        "Leads.",
        "E-book, demo and call-request forms, with double opt-in through a signed confirmation link, all pushed to the CRM.",
      ],
      [
        "Campaigns.",
        "A middleware that records which campaign brought each visit, kept on our own server.",
      ],
      [
        "The Planck rebuild.",
        "Rate-limited trial signups, signed download links, HubSpot sync and a token-protected API the back office pulled trials and downloads from.",
      ],
      [
        "Around it.",
        "A sister site for p≡p software, a login-gated data room for investors, a contributor agreement registry for the p≡p foundation and a nomination site for the Big Brother Awards. The shop lives here too.",
      ],
    ],
    utmH: "Knowing where visitors came from",
    trialH: "A free trial, safely",
    archiveH: "As the Internet Archive kept them",
    archive: [
      "pep.security, May 2018: the agency’s static page, before me",
      "pep.security, July 2019: on Mezzanine",
      "planck.security, July 2023: the Planck rebuild",
    ],
  },
  es: {
    stats: [
      ["4", "versiones"],
      ["5+ años", "cuidándola"],
      ["Estática → CMS", "la llevan los editores"],
    ],
    eras: [
      [
        "HTML estático",
        "Una portada hecha a mano por una agencia. Cada cambio necesitaba a un desarrollador.",
      ],
      [
        "Mezzanine",
        "La pasé a un CMS en Django: bloques de página, traducciones, formularios, ofertas de empleo.",
      ],
      [
        "Rediseño",
        "Un aspecto nuevo, un tema oscuro y opciones de maquetación que los editores podían cambiar desde el admin.",
      ],
      [
        "Web de Planck",
        "El cambio de marca: altas de prueba, descargas firmadas, sincronización con el CRM y una API para el back office.",
      ],
    ],
    beforeMe: "antes de mí",
    blocks: {
      slider: "Cabecera con slider",
      content: "Contenido",
      timeline: "Cronología",
      testimonial: "Testimonio",
      dropdown: "Desplegable",
    },
    language: "Idioma:",
    admin: "Admin · bloques de la página",
    up: "Subir",
    down: "Bajar",
    remove: "Quitar",
    empty: "Una página vacía. Añade un bloque.",
    title: "Webs de empresa, de estáticas a CMS",
    pitch:
      "Entré en p≡p para encargarme de su web y me quedé más de cinco años: la pasé de HTML estático a un CMS que los editores podían llevar solos, la rediseñé y la rehíce para el cambio de marca a Planck.",
    versionsH: "Cuatro versiones",
    blocksH: "Páginas hechas de bloques",
    blocksP:
      "Los editores montaban las páginas con bloques desde el admin de Mezzanine, cada uno con sus campos en cada idioma. Pruébalo: añade, reordena o quita bloques, y cambia el idioma.",
    builtH: "Lo que construí",
    bullets: [
      [
        "El CMS.",
        "La instalación de Mezzanine y todas las apps a medida: bloques de página, campos multilingües, una bolsa de empleo y un tema.",
      ],
      [
        "Leads.",
        "Formularios de e-book, demo y petición de llamada, con doble opt-in mediante un enlace de confirmación firmado, todo enviado al CRM.",
      ],
      [
        "Campañas.",
        "Un middleware que registra qué campaña trajo cada visita, guardado en nuestro propio servidor.",
      ],
      [
        "La web de Planck.",
        "Altas de prueba con límite de peticiones, enlaces de descarga firmados, sincronización con HubSpot y una API protegida con token de la que el back office sacaba pruebas y descargas.",
      ],
      [
        "Alrededor.",
        "Una web hermana para p≡p software, una data room con login para inversores, un registro de acuerdos de contribución para la fundación p≡p y una web de nominaciones para los Big Brother Awards. La tienda también vive aquí.",
      ],
    ],
    utmH: "Saber de dónde venían las visitas",
    trialH: "Una prueba gratuita, sin riesgos",
    archiveH: "Tal como las guardó el Internet Archive",
    archive: [
      "pep.security, mayo de 2018: la página estática de la agencia, antes de mí",
      "pep.security, julio de 2019: ya en Mezzanine",
      "planck.security, julio de 2023: la web de Planck",
    ],
  },
  ca: {
    stats: [
      ["4", "versions"],
      ["5+ anys", "cuidant-la"],
      ["Estàtica → CMS", "la porten els editors"],
    ],
    eras: [
      [
        "HTML estàtic",
        "Una portada feta a mà per una agència. Cada canvi necessitava un desenvolupador.",
      ],
      [
        "Mezzanine",
        "La vaig passar a un CMS en Django: blocs de pàgina, traduccions, formularis, ofertes de feina.",
      ],
      [
        "Redisseny",
        "Un aspecte nou, un tema fosc i opcions de maquetació que els editors podien canviar des de l’admin.",
      ],
      [
        "Web de Planck",
        "El canvi de marca: altes de prova, descàrregues signades, sincronització amb el CRM i una API per al back office.",
      ],
    ],
    beforeMe: "abans de mi",
    blocks: {
      slider: "Capçalera amb slider",
      content: "Contingut",
      timeline: "Cronologia",
      testimonial: "Testimoni",
      dropdown: "Desplegable",
    },
    language: "Idioma:",
    admin: "Admin · blocs de la pàgina",
    up: "Puja",
    down: "Baixa",
    remove: "Treu",
    empty: "Una pàgina buida. Afegeix-hi un bloc.",
    title: "Webs d’empresa, d’estàtiques a CMS",
    pitch:
      "Vaig entrar a p≡p per encarregar-me del web i m’hi vaig quedar més de cinc anys: el vaig passar d’HTML estàtic a un CMS que els editors podien portar sols, el vaig redissenyar i el vaig refer per al canvi de marca a Planck.",
    versionsH: "Quatre versions",
    blocksH: "Pàgines fetes de blocs",
    blocksP:
      "Els editors muntaven les pàgines amb blocs des de l’admin de Mezzanine, cadascun amb els seus camps en cada idioma. Prova-ho: afegeix, reordena o treu blocs, i canvia l’idioma.",
    builtH: "El que vaig construir",
    bullets: [
      [
        "El CMS.",
        "La instal·lació de Mezzanine i totes les apps a mida: blocs de pàgina, camps multilingües, una borsa de feina i un tema.",
      ],
      [
        "Leads.",
        "Formularis d’e-book, demo i petició de trucada, amb doble opt-in mitjançant un enllaç de confirmació signat, tot enviat al CRM.",
      ],
      [
        "Campanyes.",
        "Un middleware que registra quina campanya ha portat cada visita, desat al nostre propi servidor.",
      ],
      [
        "El web de Planck.",
        "Altes de prova amb límit de peticions, enllaços de descàrrega signats, sincronització amb HubSpot i una API protegida amb token d’on el back office treia proves i descàrregues.",
      ],
      [
        "Al voltant.",
        "Un web germà per a p≡p software, una data room amb login per a inversors, un registre d’acords de contribució per a la fundació p≡p i un web de nominacions per als Big Brother Awards. La botiga també viu aquí.",
      ],
    ],
    utmH: "Saber d’on venien les visites",
    trialH: "Una prova gratuïta, sense riscos",
    archiveH: "Tal com les va desar l’Internet Archive",
    archive: [
      "pep.security, maig de 2018: la pàgina estàtica de l’agència, abans de mi",
      "pep.security, juliol de 2019: ja en Mezzanine",
      "planck.security, juliol de 2023: el web de Planck",
    ],
  },
};

const Eras = () => {
  const t = useCopy(COPY);
  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {t.eras.map(([title, text], i) => (
        <li
          key={title}
          className="relative rounded-lg border border-[#2e313a] bg-[#191b20] p-3"
        >
          <div className="text-[11px] font-semibold text-lilac-text">
            {YEARS[i]}
          </div>
          <div className="text-[13px] font-semibold text-ink-text">{title}</div>
          <p className="mt-1 text-[12px] leading-snug text-ink-muted">{text}</p>
          {i === 0 && (
            <span className="mt-2 inline-block rounded-full bg-white/10 px-1.5 py-px text-[9px] uppercase tracking-[0.12em] text-ink-muted">
              {t.beforeMe}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};

// --- the page builder, in miniature ----------------------------------------

// each block type, with its text in both languages
const BLOCKS = {
  slider: {
    en: ["Privacy by default", "Encryption that just works."],
    de: [
      "Privatsphäre als Standard",
      "Verschlüsselung, die einfach funktioniert.",
    ],
  },
  content: {
    en: [
      "How it works",
      "Keys are created and exchanged for you, in the background.",
    ],
    de: [
      "So funktioniert es",
      "Schlüssel werden im Hintergrund erstellt und ausgetauscht.",
    ],
  },
  timeline: {
    en: ["Our story", "Founded · First release · Today"],
    de: ["Unsere Geschichte", "Gegründet · Erste Version · Heute"],
  },
  testimonial: {
    en: ["“We switched in a day.”", "IT lead, example customer"],
    de: ["„Wir haben an einem Tag umgestellt.“", "IT-Leiter, Beispielkunde"],
  },
  dropdown: {
    en: ["Is it free? ▾", "Questions and answers that fold open."],
    de: ["Ist es kostenlos? ▾", "Fragen und Antworten zum Aufklappen."],
  },
};

const Preview = ({ type, lang }) => {
  const [title, text] = BLOCKS[type][lang];
  if (type === "slider")
    return (
      <div className="rounded bg-gradient-to-r from-[#4b3a63] to-[#2d4b6b] px-3 py-4 text-white">
        <div className="text-[14px] font-bold">{title}</div>
        <div className="text-[11px] opacity-80">{text}</div>
      </div>
    );
  if (type === "testimonial")
    return (
      <div className="rounded border-l-2 border-lilac bg-white/5 px-3 py-2">
        <div className="text-[12px] italic text-ink-text">{title}</div>
        <div className="text-[10px] text-ink-muted">{text}</div>
      </div>
    );
  if (type === "timeline")
    return (
      <div className="px-1">
        <div className="text-[12px] font-semibold text-ink-text">{title}</div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-ink-muted">
          {text.split(" · ").map((t) => (
            <span key={t} className="flex items-center gap-1">
              <i className="size-1.5 rounded-full bg-lilac" />
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <div className="px-1">
      <div className="text-[12px] font-semibold text-ink-text">{title}</div>
      <div className="text-[11px] text-ink-muted">{text}</div>
    </div>
  );
};

const tool =
  "size-6 rounded text-[12px] text-ink-muted hover:bg-white/10 hover:text-ink-text disabled:opacity-30";

const Builder = () => {
  const t = useCopy(COPY);
  const [page, setPage] = useState([
    { id: 1, type: "slider" },
    { id: 2, type: "content" },
    { id: 3, type: "testimonial" },
  ]);
  const [lang, setLang] = useState("en");
  const move = (i, d) =>
    setPage((p) => {
      const q = [...p];
      [q[i], q[i + d]] = [q[i + d], q[i]];
      return q;
    });

  return (
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
        <Pick
          label={t.language}
          options={[
            ["en", "EN"],
            ["de", "DE"],
          ]}
          value={lang}
          onChange={setLang}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        {/* the admin side: the page's blocks, in order */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            {t.admin}
          </div>
          {page.map((b, i) => (
            <div
              key={b.id}
              className="flex items-center gap-1 rounded border border-[#2e313a] bg-[#1e2026] py-1 pl-2.5 pr-1 text-[12px] text-ink-text"
            >
              <span className="flex-1 truncate">{t.blocks[b.type]}</span>
              <button
                type="button"
                aria-label={t.up}
                className={tool}
                disabled={!i}
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={t.down}
                className={tool}
                disabled={i === page.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                aria-label={t.remove}
                className={tool}
                onClick={() => setPage((p) => p.filter((x) => x.id !== b.id))}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.keys(BLOCKS).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPage((p) => [...p, { id: Date.now(), type }])}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-ink-text hover:bg-white/15"
              >
                + {t.blocks[type]}
              </button>
            ))}
          </div>
        </div>
        {/* the live side: what visitors get */}
        <div className="flex min-h-[180px] flex-col gap-2 rounded-md border border-[#2e313a] bg-[#1e2026] p-2">
          {page.length ? (
            page.map((b) => <Preview key={b.id} type={b.type} lang={lang} />)
          ) : (
            <p className="m-auto text-[11px] text-ink-muted">{t.empty}</p>
          )}
        </div>
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "Django",
  "Mezzanine",
  "Sass",
  "Bulma",
  "GSAP",
  "Gulp",
  "HubSpot",
];

const Sites = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        stats={t.stats}
        kicker="p≡p → Planck Security · 2018–2024"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <H>{t.versionsH}</H>
      <Eras />
      <H>{t.archiveH}</H>
      <Shots
        wide
        items={ARCHIVE.map(([src, href], i) => [src, t.archive[i], href])}
      />
      <H>{t.blocksH}</H>
      <p className="mb-4">{t.blocksP}</p>
      <Builder />
      <H>{t.builtH}</H>
      <Bullets items={t.bullets} />
      <H>{t.utmH}</H>
      <Snippet file="campaigns/middleware.py" language="python" code={UTM} />
      <H>{t.trialH}</H>
      <Snippet file="contacts/views.py" language="python" code={TRIAL} />
    </Article>
  );
};

export default Sites;
