import React, { useState } from "react";
import { prefersReducedMotion } from "../../components/genie";
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

const CONFIRM = `class Payment(models.Model):
    def confirm(self):
        """Every provider ends here: Stripe's webhook, PayPal's IPN and the
        crypto gateway's callback all call confirm() once the money is in."""
        self.confirmed = True
        self.save()

        sub = self.subscription
        # renewing early stacks the new period on top of what's left
        start = max(sub.ends_on or today(), today())
        sub.ends_on = start + self.period
        sub.save()

        licences.sync(sub)               # the app checks its seats against this
        pdf = invoices.render(self)      # drawn with ReportLab, archived by month
        mail.receipt(self, pdf, download=signed_link(self))
        mail.accounting_copy(self, pdf)`;

const COPY = {
  en: {
    providers: {
      card: "card · 3-D Secure",
      crypto: ["Crypto gateway", "6 coins · signed"],
    },
    outputs: [
      ["Subscription", "extended"],
      ["Licence API", "seats synced"],
      ["PDF invoice", "archived"],
      ["Email", "receipt + link"],
    ],
    checkout: ["Checkout", "Mezzanine page"],
    charge: ["Charge", "tax + VIES check"],
    confirm: "one path for all",
    payWith: "Pay with:",
    card: "card",
    crypto: "crypto",
    aria: "The checkout posts the order to the charge step, which works out the tax and checks the VAT ID. The payment then goes through Stripe with 3-D Secure, PayPal or a crypto gateway. All three end in the same confirm step, which extends the subscription, syncs the licence service, archives a PDF invoice and emails the receipt with a download link.",
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
    problemH: "The problem",
    problem:
      "p≡p sold its email encryption to companies and individuals. That meant card payments under Europe’s new strong-authentication rules, crypto and PayPal alongside them, and a different VAT answer depending on who was buying and from where.",
    pathH: "One path for every payment",
    path: "The checkout lives on the site’s CMS pages. Whatever the payment method, the money ends up in the same confirm() step, which does everything a purchase needs. Pick a method and follow it:",
    builtH: "What I built",
    built: "I built the shop and ran it for three years, almost single-handed:",
    bullets: [
      [
        "Payments.",
        "Crypto came first, through a gateway with signed requests for six coins, then PayPal. Cards moved to Stripe PaymentIntents with 3-D Secure weeks before the EU’s PSD2 deadline in September 2019.",
      ],
      [
        "Subscriptions.",
        "Per-seat tiers, monthly, yearly or fixed-end plans, discount codes, and renewals that stack on top of the time left.",
      ],
      [
        "Invoices.",
        "PDFs drawn with ReportLab, emailed to the customer, copied to accounting and archived by month. Download links are signed, so they can’t be guessed.",
      ],
      [
        "Housekeeping.",
        "A daily job clears abandoned payments and sends renewal reminders before a licence runs out.",
      ],
      [
        "Reuse.",
        "When the p≡p foundation needed a donations page, I cut the same pipeline down to a custom-amount form with PDF receipts. Later, a token-protected API fed the sales numbers to a reports dashboard I also built.",
      ],
    ],
    vatH: "EU VAT, without the headache",
    vat: "Selling from Germany, the tax on an invoice depends on the buyer. Pick one and see what the invoice would say:",
    confirmH: "What confirm() does",
  },
  es: {
    providers: {
      card: "tarjeta · 3-D Secure",
      crypto: ["Pasarela cripto", "6 monedas · firmado"],
    },
    outputs: [
      ["Suscripción", "ampliada"],
      ["API de licencias", "puestos sincronizados"],
      ["Factura PDF", "archivada"],
      ["Email", "recibo + enlace"],
    ],
    checkout: ["Checkout", "página de Mezzanine"],
    charge: ["Cobro", "IVA + VIES"],
    confirm: "un camino para todos",
    payWith: "Pagar con:",
    card: "tarjeta",
    crypto: "cripto",
    aria: "El checkout envía el pedido al paso de cobro, que calcula el IVA y comprueba el NIF-IVA. Después el pago pasa por Stripe con 3-D Secure, PayPal o una pasarela cripto. Los tres acaban en el mismo paso de confirmación, que amplía la suscripción, sincroniza el servicio de licencias, archiva una factura en PDF y envía por email el recibo con un enlace de descarga.",
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
    problemH: "El problema",
    problem:
      "p≡p vendía su cifrado de correo a empresas y particulares. Eso suponía pagos con tarjeta bajo las nuevas normas europeas de autenticación reforzada, cripto y PayPal a la vez, y un IVA distinto según quién comprara y desde dónde.",
    pathH: "Un solo camino para cada pago",
    path: "El checkout vive en las páginas del CMS de la web. Sea cual sea el método de pago, el dinero acaba en el mismo paso confirm(), que hace todo lo que necesita una compra. Elige un método y síguelo:",
    builtH: "Lo que construí",
    built: "Construí la tienda y la mantuve durante tres años, casi yo solo:",
    bullets: [
      [
        "Pagos.",
        "Primero llegó la cripto, con una pasarela de peticiones firmadas para seis monedas, y después PayPal. Las tarjetas pasaron a Stripe PaymentIntents con 3-D Secure semanas antes del plazo de la PSD2 en septiembre de 2019.",
      ],
      [
        "Suscripciones.",
        "Planes por puesto, mensuales, anuales o con fecha de fin, códigos de descuento, y renovaciones que se suman al tiempo que queda.",
      ],
      [
        "Facturas.",
        "PDFs dibujados con ReportLab, enviados al cliente, con copia a contabilidad y archivados por mes. Los enlaces de descarga van firmados, así que no se pueden adivinar.",
      ],
      [
        "Mantenimiento.",
        "Una tarea diaria limpia los pagos abandonados y envía recordatorios antes de que caduque una licencia.",
      ],
      [
        "Reutilización.",
        "Cuando la fundación p≡p necesitó una página de donaciones, recorté el mismo flujo a un formulario de importe libre con recibos en PDF. Más tarde, una API protegida con token alimentaba con las ventas un panel de informes que también construí.",
      ],
    ],
    vatH: "El IVA europeo, sin dolores de cabeza",
    vat: "Vendiendo desde Alemania, el impuesto de una factura depende del comprador. Elige uno y mira qué diría la factura:",
    confirmH: "Qué hace confirm()",
  },
  ca: {
    providers: {
      card: "targeta · 3-D Secure",
      crypto: ["Passarel·la cripto", "6 monedes · signat"],
    },
    outputs: [
      ["Subscripció", "ampliada"],
      ["API de llicències", "llocs sincronitzats"],
      ["Factura PDF", "arxivada"],
      ["Correu", "rebut + enllaç"],
    ],
    checkout: ["Checkout", "pàgina de Mezzanine"],
    charge: ["Cobrament", "IVA + VIES"],
    confirm: "un camí per a tots",
    payWith: "Paga amb:",
    card: "targeta",
    crypto: "cripto",
    aria: "El checkout envia la comanda al pas de cobrament, que calcula l’IVA i comprova el NIF-IVA. Després el pagament passa per Stripe amb 3-D Secure, PayPal o una passarel·la cripto. Tots tres acaben al mateix pas de confirmació, que amplia la subscripció, sincronitza el servei de llicències, arxiva una factura en PDF i envia per correu el rebut amb un enllaç de descàrrega.",
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
    problemH: "El problema",
    problem:
      "p≡p venia el seu xifratge de correu a empreses i particulars. Això volia dir pagaments amb targeta sota les noves normes europees d’autenticació reforçada, cripto i PayPal alhora, i un IVA diferent segons qui comprava i des d’on.",
    pathH: "Un sol camí per a cada pagament",
    path: "El checkout viu a les pàgines del CMS del web. Sigui quin sigui el mètode de pagament, els diners acaben al mateix pas confirm(), que fa tot el que necessita una compra. Tria un mètode i segueix-lo:",
    builtH: "El que vaig construir",
    built:
      "Vaig construir la botiga i la vaig mantenir durant tres anys, gairebé tot sol:",
    bullets: [
      [
        "Pagaments.",
        "Primer va arribar la cripto, amb una passarel·la de peticions signades per a sis monedes, i després PayPal. Les targetes van passar a Stripe PaymentIntents amb 3-D Secure setmanes abans del termini de la PSD2 el setembre de 2019.",
      ],
      [
        "Subscripcions.",
        "Plans per lloc, mensuals, anuals o amb data de fi, codis de descompte, i renovacions que se sumen al temps que queda.",
      ],
      [
        "Factures.",
        "PDF dibuixats amb ReportLab, enviats al client, amb còpia a comptabilitat i arxivats per mes. Els enllaços de descàrrega van signats, així que no es poden endevinar.",
      ],
      [
        "Manteniment.",
        "Una tasca diària neteja els pagaments abandonats i envia recordatoris abans que caduqui una llicència.",
      ],
      [
        "Reutilització.",
        "Quan la fundació p≡p va necessitar una pàgina de donacions, vaig retallar el mateix flux a un formulari d’import lliure amb rebuts en PDF. Més endavant, una API protegida amb token alimentava amb les vendes un tauler d’informes que també vaig construir.",
      ],
    ],
    vatH: "L’IVA europeu, sense maldecaps",
    vat: "Venent des d’Alemanya, l’impost d’una factura depèn del comprador. Tria’n un i mira què diria la factura:",
    confirmH: "Què fa confirm()",
  },
};

