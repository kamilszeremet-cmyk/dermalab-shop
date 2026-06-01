# Kroki 3-5: płatności, cookies, wdrożenie

## 3. Stripe Checkout + Przelewy24

1. W Stripe utwórz konto firmowe i przejdź weryfikację.
2. W Dashboard Stripe włącz metody płatności: `card` oraz `Przelewy24`.
3. W hostingu ustaw `STRIPE_SECRET_KEY` jako zmienną serwerową. Nie dodawaj jej do kodu frontendu.
4. Dla Vercel zostaw `VITE_CHECKOUT_ENDPOINT=/api/create-checkout-session`.
5. Dla Netlify ustaw `VITE_CHECKOUT_ENDPOINT=/.netlify/functions/create-checkout-session`.
6. Zrób testowy zakup w trybie testowym Stripe przed zmianą klucza na live.

Checkout wysyła do Stripe: `card`, `p24`, walutę `pln`, język `pl`, adres rozliczeniowy, telefon i kraj dostawy `PL`.

## 4. Cookies i tracking

1. Ustaw `VITE_GA4_ID` i `VITE_META_PIXEL_ID` dopiero po utworzeniu kont analitycznych.
2. Baner cookies blokuje GA4 i Meta Pixel do czasu akceptacji.
3. Opcja `Tylko niezbędne` zostawia aktywne tylko techniczne działanie sklepu.
4. Opcja `Akceptuję wszystkie` włącza eventy: `view_item`, `add_to_cart`, `begin_checkout`, `purchase_handoff`.
5. Przed kampaniami sprawdź eventy w GA4 DebugView i Meta Events Manager.

## 5. Vercel albo Netlify

### Vercel

1. Podepnij repozytorium w Vercel jako projekt Vite.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Dodaj zmienne z `.env.production.example`.
5. Ustaw `STRIPE_SECRET_KEY` tylko jako zmienną środowiskową projektu.
6. Po deployu sprawdź `/api/create-checkout-session` przez test z koszyka.

### Netlify

1. Podepnij repozytorium w Netlify.
2. Build command jest ustawiony w `netlify.toml`: `node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/vite/bin/vite.js build`.
3. Publish directory: `dist`.
4. Functions directory jest ustawiony w `netlify.toml`.
5. Dodaj zmienne z `.env.production.example`.
6. Zmień `VITE_CHECKOUT_ENDPOINT` na `/.netlify/functions/create-checkout-session`.

## Blokery przed sprzedażą live

- Uzupełnione dane firmy w `.env.production.example`.
- Zweryfikowany regulamin i polityka prywatności.
- Produkcyjny feed hurtowni oraz warunki dropshippingu.
- Live `STRIPE_SECRET_KEY` ustawiony w hostingu.
- Test koszyka, płatności, zwrotu z Checkout i wersji mobilnej.
