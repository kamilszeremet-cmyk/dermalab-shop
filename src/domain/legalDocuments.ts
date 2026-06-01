import type { StoreLegalConfig } from "./storeConfig";

export interface LegalDocumentSection {
  title: string;
  body: string;
}

export interface LegalDocument {
  id: "regulamin" | "polityka-prywatnosci" | "zwroty-i-reklamacje" | "dostawa-i-platnosci";
  title: string;
  summary: string;
  sections: LegalDocumentSection[];
}

export function buildLegalDocuments(config: StoreLegalConfig): LegalDocument[] {
  const seller = sellerName(config);
  const taxId = config.taxId || "do uzupełnienia";
  const address = config.address || "do uzupełnienia";
  const email = config.email || "do uzupełnienia";

  return [
    {
      id: "regulamin",
      title: "Regulamin sklepu",
      summary: "Zasady korzystania ze sklepu, składania zamówień, płatności i realizacji umowy sprzedaży.",
      sections: [
        {
          title: "Sprzedawca i kontakt",
          body: `Sklep ${config.storeName} prowadzi ${seller}, NIP: ${taxId}, adres: ${address}. Kontakt w sprawach zamówień, zwrotów i reklamacji: ${email}.`,
        },
        {
          title: "Zamówienia",
          body: "Klient składa zamówienie przez dodanie produktów do koszyka, wybór dostawy, podanie danych niezbędnych do realizacji zamówienia oraz przejście do płatności. Umowa sprzedaży zostaje zawarta po potwierdzeniu zamówienia przez sklep.",
        },
        {
          title: "Ceny i płatności",
          body: "Ceny produktów podawane są w złotych polskich i zawierają podatek VAT, jeśli ma zastosowanie. Sklep obsługuje płatności elektroniczne przez Stripe Checkout, w tym kartę oraz Przelewy24, po podłączeniu produkcyjnego konta płatniczego.",
        },
        {
          title: "Produkty i dostępność",
          body: "Dostępność produktów wynika ze stanów magazynowych hurtowni lub feedu produktowego. W przypadku braku produktu sklep kontaktuje się z klientem w celu ustalenia zmiany, częściowej realizacji albo anulowania zamówienia.",
        },
        {
          title: "Szkic do weryfikacji",
          body: "Ten regulamin jest szkicem operacyjnym dla sklepu internetowego i powinien zostać zweryfikowany przed uruchomieniem sprzedaży produkcyjnej.",
        },
      ],
    },
    {
      id: "polityka-prywatnosci",
      title: "Polityka prywatności",
      summary: "Informacja o administratorze danych, celach przetwarzania, cookies i narzędziach analitycznych.",
      sections: [
        {
          title: "Administrator danych",
          body: `Administratorem danych osobowych klientów jest ${seller}, NIP: ${taxId}, adres: ${address}. Kontakt w sprawach danych osobowych: ${email}.`,
        },
        {
          title: "Zakres i cele przetwarzania",
          body: "Dane są przetwarzane w celu obsługi zamówień, płatności, dostawy, reklamacji, zwrotów, kontaktu z klientem oraz realizacji obowiązków księgowych i prawnych.",
        },
        {
          title: "Płatności, dostawa i narzędzia zewnętrzne",
          body: "Dane niezbędne do płatności są przekazywane operatorowi płatności, a dane dostawy przewoźnikowi. Po skonfigurowaniu GA4 lub Meta Pixel sklep może wykorzystywać narzędzia analityczne i marketingowe zgodnie z ustawieniami cookies.",
        },
        {
          title: "Prawa osoby, której dane dotyczą",
          body: "Klient może żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia danych, sprzeciwu wobec przetwarzania oraz złożenia skargi do organu nadzorczego.",
        },
        {
          title: "Cookies",
          body: "Sklep wykorzystuje pliki cookies techniczne potrzebne do działania koszyka i strony. Cookies analityczne i marketingowe powinny być uruchamiane dopiero po wdrożeniu właściwego mechanizmu zgody.",
        },
      ],
    },
    {
      id: "zwroty-i-reklamacje",
      title: "Zwroty i reklamacje",
      summary: "Procedura odstąpienia od umowy, zwrotu środków oraz reklamacji z tytułu niezgodności towaru z umową.",
      sections: [
        {
          title: "Odstąpienie od umowy",
          body: `Konsument może odstąpić od umowy zawartej na odległość w terminie ${config.returnsDays} dni od otrzymania towaru, bez podawania przyczyny, o ile nie zachodzi ustawowy wyjątek.`,
        },
        {
          title: "Zwrot produktu",
          body: "Po odstąpieniu od umowy klient powinien odesłać produkt w stanie pozwalającym ocenić jego charakter, cechy i funkcjonowanie. Szczegółowy adres zwrotu należy uzupełnić po ustaleniu obsługi logistycznej.",
        },
        {
          title: "Zwrot płatności",
          body: "Zwrot środków następuje co do zasady tym samym sposobem płatności, którego użył klient, chyba że klient wyraźnie zgodzi się na inny sposób zwrotu bez dodatkowych kosztów.",
        },
        {
          title: "Reklamacje",
          body: "Reklamację można złożyć mailowo. Należy podać numer zamówienia, opis niezgodności produktu z umową, oczekiwany sposób rozpatrzenia oraz dane kontaktowe. Sprzedawca odpowiada na reklamację w terminie 14 dni od jej otrzymania.",
        },
      ],
    },
    {
      id: "dostawa-i-platnosci",
      title: "Dostawa i płatności",
      summary: "Informacje o metodach dostawy, czasie realizacji, darmowej dostawie i operatorze płatności.",
      sections: [
        {
          title: "Metody dostawy",
          body: "Sklep przygotowany jest pod InPost Paczkomat, kuriera oraz darmową dostawę od progu koszyka ustawionego w konfiguracji checkoutu. Finalne cenniki zależą od umowy z operatorem logistycznym.",
        },
        {
          title: "Czas realizacji",
          body: "Zakładany czas dostawy dla wersji startowej to 1-2 dni robocze od przekazania paczki przewoźnikowi. Czas może zależeć od dostępności produktu w hurtowni oraz harmonogramu realizacji dropshippingu.",
        },
        {
          title: "Płatności",
          body: "Sklep jest przygotowany do obsługi Stripe Checkout, kart płatniczych i Przelewy24. Płatności produkcyjne wymagają podłączenia klucza Stripe i aktywnych metod płatności w panelu operatora.",
        },
        {
          title: "Dowód zakupu",
          body: "Po uruchomieniu sprzedaży produkcyjnej sklep powinien wysyłać potwierdzenie zamówienia oraz dokument sprzedaży zgodnie z ustawieniami księgowymi firmy.",
        },
      ],
    },
  ];
}

function sellerName(config: StoreLegalConfig) {
  return config.legalName || `${config.storeName} (dane firmy do uzupełnienia)`;
}
