import type { StoreLegalConfig } from "../domain/storeConfig";

import { anchorHref } from "../domain/route";

interface FooterProps {
  config: StoreLegalConfig;
  anchorPrefix?: string;
}

export function Footer({ config, anchorPrefix = "" }: FooterProps) {
  const seller = config.legalName && config.legalName !== config.storeName ? config.legalName : "";
  const link = (href: string) => anchorHref(href, anchorPrefix);
  const email = config.email;

  return (
    <footer className="site-footer">
      <div>
        <a className="footer-brand" href={link("#home")}>
          {config.storeName}
        </a>
        {seller && <p>{seller}</p>}
        {email && <p>{email}</p>}
      </div>
      <nav aria-label="Dokumenty sklepu">
        <a href={link(config.termsUrl)}>Regulamin</a>
        <a href={link(config.privacyUrl)}>Polityka prywatności</a>
        <a href={link("#zwroty-i-reklamacje")}>Zwroty i reklamacje</a>
        <a href={link("#dostawa-i-platnosci")}>Dostawa i płatności</a>
      </nav>
    </footer>
  );
}
