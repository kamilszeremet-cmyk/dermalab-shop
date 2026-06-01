import type { ProductFilters, StoreProduct } from "../domain/product";

interface CatalogProps {
  products: StoreProduct[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onProductSelect: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  concerns: string[];
  skinTypes: string[];
  ingredients: string[];
  categories: string[];
}

export function Catalog({
  products,
  filters,
  onFiltersChange,
  onProductSelect,
  onAddToCart,
  concerns,
  skinTypes,
  ingredients,
  categories,
}: CatalogProps) {
  return (
    <section className="section" id="catalog">
      <div className="section-heading">
        <p className="section-label">Katalog</p>
        <h2>Filtry kliniczne</h2>
      </div>
      <div className="catalog-layout">
        <aside className="filters" aria-label="Filtry produktów">
          <Select
            label="Problem"
            value={filters.concern}
            values={concerns}
            onChange={(concern) => onFiltersChange({ ...filters, concern })}
          />
          <Select
            label="Typ skóry"
            value={filters.skinType}
            values={skinTypes}
            onChange={(skinType) => onFiltersChange({ ...filters, skinType })}
          />
          <Select
            label="Składnik"
            value={filters.ingredient}
            values={ingredients}
            onChange={(ingredient) => onFiltersChange({ ...filters, ingredient })}
          />
          <Select
            label="Kategoria"
            value={filters.category}
            values={categories}
            onChange={(category) => onFiltersChange({ ...filters, category })}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={(event) => onFiltersChange({ ...filters, onlyAvailable: event.currentTarget.checked })}
            />
            Tylko dostępne
          </label>
        </aside>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <button type="button" className="image-button" onClick={() => onProductSelect(product)}>
                <img src={product.images[0]} alt="" />
              </button>
              <div>
                <p className="product-brand">{product.brand}</p>
                <h3>{product.name}</h3>
                <p>{product.shortBenefit}</p>
              </div>
              <div className="product-actions">
                <strong>{product.retailPrice.toFixed(2)} zł</strong>
                <button type="button" onClick={() => onAddToCart(product)}>
                  Dodaj
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SelectProps {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}

function Select({ label, value, values, onChange }: SelectProps) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        <option value="all">Wszystkie</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
