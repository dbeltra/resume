import React, { useState } from "react";
import {
  Article,
  H,
  Intro,
  Pick,
  Prose,
  Shots,
  Snippet,
  useCopy,
} from "./ui";
import ShopShot from "../../assets/images/archive/shop-2020.jpg";
import DonateShot from "../../assets/images/archive/donate-2020.jpg";

const ARCHIVE = [
  [
    ShopShot,
    "https://web.archive.org/web/20200927135340/https://www.pep.security/shop/",
  ],
  [
    DonateShot,
    "https://web.archive.org/web/20200927141452/https://www.pep.security/donate/",
  ],
];

// The p≡p licence shop. The real code is closed source, so the snippets are
// rewritten and simplified for this page, never copied from the repos.

const TAX = `# The seller is German, so the VAT on an invoice depends on who's
# buying and where. VAT IDs are checked live against the EU's VIES
# service before we trust them. Rates have start and end dates, so a
# change in the law is a new row, not a code change.
def client_tax(country: str, vat_id: str | None) -> TaxRule:
    if country == "DE":
        return TaxRule(rate=current_rate("DE"))       # domestic sale
    if country in EU and vat_id and vies.is_valid(vat_id):
        return TaxRule(rate=0, note=REVERSE_CHARGE)   # the buyer accounts for it
    if country in EU:
        return TaxRule(rate=current_rate("DE"))       # EU consumer
    return TaxRule(rate=0)                            # outside the EU`;

