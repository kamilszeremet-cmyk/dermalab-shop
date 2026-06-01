import type { StoreLegalConfig, StoreLegalStatus } from "../domain/storeConfig";
import type { TrackingConfig } from "../domain/tracking";

interface TrustAndLegalProps {
  config: StoreLegalConfig;
  status: StoreLegalStatus;
  trackingConfig: TrackingConfig;
}

const trustItems = [
  {
    title: "Zwroty i reklamacje",
    body: "Zakupy online mają ścieżkę odstąpienia od umowy w terminie 14 dni oraz obsługę reklamacji za niezgodność towaru z umową.",
  },
  {
    title: "Dostawa",
    body: "Koszyk liczy InPost Paczkomat, kuriera oraz darmową dostawę od 179 zł. Te same dane trafiają do payloadu checkoutu.",
  },
  {
    title: "Płatności",
    body: "Checkout jest przygotowany pod Stripe Checkout z kartą i Przelewy24. Endpoint produkcyjny działa jako funkcja serverless.",
  },
];

export function TrustAndLegal({ config, status, trackingConfig }: TrustAndLegalProps) {
  return (
    <section className="section trust-section" id="trust">
      <div className="section-heading">
        <p className="section-label">Zaufanie</p>
        <h2>Regulaminy, dostawa i bezpieczeństwo zakupów</h2>
        <p>
          Sekcja startowa pod sklep internetowy. Teksty są szkicem operacyjnym i powinny zostać sprawdzone przed
          publikacją produkcyjną.
        </p>
      </div>
      <div className="operations-grid">
        {trustItems.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
        <article>
          <h3>{status.ready ? "Dane firmy gotowe" : "Dane firmy do uzupełnienia"}</h3>
          <p>{config.legalName || config.storeName}</p>
          <p>NIP: {config.taxId || "brak"}</p>
          <p>Adres: {config.address || "brak"}</p>
          <p>E-mail: {config.email || "brak"}</p>
          {status.missingItems.length > 0 && (
            <ul>
              {status.missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </article>
        <article>
          <h3>Tracking reklam</h3>
          <p>
            GA4: {trackingConfig.ga4Id || "brak"}, Meta Pixel: {trackingConfig.metaPixelId || "brak"}.
          </p>
          <p>Eventy: view item, add to cart, begin checkout, purchase handoff.</p>
        </article>
        <article>
          <h3>Deployment</h3>
          <p>Gotowe pliki pod Vercel i Netlify: build Vite, SPA fallback i funkcja checkoutu.</p>
        </article>
      </div>
      <p className="legal-note">
        Źródła do finalnej weryfikacji: UOKiK Prawa Konsumenta oraz dokumentacja operatorów płatności i dostawy.
      </p>
    </section>
  );
}
