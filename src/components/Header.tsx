import { ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  admin?: boolean;
}

export function Header({ cartCount, onCartOpen, admin = false }: HeaderProps) {
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
      <nav aria-label="Główna nawigacja">
        <a href="#catalog">Katalog</a>
        <a href="#seo">Zestawy</a>
        <a href="#routine">Rutyny</a>
        {admin && <a href="#import">Hurtownia</a>}
        <a href="#dokumenty">Regulamin</a>
      </nav>
      <button className="icon-button" type="button" onClick={onCartOpen} aria-label="Otwórz koszyk">
        <ShoppingBag size={20} />
        <span>{cartCount}</span>
      </button>
    </header>
  );
}
