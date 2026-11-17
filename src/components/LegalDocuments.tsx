import type { LegalDocument } from "../domain/legalDocuments";

interface LegalDocumentsProps {
  documents: LegalDocument[];
  admin?: boolean;
}

export function LegalDocuments({ documents, admin = false }: LegalDocumentsProps) {
  return (
    <section className="section legal-documents-section" id="dokumenty">
      <div className="section-heading">
        <p className="section-label">Dokumenty sklepu</p>
        <h2>Regulamin, polityka prywatności, zwroty i płatności</h2>
        {admin && (
          <p>
            Szkice gotowe do uzupełnienia danymi firmy. Przed publikacją sprzedażową powinny przejść weryfikację
            prawną.
          </p>
        )}
      </div>
      <div className="legal-document-list">
        {documents.map((document) => (
          <article className="legal-document" id={document.id} key={document.id}>
            <h3>{document.title}</h3>
            <p>{document.summary}</p>
            {document.sections.map((section) => (
              <section key={section.title}>
                <h4>{section.title}</h4>
                <p>{section.body}</p>
              </section>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
