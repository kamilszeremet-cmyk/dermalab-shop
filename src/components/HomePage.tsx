const concerns = ["bariera", "wrażliwość", "przebarwienia", "spf"];

interface HomePageProps {
  onConcernSelect: (concern: string) => void;
}

export function HomePage({ onConcernSelect }: HomePageProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="section-label">Dermokosmetyki kliniczne</p>
        <h1>Pielęgnacja skóry wrażliwej dobrana do problemu.</h1>
        <p>
          Sklep pilotażowy pod polską hurtownię B2B, z katalogiem produktów startowych, Stripe
          Checkout + P24 i landing pages pod kampanie SEO oraz reklamy.
        </p>
        <div className="concern-row" aria-label="Szybki wybór problemu skóry">
          {concerns.map((concern) => (
            <button key={concern} type="button" onClick={() => onConcernSelect(concern)}>
              {concern}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
