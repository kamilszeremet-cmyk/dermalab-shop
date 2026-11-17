import type { StoreProduct } from "../domain/product";

interface ProductDetailProps {
  product: StoreProduct | null;
  recommendations: StoreProduct[];
  onAddToCart: (product: StoreProduct) => void;
  admin?: boolean;
}

export function ProductDetail({ product, recommendations, onAddToCart, admin = false }: ProductDetailProps) {
  if (!product) return null;

  return (
    <section className="section product-detail" id="product-detail" aria-label="Szczegóły produktu">
      <img src={product.images[0]} alt={product.name} />
      <div>
        <p className="section-label">{product.category}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <ul className="tag-list">
          {product.activeIngredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
        <p>
          Krok rutyny: <strong>{product.routineStep}</strong>
        </p>
        <button type="button" onClick={() => onAddToCart(product)}>
          Dodaj do koszyka - {product.retailPrice.toFixed(2)} zł
        </button>
        {admin && (
        <div className="seo-panel">
          <h3>SEO produktu</h3>
          <p>
            <strong>Title:</strong> {product.seo.title}
          </p>
          <p>
            <strong>Meta:</strong> {product.seo.metaDescription}
          </p>
          <p>
            <strong>URL:</strong> {product.seo.canonicalPath}
          </p>
        </div>
        )}
      </div>
      <aside className="recommendations" id="routine">
        <h3>Uzupełnij rutynę</h3>
        {recommendations.map((item) => (
          <button key={item.id} type="button" onClick={() => onAddToCart(item)}>
            {item.name}
            <span>{item.retailPrice.toFixed(2)} zł</span>
          </button>
        ))}
        <div className="faq-list">
          <h3>Najczęstsze pytania</h3>
          {product.seo.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </aside>
    </section>
  );
}
