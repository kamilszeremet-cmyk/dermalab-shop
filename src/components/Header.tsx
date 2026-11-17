import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { anchorHref } from "../domain/route";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  admin?: boolean;
  anchorPrefix?: string;
}

export function Header({ cartCount, onCartOpen, admin = false, anchorPrefix = "" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const link = (href: string) => anchorHref(href, anchorPrefix);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="DermaLab home">
        <svg
          className="brand-logo-svg"
          viewBox="0 0 224 52"
          role="img"
          aria-labelledby="brand-logo-title"
          data-testid="brand-logo-svg"
        >
          <title id="brand-logo-title">DermaLab</title>
          <g className="brand-logo-lines">
            <path d="M11.5 9.5h14.8c11.7 0 19.8 7.1 19.8 16.5s-8.1 16.5-19.8 16.5H11.5v-33Z" />
            <path className="brand-logo-accent-stroke" d="M28.5 16.5v19" />
            <path className="brand-logo-accent-stroke" d="M21.5 26h14" />
          </g>
          <text x="62" y="33">DermaLab</text>
        </svg>
      </a>
      <nav id="main-nav" aria-label="Główna nawigacja" className={menuOpen ? "open" : undefined} onClick={() => setMenuOpen(false)}>
        <a href={link("#catalog")}>Katalog</a>
        <a href={link("#seo")}>Zestawy</a>
        <a href={link("#routine")}>Rutyny</a>
        {admin && <a href={link("#import")}>Hurtownia</a>}
        <a href={link("#dokumenty")}>Regulamin</a>
      </nav>
      <button
        className="icon-button nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <button className="icon-button" type="button" onClick={onCartOpen} aria-label="Otwórz koszyk">
        <ShoppingBag size={20} />
        <span>{cartCount}</span>
      </button>
    </header>
  );
}
