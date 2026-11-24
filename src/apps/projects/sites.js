import React from "react";
import {
  Article,
  H,
  Intro,
  Prose,
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
    builtH: "The CMS and around it",
    trialH: "Trial signups",
    built: [
      "I set up Mezzanine and wrote every custom app on top of it: the page blocks, each with its own fields in every language, a jobs board and the theme. From then on editors built their own pages in the admin. The lead forms (e-books, demos, call requests) used double opt-in with a signed confirmation link and went straight to the CRM, and a small middleware recorded which campaign brought each visit and kept that on our own server.",
      "It was fun to build: a way for people at the company to edit the website themselves, like a CMS, while staying on open source. The hard part was bugs. Mezzanine’s community was small, so when I ran into one I usually had to fix it myself and send the fix upstream to the project.",
      "For the Planck rebrand I rebuilt it with rate-limited trial signups, signed download links, HubSpot sync, and a token-protected API the back office pulled trials and downloads from.",
      "Around the main site there were smaller ones: a sister site for p≡p software, a login-gated data room for investors, a contributor agreement registry for the p≡p foundation and a nomination site for the Big Brother Awards. The shop was part of it too.",
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
    title: "Company websites, from static to CMS",
    pitch:
      "I joined p≡p to look after its website and stayed for over five years: I moved it from static HTML to a CMS editors could run themselves, redesigned it, and rebuilt it for the Planck rebrand.",
    versionsH: "Four versions",
    archiveH: "As the Internet Archive kept them",
    archive: [
      "pep.security, May 2018: the agency’s static page, before me",
      "pep.security, July 2019: on Mezzanine",
      "planck.security, July 2023: the Planck rebuild",
    ],
  },
  es: {
    builtH: "El CMS y lo que lo rodea",
    trialH: "Altas de prueba",
    built: [
      "Monté Mezzanine y escribí todas las apps propias encima: los bloques de página, cada uno con sus campos en todos los idiomas, una bolsa de empleo y el tema. Desde entonces los editores montaban sus propias páginas desde el admin. Los formularios de captación (e-books, demos, peticiones de llamada) usaban doble opt-in con un enlace de confirmación firmado e iban directos al CRM, y un pequeño middleware apuntaba qué campaña había traído cada visita y lo guardaba en nuestro propio servidor.",
      "Fue divertido de hacer: una forma de que la gente de la empresa editara la web por su cuenta, como en un CMS, sin salir del software libre. Lo difícil eran los bugs. Mezzanine tenía una comunidad pequeña, así que cuando me encontraba uno casi siempre tenía que arreglarlo yo y mandar el arreglo al proyecto.",
      "Para el cambio de marca a Planck la rehíce con altas de prueba con límite de peticiones, enlaces de descarga firmados, sincronización con HubSpot y una API protegida con token de la que el back office sacaba pruebas y descargas.",
      "Alrededor de la web principal había otras más pequeñas: una web hermana para el software de p≡p, una data room con login para inversores, un registro de acuerdos de contribución para la fundación p≡p y una web de nominaciones para los Big Brother Awards. La tienda también formaba parte.",
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
    title: "Webs de empresa, de estáticas a CMS",
    pitch:
      "Entré en p≡p para encargarme de su web y me quedé más de cinco años: la pasé de HTML estático a un CMS que los editores podían llevar solos, la rediseñé y la rehíce para el cambio de marca a Planck.",
    versionsH: "Cuatro versiones",
    archiveH: "Tal como las guardó el Internet Archive",
    archive: [
      "pep.security, mayo de 2018: la página estática de la agencia, antes de mí",
      "pep.security, julio de 2019: ya en Mezzanine",
      "planck.security, julio de 2023: la web de Planck",
    ],
  },
  ca: {
    builtH: "El CMS i el que l’envolta",
    trialH: "Altes de prova",
    built: [
      "Vaig muntar Mezzanine i vaig escriure totes les apps pròpies a sobre: els blocs de pàgina, cadascun amb els seus camps en tots els idiomes, una borsa de feina i el tema. Des d’aleshores els editors muntaven les seves pàgines des de l’admin. Els formularis de captació (e-books, demos, peticions de trucada) feien servir doble opt-in amb un enllaç de confirmació signat i anaven directes al CRM, i un petit middleware apuntava quina campanya havia portat cada visita i ho desava al nostre propi servidor.",
      "Va ser divertit de fer: una manera perquè la gent de l’empresa pogués editar la web pel seu compte, com en un CMS, sense sortir del programari lliure. El difícil eren els bugs. Mezzanine tenia una comunitat petita, així que quan me’n trobava un gairebé sempre l’havia d’arreglar jo i enviar l’arranjament al projecte.",
      "Per al canvi de marca a Planck la vaig refer amb altes de prova amb límit de peticions, enllaços de descàrrega signats, sincronització amb HubSpot i una API protegida amb token d’on el back office treia proves i descàrregues.",
      "Al voltant de la web principal n’hi havia d’altres de més petites: una web germana per al programari de p≡p, una data room amb login per a inversors, un registre d’acords de contribució per a la fundació p≡p i una web de nominacions per als Big Brother Awards. La botiga també en formava part.",
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
    title: "Webs d’empresa, d’estàtiques a CMS",
    pitch:
      "Vaig entrar a p≡p per encarregar-me del web i m’hi vaig quedar més de cinc anys: el vaig passar d’HTML estàtic a un CMS que els editors podien portar sols, el vaig redissenyar i el vaig refer per al canvi de marca a Planck.",
    versionsH: "Quatre versions",
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
          className="relative rounded-lg border border-p-line bg-p-sunk p-3"
        >
          <div className="text-[11px] font-semibold text-p-pop-text">
            {YEARS[i]}
          </div>
          <div className="text-[13px] font-semibold text-p-fg">{title}</div>
          <p className="mt-1 text-[12px] leading-snug text-p-muted">{text}</p>
          {i === 0 && (
            <span className="mt-2 inline-block rounded-full bg-p-fg/10 px-1.5 py-px text-[9px] uppercase tracking-[0.12em] text-p-muted">
              {t.beforeMe}
            </span>
          )}
        </li>
      ))}
    </ol>
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
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.trialH}</H>
      <Snippet file="contacts/views.py" language="python" code={TRIAL} />
    </Article>
  );
};

export default Sites;