const COPY = {
  en: {
    builtH: "What I did",
    vatH: "Who pays the VAT",
    archiveH: "The shop in 2020",
    built: [
      "I built the shop and ran it for three years, mostly on my own. Crypto came first, through a gateway that signs its requests and takes six coins, then PayPal. Cards moved to Stripe PaymentIntents with 3-D Secure a few weeks before the PSD2 deadline in September 2019. It was a lot of responsibility for one person, but we never had a problem with licences or payments.",
      "Licences were sold per seat, monthly, yearly or until a fixed date, with discount codes, and a renewal adds to whatever time is left. Every purchase ends in the same confirm() step: it extends the subscription, syncs the licence service, draws a PDF invoice with ReportLab, archives it by month and emails the receipt with a signed download link. A daily job clears abandoned payments and reminds people before a licence runs out.",
      "Later the p≡p foundation wanted a donations page, so I cut the same pipeline down to a form for any amount, with PDF receipts. I also built a token-protected API that fed the sales numbers into a reports dashboard.",
    ],
    buyers: {
      de: { label: "German company", why: "A domestic sale: German VAT." },
      eu: {
        label: "EU company",
        why: "VAT ID checked against VIES. No VAT charged; the buyer accounts for it at home.",
        note: "Reverse charge: VAT is due from the recipient of the service.",
      },
      consumer: {
        label: "EU consumer",
        why: "No VAT ID, so German VAT applies.",
      },
      world: { label: "Outside the EU", why: "Not taxable in the EU." },
    },
    who: "Who’s buying?",
    invoice: [
      "INVOICE",
      "example · made-up numbers",
      "p≡p for Outlook · 1 year",
      "Net",
      "VAT",
      "Total",
    ],
    title: "Licence shop, payments and invoicing",
    pitch:
      "The web shop that sold p≡p for Outlook: subscriptions per seat, three ways to pay, EU VAT done right, and a PDF invoice and download link the moment the money arrived.",
    problem:
      "p≡p sold its email encryption to companies and individuals. That meant card payments under Europe’s new strong-authentication rules, crypto and PayPal alongside them, and a different VAT answer depending on who was buying and from where.",
    vat: "Selling from Germany, the tax on an invoice depends on the buyer. Pick one and see what the invoice would say:",
    archive: [
      "The shop, September 2020: seats, plan and the VAT worked out live",
      "The donations page, September 2020: the same pipeline, any amount",
    ],
  },
  es: {
    builtH: "Lo que hice",
    vatH: "Quién paga el IVA",
    archiveH: "La tienda en 2020",
    built: [
      "Construí la tienda y la mantuve tres años, casi siempre yo solo. Primero vino la cripto, con una pasarela que firma las peticiones y acepta seis monedas, y luego PayPal. Las tarjetas pasaron a Stripe PaymentIntents con 3-D Secure unas semanas antes del plazo de la PSD2, en septiembre de 2019. Era mucha responsabilidad para una sola persona, pero nunca tuvimos un problema con las licencias ni con los pagos.",
      "Las licencias se vendían por puesto, mensuales, anuales o hasta una fecha fija, con códigos de descuento, y una renovación se suma al tiempo que queda. Cada compra acaba en el mismo paso confirm(): alarga la suscripción, sincroniza el servicio de licencias, dibuja la factura en PDF con ReportLab, la archiva por mes y envía el recibo con un enlace de descarga firmado. Una tarea diaria limpia los pagos abandonados y avisa antes de que caduque una licencia.",
      "Más tarde la fundación p≡p quiso una página de donaciones, así que recorté el mismo flujo a un formulario de importe libre, con recibos en PDF. También hice una API protegida con token que pasaba las ventas a un panel de informes.",
    ],
    buyers: {
      de: { label: "Empresa alemana", why: "Una venta nacional: IVA alemán." },
      eu: {
        label: "Empresa de la UE",
        why: "NIF-IVA comprobado en VIES. Sin IVA; el comprador lo declara en su país.",
        note: "Inversión del sujeto pasivo: el IVA lo debe el destinatario del servicio.",
      },
      consumer: {
        label: "Particular de la UE",
        why: "Sin NIF-IVA, así que se aplica el IVA alemán.",
      },
      world: { label: "Fuera de la UE", why: "No sujeto a IVA en la UE." },
    },
    who: "¿Quién compra?",
    invoice: [
      "FACTURA",
      "ejemplo · cifras inventadas",
      "p≡p for Outlook · 1 año",
      "Base",
      "IVA",
      "Total",
    ],
    title: "Tienda de licencias, pagos y facturación",
    pitch:
      "La tienda online que vendía p≡p for Outlook: suscripciones por puesto, tres formas de pago, el IVA europeo bien hecho, y una factura en PDF y un enlace de descarga en cuanto llegaba el dinero.",
    problem:
      "p≡p vendía su cifrado de correo a empresas y particulares. Eso suponía pagos con tarjeta bajo las nuevas normas europeas de autenticación reforzada, cripto y PayPal a la vez, y un IVA distinto según quién comprara y desde dónde.",
    vat: "Vendiendo desde Alemania, el impuesto de una factura depende del comprador. Elige uno y mira qué diría la factura:",
    archive: [
      "La tienda, septiembre de 2020: puestos, plan y el IVA calculado al momento",
      "La página de donaciones, septiembre de 2020: el mismo flujo, cualquier importe",
    ],
  },
  ca: {
    builtH: "El que vaig fer",
    vatH: "Qui paga l’IVA",
    archiveH: "La botiga el 2020",
    built: [
      "Vaig construir la botiga i la vaig mantenir tres anys, gairebé sempre jo sol. Primer va venir la cripto, amb una passarel·la que signa les peticions i accepta sis monedes, i després PayPal. Les targetes van passar a Stripe PaymentIntents amb 3-D Secure unes setmanes abans del termini de la PSD2, el setembre de 2019. Era molta responsabilitat per a una sola persona, però mai no vam tenir cap problema amb les llicències ni amb els pagaments.",
      "Les llicències es venien per lloc, mensuals, anuals o fins a una data fixa, amb codis de descompte, i una renovació se suma al temps que queda. Cada compra acaba al mateix pas confirm(): allarga la subscripció, sincronitza el servei de llicències, dibuixa la factura en PDF amb ReportLab, l’arxiva per mes i envia el rebut amb un enllaç de descàrrega signat. Una tasca diària neteja els pagaments abandonats i avisa abans que caduqui una llicència.",
      "Més endavant la fundació p≡p va voler una pàgina de donacions, així que vaig retallar el mateix flux a un formulari d’import lliure, amb rebuts en PDF. També vaig fer una API protegida amb token que passava les vendes a un tauler d’informes.",
    ],
    buyers: {
      de: {
        label: "Empresa alemanya",
        why: "Una venda nacional: IVA alemany.",
      },
      eu: {
        label: "Empresa de la UE",
        why: "NIF-IVA comprovat a VIES. Sense IVA; el comprador el declara al seu país.",
        note: "Inversió del subjecte passiu: l’IVA el deu el destinatari del servei.",
      },
      consumer: {
        label: "Particular de la UE",
        why: "Sense NIF-IVA, així que s’aplica l’IVA alemany.",
      },
      world: { label: "Fora de la UE", why: "No subjecte a IVA a la UE." },
    },
    who: "Qui compra?",
    invoice: [
      "FACTURA",
      "exemple · xifres inventades",
      "p≡p for Outlook · 1 any",
      "Base",
      "IVA",
      "Total",
    ],
    title: "Botiga de llicències, pagaments i facturació",
    pitch:
      "La botiga en línia que venia p≡p for Outlook: subscripcions per lloc, tres maneres de pagar, l’IVA europeu ben fet, i una factura en PDF i un enllaç de descàrrega tan bon punt arribaven els diners.",
    problem:
      "p≡p venia el seu xifratge de correu a empreses i particulars. Això volia dir pagaments amb targeta sota les noves normes europees d’autenticació reforçada, cripto i PayPal alhora, i un IVA diferent segons qui comprava i des d’on.",
    vat: "Venent des d’Alemanya, l’impost d’una factura depèn del comprador. Tria’n un i mira què diria la factura:",
    archive: [
      "La botiga, setembre de 2020: llocs, pla i l’IVA calculat al moment",
      "La pàgina de donacions, setembre de 2020: el mateix flux, qualsevol import",
    ],
  },
};

