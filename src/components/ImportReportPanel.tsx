import type { SupplierFeedConfig, SupplierFeedStatus } from "../domain/feedConfig";
import { pricingRules } from "../domain/importer";
import type { ImportReport } from "../domain/product";
import type { SupplierProfile, SupplierReadiness } from "../domain/supplier";

interface ImportReportPanelProps {
  report: ImportReport;
  supplier: SupplierProfile;
  readiness: SupplierReadiness;
  feedConfig: SupplierFeedConfig;
  feedStatus: SupplierFeedStatus;
}

const feedFields = [
  "sku / ean",
  "name / brand / producer",
  "net_price / vat / stock",
  "images",
  "ingredients / concerns / skin_types",
];

export function ImportReportPanel({ report, supplier, readiness, feedConfig, feedStatus }: ImportReportPanelProps) {
  return (
    <section className="section import-panel" id="import">
      <div>
        <p className="section-label">Import feedu hurtowni</p>
        <h2>{supplier.name}: adapter CSV/XML/API</h2>
        <p>
          Dodane: {report.summary.added}, zaktualizowane: {report.summary.updated}, pominięte:{" "}
          {report.summary.skipped}. Profil B2B: {supplier.categories.join(", ")}. Integracje:{" "}
          {supplier.integrationMethods.join(", ")}.
        </p>
      </div>

      <div className="operations-grid">
        <article>
          <h3>Mapowanie feedu</h3>
          <ul>
            {feedFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Reguły marży</h3>
          <ul>
            {pricingRules.map((rule) => (
              <li key={rule.id}>
                {rule.label}: {rule.marginPercent}% lub min. {rule.minGrossMargin.toFixed(2)} zł brutto, końcówka{" "}
                {rule.roundEnding.toFixed(2)}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Feed produkcyjny</h3>
          <p>{feedStatus.label}</p>
          <p>
            Tryb: {feedConfig.mode}, odświeżanie co {feedConfig.refreshMinutes} min.
          </p>
          {feedStatus.missingItems.length > 0 && (
            <ul>
              {feedStatus.missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </article>
        <article>
          <h3>Gotowe teraz ({readiness.score}%)</h3>
          <ul>
            {readiness.readyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Do podpięcia po koncie B2B</h3>
          <ul>
            {readiness.missingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      {report.skipped.length > 0 && (
        <div className="import-errors">
          <h3>Pominięte pozycje</h3>
          <ul>
            {report.skipped.map((item) => (
              <li key={`${item.sku}-${item.name}`}>
                {item.name}: {item.issues.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
