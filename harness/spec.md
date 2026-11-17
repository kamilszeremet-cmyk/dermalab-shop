# DermaLab – spec ścieżki klienta (harness v1)

Rola: planner. Cel: klient przechodzi pełną ścieżkę zakupu w prawdziwej przeglądarce, bez wiedzy o kulisach sklepu.

## Kontekst
- SPA React 19 + Vite, bez routera. Checkout = POST do endpointu (Vercel `/api/create-checkout-session`, Netlify `/.netlify/functions/create-checkout-session`), który tworzy sesję Stripe i zwraca `{url}`.
- Lokalnie nie ma Stripe. Do QA potrzebny jest lokalny mock endpointu.

## Ścieżki użytkownika
1. **Przeglądanie**: wchodzę na `/`, widzę hero, katalog, filtruję po problemie skóry/kategorii, widzę wynik albo komunikat „brak produktów”.
2. **Produkt**: klikam produkt w katalogu → strona przewija do szczegółów wybranego produktu (nazwa, cena, opis, składniki, przycisk „Dodaj do koszyka”).
3. **Koszyk**: dodaję produkt → licznik w nagłówku rośnie, koszyk się otwiera. Zmieniam ilość, usuwam pozycję (osobny przycisk), sumy się przeliczają. Darmowa dostawa pojawia się od 179 zł i znika poniżej. Wybrana dostawa nie „przeskakuje” na inną po zmianie koszyka bez powodu.
4. **Trwałość**: koszyk przetrwa przeładowanie strony (localStorage, bezpieczne try/catch).
5. **Checkout**: „Przejdź do płatności” wysyła POST z poprawnym payloadem (kwoty w groszach, dostawa) → przekierowanie na zwrócony `url`. Błąd endpointu = czytelny komunikat po polsku, przycisk nie wisi.
6. **Powrót**: `/checkout/sukces` pokazuje potwierdzenie i czyści koszyk. `/checkout/anulowane` pokazuje info i zachowuje koszyk. (Obecnie te URL-e nie mają żadnej strony – defekt.)
7. **Klient nie widzi zaplecza**: panele „Hurtownia/import”, „SEO produktu”, statusy konfiguracji (endpoint skonfigurowany/brak, feed demo, braki danych firmy) są ukryte dla klienta. Dostępne tylko pod `?admin=1`.
8. **Mobile**: przy 390px szerokości brak poziomego scrolla, koszyk i nawigacja używalne.
9. **Zgody**: baner cookies – wybór zapamiętany po przeładowaniu.

## Poza zakresem
Prawdziwy Stripe, prawdziwy feed hurtowni, treści prawne, nowy design.

## Wymagania techniczne
- Skrypty `npm run dev/build/test/preview` mają działać na Linux i Windows (obecne są tylko Windowsowe).
- Lokalny mock checkoutu (np. plugin Vite middleware pod `/api/create-checkout-session` w trybie dev, zwraca `{url:"/checkout/sukces?session_id=mock"}`; tryb błędu przez nagłówek albo env).
- Istniejące testy vitest zostają zielone, nowe logika ma testy jednostkowe.
- `tsc --noEmit` i `vite build` bez błędów.