// --- the payment diagram ----------------------------------------------------

// provider boxes, by the code the checkout posts: [y, label, sub]
const PROVIDERS = {
  card: [40, "Stripe"],
  paypal: [136, "PayPal", "IPN"], // text for card and crypto is in COPY
  crypto: [232],
};
const OUTPUTS = [40, 110, 180, 250]; // y of each box; text in COPY
// the money's trip to confirm(), then one dot per thing confirm() does; all
// share one 5 s cycle so the fan-out starts when the payment lands
const SPLIT = "0.6";

const ShopDiagram = () => {
  const [via, setVia] = useState("card");
  const still = prefersReducedMotion();
  const t = useCopy(COPY);
  const py = PROVIDERS[via][0] + 24;
  const provider = (k) =>
    k === "card"
      ? ["Stripe", t.providers.card]
      : k === "crypto"
        ? t.providers.crypto
        : PROVIDERS[k].slice(1);

  return (
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
        <Pick
          label={t.payWith}
          options={[
            ["card", t.card],
            ["paypal", "PayPal"],
            ["crypto", t.crypto],
          ]}
          value={via}
          onChange={setVia}
        />
      </div>
      <div className="overflow-x-auto">
        <svg
          key={via}
          viewBox="0 0 800 300"
          role="img"
          aria-label={t.aria}
          className="min-w-[600px]"
        >
          <ArrowDefs />
          <Edge d="M140 160 H178" />
          {Object.values(PROVIDERS).map(([y]) => (
            <React.Fragment key={y}>
              <Edge d={`M310 160 H330 V${y + 24} H348`} />
              <Edge d={`M490 ${y + 24} H510 V160 H528`} />
            </React.Fragment>
          ))}
          {OUTPUTS.map((y) => (
            <Edge key={y} d={`M640 160 H655 V${y + 20} H668`} />
          ))}
          <Box
            x={20}
            y={136}
            w={120}
            label={t.checkout[0]}
            sub={t.checkout[1]}
          />
          <Box
            x={180}
            y={130}
            w={130}
            h={60}
            label={t.charge[0]}
            sub={t.charge[1]}
          />
          {Object.entries(PROVIDERS).map(([k, [y]]) => (
            <Box
              key={k}
              x={350}
              y={y}
              w={140}
              label={provider(k)[0]}
              sub={provider(k)[1]}
              accent={k === via}
            />
          ))}
          <Box
            x={530}
            y={130}
            w={110}
            h={60}
            label="confirm()"
            sub={t.confirm}
            accent
          />
          {OUTPUTS.map((y, i) => (
            <Box
              key={y}
              x={670}
              y={y}
              w={120}
              h={40}
              label={t.outputs[i][0]}
              sub={t.outputs[i][1]}
            />
          ))}
          {!still && (
            <>
              <circle r="7" fill="#f5c451" stroke="#191b20" strokeWidth="2">
                <animateMotion
                  dur="5s"
                  repeatCount="indefinite"
                  path={`M80 160 H330 V${py} H510 V160 H585`}
                  keyPoints="0;1;1"
                  keyTimes={`0;${SPLIT};1`}
                  calcMode="linear"
                />
                <animate
                  attributeName="opacity"
                  dur="5s"
                  repeatCount="indefinite"
                  values="1;1;0;0"
                  keyTimes={`0;${SPLIT};0.62;1`}
                />
              </circle>
              {OUTPUTS.map((y) => (
                <circle key={y} r="5" fill="#7fd1a8" opacity="0">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    path={`M585 160 H655 V${y + 20} H730`}
                    keyPoints="0;0;1;1"
                    keyTimes={`0;${SPLIT};0.9;1`}
                    calcMode="linear"
                  />
                  <animate
                    attributeName="opacity"
                    dur="5s"
                    repeatCount="indefinite"
                    values="0;0;1;1;0"
                    keyTimes={`0;${SPLIT};0.61;0.9;1`}
                  />
                </circle>
              ))}
            </>
          )}
        </svg>
      </div>
    </figure>
  );
};

