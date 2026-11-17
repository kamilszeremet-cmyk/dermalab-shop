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
          Dermokosmetyki dobrane do potrzeb skóry wrażliwej i reaktywnej. Wybierz problem, a
          pokażemy produkty i rutynę, która do niego pasuje. Płatność kartą lub Przelewy24.
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
