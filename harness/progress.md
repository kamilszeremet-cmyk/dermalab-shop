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

## Runda 1 - naprawy po QA (builder, repair round 1)
- A11: szuflada koszyka = flex column, 100dvh; lista pozycji przewijana wewnątrz (`.cart-lines`), box płatności przypięty na dole; body bez scrolla gdy koszyk otwarty; baner cookies ukryty przy otwartym koszyku; mobilne menu (przycisk Menu, `aria-expanded`) poniżej 820px. Playwright: 4 produkty, przycisk płatności widoczny w 390x844 (y 767-807) i 1366x768 (y 691-731).
- A4: pole ilości z lokalnym draftem (puste/niepoprawne nie usuwa linii), commit na blur/Enter, tylko liczby całkowite (floor), 0 przy commit usuwa, max = stock (`parseQuantityDraft`, `updateQuantity(..., max)`). Pusty koszyk: bez dostawy i sumy.
- A10: `landing.subtitle` to teraz tekst dla klienta; stare notatki w `internalNote` (tylko admin).
- Low: aria-label "Dodaj do koszyka: <nazwa>"; koszyk `role=dialog` + `aria-modal`, fokus do szuflady i powrót, klik w tło zamyka; linki header/footer na /checkout/* prowadzą do `/#...`; chipy hero przewijają do katalogu; /checkout/sukces czyści koszyk tylko z `session_id`, inaczej neutralny komunikat; stopka bez duplikatu nazwy.
- Testy: 60 (vitest), tsc i build przechodzą.

## Runda 2 QA (niezależna) – READY
- A1–A12: wszystkie PASS (harness/qa-round-2.json). Warunek stopu ready(x) spełniony po 1 rundzie napraw z 3.
- Otwarte (low): linki /#sekcja z /checkout/* nie przewijają; brak focus trap w koszyku; menu mobilne nie zamyka się Escape/klikiem obok; "2,7" w ilości -> 27.
- Poza zakresem/blokery live: prawdziwy Stripe key, feed hurtowni, dane firmy i regulamin.