// --- the VAT picker and its invoice ----------------------------------------

const BUYERS = { de: 19, eu: 0, consumer: 19, world: 0 }; // VAT %; text in COPY
const NET = 100; // made-up example price
const eur = (n) => `€${n.toFixed(2)}`;

const Invoice = () => {
  const [who, setWho] = useState("eu");
  const t = useCopy(COPY);
  const b = { ...t.buyers[who], rate: BUYERS[who] };
  const vat = (NET * b.rate) / 100;

  return (
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
        <Pick
          label={t.who}
          options={Object.keys(BUYERS).map((k) => [k, t.buyers[k].label])}
          value={who}
          onChange={setWho}
        />
      </div>
      <p className="mb-3 px-1 text-[13px] text-ink-text">{b.why}</p>
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
      <H>{t.problemH}</H>
      <p>{t.problem}</p>
      <H>{t.pathH}</H>
      <p className="mb-4">{t.path}</p>
      <ShopDiagram />
      <H>{t.builtH}</H>
      <p className="mb-2">{t.built}</p>
      <Bullets items={t.bullets} />
      <H>{t.vatH}</H>
      <p className="mb-4">{t.vat}</p>
      <Invoice />
      <div className="mt-4">
        <Snippet file="tax.py" language="python" code={TAX} />
      </div>
      <H>{t.confirmH}</H>
      <Snippet file="payments/models.py" language="python" code={CONFIRM} />
    </Article>
  );
};

export default Shop;
