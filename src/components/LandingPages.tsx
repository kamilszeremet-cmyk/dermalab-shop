import type { LandingPage } from "../domain/landing";

interface LandingPagesProps {
  pages: LandingPage[];
  onSelect: (page: LandingPage) => void;
  admin?: boolean;
}

export function LandingPages({ pages, onSelect, admin = false }: LandingPagesProps) {
  return (
    <section className="section landing-section" id="seo">
      <div className="section-heading">
        <p className="section-label">Zestawy</p>
        <h2>Wybierz zestaw do swojego problemu</h2>
      </div>
      <div className="landing-grid">
        {pages.map((page) => (
          <article className="landing-card" key={page.id}>
            <div>
              {admin && <p className="landing-kicker">{page.marginSignal}</p>}
              <h3>{page.title}</h3>
              <p>{page.subtitle}</p>
            </div>
            <ul className="tag-list">
              {page.proofPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <button type="button" onClick={() => onSelect(page)}>
              Zobacz zestaw: {page.concern}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
