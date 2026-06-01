import type { StoreLegalConfig } from "../domain/storeConfig";

interface FooterProps {
  config: StoreLegalConfig;
}

export function Footer({ config }: FooterProps) {
  const seller = config.legalName || `${config.storeName} - dane firmy do uzupelnienia`;
  const email = config.email || "kontakt do uzupelnienia";

  return (
    <footer className="site-footer">
      <div>
        <a className="footer-brand" href="#home">
          {config.storeName}
        </a>
        <p>{seller}</p>
        <p>{email}</p>
      </div>
      <nav aria-label="Dokumenty sklepu">
        <a href={config.termsUrl}>Regulamin</a>
        <a href={config.privacyUrl}>Polityka prywatności</a>
        <a href="#zwroty-i-reklamacje">Zwroty i reklamacje</a>
        <a href="#dostawa-i-platnosci">Dostawa i płatności</a>
      </nav>
    </footer>
  );
}