// --- the VAT invoice ---------------------------------------------------------

const BUYERS = { de: 19, eu: 0, consumer: 19, world: 0 }; // VAT %; text in COPY
const NET = 100; // made-up example price
const eur = (n) => `€${n.toFixed(2)}`;

const Invoice = () => {
  const [who, setWho] = useState("eu");
  const t = useCopy(COPY);
  const b = { ...t.buyers[who], rate: BUYERS[who] };
  const vat = (NET * b.rate) / 100;

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-p-muted">
        <Pick
          label={t.who}
          options={Object.keys(BUYERS).map((k) => [k, t.buyers[k].label])}
          value={who}
          onChange={setWho}
        />
      </div>
      <p className="mb-3 px-1 text-[13px] text-p-fg">{b.why}</p>
      {/* a paper invoice, like the ReportLab PDF */}
      <div className="mx-auto max-w-[420px] rounded-md bg-[#f6f4ef] p-5 font-mono text-[11px] leading-relaxed text-[#2b2c30] shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] font-bold">{t.invoice[0]}</span>
          <span className="text-[#77736b]">{t.invoice[1]}</span>
        </div>
        <div className="mt-3 flex justify-between border-b border-dashed border-[#c9c4b8] pb-2">
          <span>{t.invoice[2]}</span>
          <span>{eur(NET)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span>{t.invoice[3]}</span>
          <span>{eur(NET)}</span>
        </div>
        <div className="flex justify-between">
          <span>
            {t.invoice[4]} {b.rate}%
          </span>
          <span>{eur(vat)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-[#2b2c30] pt-1 font-bold">
          <span>{t.invoice[5]}</span>
          <span>{eur(NET + vat)}</span>
        </div>
        {b.note && (
          <p className="mt-3 text-[10px] italic text-[#5d5950]">{b.note}</p>
        )}
      </div>
    </figure>
  );
};

const STACK = [
  "Python",
  "Django",
  "Mezzanine",
  "Stripe",
  "PayPal",
  "ReportLab",
  "JavaScript",
];

const Shop = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="p≡p Security · 2019–2022"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <p className="mt-6">{t.problem}</p>
      <H>{t.archiveH}</H>
      <Shots
        wide
        items={ARCHIVE.map(([src, href], i) => [src, t.archive[i], href])}
      />
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.vatH}</H>
      <p className="mb-4">{t.vat}</p>
      <Invoice />
      <div className="mt-4">
        <Snippet file="tax.py" language="python" code={TAX} />
      </div>
    </Article>
  );
};

export default Shop;
