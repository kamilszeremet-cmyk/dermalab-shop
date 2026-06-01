# DermaLab Go-Live Checklist

## Feed hurtowni

- Uzupełnij `VITE_SUPPLIER_FEED_MODE`, `VITE_SUPPLIER_FEED_URL` i ewentualnie `VITE_SUPPLIER_API_KEY`.
- Sprawdź mapowanie pól: SKU/EAN, nazwa, marka, cena netto, VAT, stany, zdjęcia, składniki i problemy skóry.
- Uzgodnij SLA realizacji zamówień dropshippingowych z hurtownią.

## Checkout

- Ustaw `VITE_CHECKOUT_ENDPOINT=/api/create-checkout-session` na Vercel albo `/.netlify/functions/create-checkout-session` na Netlify.
- Ustaw `STRIPE_SECRET_KEY` tylko w panelu hostingu, nigdy w kodzie klienta.
- Włącz w Stripe metody `card` i Przelewy24.
- Checkout zbiera adres rozliczeniowy, telefon i kraj dostawy `PL`, więc po stronie Stripe sprawdź, czy metody płatności są aktywne dla PLN.

## Dane prawne

- Uzupełnij nazwę firmy, NIP, adres, e-mail, regulamin i politykę prywatności.
- Zweryfikuj regulamin z prawnikiem przed sprzedażą produkcyjną.
- Zwroty online ustaw na minimum 14 dni dla konsumenta.

## Deployment

- Wgraj zmienne środowiskowe z `.env.example`.
- Uruchom `npm run test` i `npm run build`.
- Na Netlify build command jest ustawiony bezpośrednio w `netlify.toml`, żeby działał na linuxowym builderze.
- Sprawdź stronę główną, produkt, koszyk, checkout i wersję mobilną.

## Tracking

- Ustaw `VITE_GA4_ID` i `VITE_META_PIXEL_ID`.
- GA4 i Meta Pixel są blokowane do czasu akceptacji cookies przez klienta.
- Sprawdź eventy: `view_item`, `add_to_cart`, `begin_checkout`, `purchase_handoff`.
- Dopiero po testowym zakupie uruchamiaj płatne kampanie.

## Szczegóły kroków 3-5

- Pełny runbook płatności, zgód cookies i deploymentu jest w `docs/production-launch-runbook.md`.
