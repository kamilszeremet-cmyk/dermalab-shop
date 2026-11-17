import type { CookieConsent, CookieConsentChoice } from "../domain/cookieConsent";

interface CookieConsentBannerProps {
  consent: CookieConsent;
  onChoose: (choice: CookieConsentChoice) => void;
  hidden?: boolean;
}

export function CookieConsentBanner({ consent, onChoose, hidden = false }: CookieConsentBannerProps) {
  if (consent.status !== "pending" || hidden) return null;

  return (
    <section className="cookie-banner" aria-label="Zgody cookies">
      <div>
        <h2>Zgody cookies</h2>
        <p>
          Używamy cookies technicznych do działania koszyka. Analityka GA4 i Meta Pixel uruchomią się dopiero po
          akceptacji.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" onClick={() => onChoose("essential")}>
          Tylko niezbędne
        </button>
        <button type="button" onClick={() => onChoose("all")}>
          Akceptuję wszystkie
        </button>
      </div>
    </section>
  );
}
