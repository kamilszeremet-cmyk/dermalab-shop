# Progress (handoff)
- Runda 0: spec + acceptance gotowe.
- Runda 1 (builder): wdrożono całość spec.

## Co zrobiono
- package.json: skrypty cross-platform (`vite`, `tsc --noEmit && vite build`, `vitest run`); netlify.toml używa `npm run build`.
- Mock checkoutu: `vite-plugins/mockCheckout.ts` (dev i `vite preview`) pod `/api/create-checkout-session` i `/.netlify/functions/create-checkout-session` -> `{url:"/checkout/sukces?session_id=mock"}`; błąd 500 przez nagłówek `x-mock-fail: 1` lub env `MOCK_CHECKOUT_FAIL=1`.
- `.env.development` ustawia `VITE_CHECKOUT_ENDPOINT=/api/create-checkout-session` (checkout aktywny lokalnie w dev).
- Widoki po ścieżce (`src/domain/route.ts`): `/checkout/sukces` (potwierdzenie, czyści koszyk), `/checkout/anulowane` (info, koszyk zostaje, link/otwarcie koszyka).
- Koszyk: przycisk "Usuń: <produkt>", localStorage (`dermalab_cart`, try/catch), dostawa: auto (darmowa gdy dostępna) + jawny wybór klienta jest stabilny, Escape zamyka, stan pending na przycisku "Przejdź do płatności", polski komunikat błędu i odblokowany przycisk po błędzie.
- Panel admin (`?admin=1`): ImportReportPanel, SEO produktu, statusy checkoutu w koszyku, karty konfiguracji w TrustAndLegal, link "Hurtownia", marginSignal w landingach, uwagi o szkicach prawnych.
- Klik produktu (obraz lub nazwa) ustawia detal i przewija do `#product-detail`; komunikat "Brak produktów dla wybranych filtrów." + "Wyczyść filtry"; alt obrazów = nazwa produktu.
- Testy: zaktualizowano App.test (render z `admin`), dodano testy cartStorage, shipping, route/adminMode, widoku klienta.

## Uruchomienie dla QA
`npm run dev -- --port 5173` (http://127.0.0.1:5173, mock checkoutu aktywny, checkout włączony).
Tryb błędu: nagłówek `x-mock-fail: 1` albo start z `MOCK_CHECKOUT_FAIL=1 npm run dev -- --port 5173`.
Preview z mockiem: `npm run build:mock && npm run preview -- --port 4173`.
Admin: dodaj `?admin=1`.

## Znane luki
- Teksty dokumentów prawnych (regulamin itd.) nadal zawierają frazy "do uzupełnienia"/"szkic" (poza zakresem: treści prawne).
- Produkcyjny `npm run build` nie ma endpointu bez ustawienia VITE_CHECKOUT_ENDPOINT (klient zobaczy "Płatności chwilowo niedostępne").
- Brak testu E2E w prawdziwej przeglądarce poza ręcznym sprawdzeniem overflow 390px (OK).
