# Insurance English

Aplikacja PWA do nauki Business English dla brokera ubezpieczeń majątkowych (A2 → B2). Działa offline, bez konta, bez serwera i bez płatnych API. Wszystkie postępy zostają na urządzeniu (IndexedDB).

Specyfikacja, według której powstała aplikacja: [`SPEC.md`](SPEC.md) (wersja 2, z poprawkami względem pierwotnego promptu).

## Co jest w środku

| Moduł | Zawartość |
|---|---|
| Fiszki (SM-2) | 155 haseł (A2: 52, B1: 55, B2: 48), z definicją, przykładami, kolokacjami i uwagami o typowych błędach Polaków. Kierunki EN→PL i PL→EN, tryb wpisywania odpowiedzi, ulubione, własne fiszki |
| Sesja dzienna | 10 / 15 / 20 minut: powtórki + nowe karty + ćwiczenie kontekstowe dobrane regułowo (najsłabszy obszar najpierw) |
| Lekcje | 13 lekcji A2 → B2: cele, wyjaśnienie, przykłady, sytuacja biznesowa, pytania, ćwiczenia z kluczem |
| Gramatyka | 11 tematów: wyjaśnienia po polsku, przykłady z ubezpieczeń, typowe błędy, ćwiczenia |
| Rozmowy telefoniczne | 10 dialogów z tłumaczeniem. Tryby: czytaj, słuchaj (TTS, ukryta transkrypcja), ułóż, wybierz reakcję, mów |
| E-maile | 8 zadań: struktura, zwroty, edytor z autozapisem szkicu, regułowa kontrola wymaganych elementów, lista kontrolna, wzór, PDF |
| Mówienie | 10 zadań: nagrywanie (MediaRecorder), opcjonalne rozpoznawanie mowy, ręczna transkrypcja, porównanie z wymaganiami, historia prób, PDF |
| Słuchanie | 6 wiadomości głosowych (TTS) z pytaniami |
| Test poziomujący | 12 pytań; ustala poziom startowy nowych kart |
| Postępy | Seria dni, powtórki z 14 dni, skuteczność, postęp tematów, szacunek poziomu (jawny wzór), eksport PDF |
| Ustawienia | Limit nowych kart, kierunek, głos i tempo lektora, motyw, kopia zapasowa JSON (eksport/import z walidacją), możliwości przeglądarki, lista terminów do weryfikacji |

Interfejs jest po polsku. Treści używają angielskiego brytyjskiego i konwencji rynku londyńskiego.

## Uruchomienie

Wymagany Node.js 20+.

```bash
npm install
npm run dev        # serwer deweloperski (service worker wyłączony w trybie dev)
npm test           # testy jednostkowe (Vitest)
npm run build      # typecheck + build produkcyjny do dist/
npm run preview    # podgląd builda na http://localhost:4173 (z service workerem)
npm run e2e        # test E2E w przeglądarce (Playwright), wymaga wcześniejszego builda
```

E2E pobiera przeglądarkę przez `npx playwright install chromium`. Jeśli masz już Chromium, wskaż go zmienną: `PW_CHROMIUM_PATH=/ścieżka/do/chrome npm run e2e`.

## Wdrożenie na GitHub Pages

1. Utwórz repozytorium na GitHubie i wypchnij kod do gałęzi `main`.
2. W repozytorium: **Settings → Pages → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` przy każdym pushu uruchamia testy, buduje aplikację i publikuje `dist/`.
4. Adres: `https://<użytkownik>.github.io/<repozytorium>/`.

Ścieżka bazowa: domyślnie `base: './'` (ścieżki względne), więc ten sam build działa i w podkatalogu repozytorium, i w domenie głównej. Aplikacja używa `HashRouter` (`#/lessons`), dlatego odświeżenie podstrony na GitHub Pages nie daje błędu 404. Jeśli wolisz ścieżkę absolutną, ustaw `BASE_PATH=/nazwa-repo/ npm run build`.

## Instalacja na telefonie

**Android (Chrome):** otwórz adres → menu ⋮ → „Zainstaluj aplikację”. Uruchom raz z internetem.

**iPhone (Safari):** otwórz adres w Safari → Udostępnij → „Do ekranu początkowego”. Uruchom raz z internetem.

W aplikacji jest też ekran „Instalacja” z instrukcją dla danego systemu.

## Offline: co działa, a co nie

Po pierwszym pełnym załadowaniu service worker zapisuje w pamięci podręcznej całą aplikację, treści i czcionki do PDF (ok. 1 MB). Offline działają: nawigacja, fiszki, sesje, lekcje, gramatyka, dialogi, e-maile, statystyki, eksport PDF, kopia zapasowa.

| Funkcja | Android Chrome | iOS Safari (ekran początkowy) | Chrome/Edge desktop |
|---|---|---|---|
| Aplikacja offline | tak | tak | tak |
| Lektor (TTS) | tak, jeśli zainstalowano angielskie dane głosowe; głosy „online” wymagają sieci | tak, głosy systemowe działają offline | tak; część głosów Google wymaga sieci |
| Nagrywanie głosu | tak | tak (iOS 14.3+) | tak |
| Rozpoznawanie mowy | zwykle wymaga internetu | często niedostępne w trybie aplikacji | wymaga internetu |
| Instalacja jednym przyciskiem | tak | nie, tylko przez menu Udostępnij | tak |

Gdy czegoś brakuje, aplikacja to pokazuje i proponuje obejście (transkrypcja zamiast lektora, wpisywanie zamiast rozpoznawania mowy).

**Dane:** wszystko jest w IndexedDB tej przeglądarki. Aplikacja prosi o trwałe przechowywanie (`navigator.storage.persist()`), a wynik widać w Ustawieniach. Wyczyszczenie danych przeglądarki, odinstalowanie aplikacji lub zmiana telefonu usuwa postępy, dlatego dashboard przypomina o kopii zapasowej co 7 dni. Na iOS dane aplikacji z ekranu początkowego są oddzielne od danych w Safari.

**Aktualizacje:** nowa wersja pojawia się jako komunikat „Dostępna jest nowa wersja → Odśwież”. Aktualizacja wymienia tylko pliki aplikacji, a dane w IndexedDB zostają. Postęp w fiszkach jest powiązany ze stałym ID karty, więc zmiana treści go nie kasuje.

## Jak działa nauka

- **SM-2** (Wozniak 1987): przyciski Nie pamiętam / Trudne / Dobrze / Łatwe = oceny 0 / 3 / 4 / 5. Pierwsze odstępy to 1 i 6 dni, potem odstęp × współczynnik łatwości (min. 1,3). Karta „Nie pamiętam” wraca jeszcze raz w tej samej sesji. Implementacja: `src/lib/srs.ts`.
- **Dobór ćwiczeń** jest regułowy, bez AI: najpierw rodzaj ćwiczeń z najniższym średnim wynikiem (albo jeszcze nieruszany), w nim pierwsze nieprzerobione zadanie od poziomu startowego. Implementacja: `src/lib/session.ts`.
- **Szacunek poziomu** (to nie certyfikat CEFR): 40% udział utrwalonych kart danego poziomu (odstęp ≥ 7 dni) + 30% średni najlepszy wynik lekcji i gramatyki + 30% dialogów, e-maili, mówienia i słuchania. Poziom jest „osiągnięty” od 70%, kolejno od A2. Implementacja: `src/lib/progress.ts`.
- **Ocena e-maili i mówienia** sprawdza obecność wymaganych elementów; każdy element ma listę akceptowanych alternatyw. Aplikacja nie ocenia gramatyki ani wymowy i nie udaje, że to robi.

## Dodawanie treści

Treści są w `src/content/` jako typowane moduły TypeScript:

- `cards-a2.ts`, `cards-b1.ts`, `cards-b2.ts`: fiszki budowane funkcją `k(id, level, topic, en, pl, def, examples, collocations, note, extra)`.
- `lessons.ts`, `grammar.ts`, `dialogues.ts`, `emails.ts`, `speaking.ts`, `listening.ts` (wraz z testem poziomującym).

Zasady:
1. **Nigdy nie zmieniaj ani nie używaj ponownie istniejącego ID.** Postęp jest do niego przypięty. Nowe karty: `v-<słowo>`.
2. Hasło, którego znaczenie zależy od jurysdykcji, oznacz `{ needsReview: true }`. Pojawi się w Ustawieniach na liście do weryfikacji.
3. Ćwiczenia: `mcq` (odpowiedź = indeks), `gap` (w treści `___`, lista akceptowanych odpowiedzi), `order` (słowa w poprawnej kolejności).
4. Po zmianach uruchom `npm test`. Test treści sprawdza unikalność ID, wymagane pola, minimalne liczby, poprawność odwołań do kart i to, czy wzorcowe odpowiedzi spełniają własne wymagania.

## Struktura

```
src/
  content/     treści (niezmienne, wbudowane w aplikację)
  db/          Dexie: schemat v2 z migracją, kopia zapasowa
  lib/         SRS, sesja, postępy, ocena odpowiedzi, TTS, PDF
  components/  fiszki, ćwiczenia, nagrywanie
  pages/       ekrany
e2e/           test Playwright (offline)
public/fonts/  DejaVu Sans (podzbiór Latin + Latin Extended-A) do PDF
```

Rozmiar builda: ok. 1,5 MB w `dist/`, z czego ok. 1 MB trafia do pamięci offline. Opcjonalne moduły jsPDF (html2canvas, DOMPurify, canvg) są wyłączone z cache, bo aplikacja z nich nie korzysta.

## Testy: co faktycznie uruchomiono

- **Vitest (35 testów):** harmonogram SM-2, ocena odpowiedzi i alternatyw, obliczenia postępów i poziomu, planowanie sesji, zapis w IndexedDB po zamknięciu i ponownym otwarciu bazy (fake-indexeddb), migracja schematu v1 → v2, eksport/import kopii zapasowej z walidacją, generowanie wszystkich typów PDF z polskimi znakami, integralność treści.
- **Playwright (3 testy, headless Chromium, emulacja Pixel 7):** instalacja service workera → przejście w tryb offline → przeładowanie → sesja fiszek → ponowne przeładowanie offline z zachowanym postępem → lekcja, dialog i eksport PDF offline; renderowanie 21 ekranów bez błędów JS; zapis i odtworzenie szkicu e-maila.
- **Nie testowano na fizycznych urządzeniach** z Androidem ani iOS. Zachowanie TTS, mikrofonu i instalacji na prawdziwych telefonach sprawdź według listy poniżej.

## Ręczna lista kontrolna (na telefonie)

- [ ] Otwórz adres, zainstaluj aplikację, uruchom ją raz z internetem.
- [ ] Włącz tryb samolotowy, zamknij i uruchom aplikację: ładuje się, w nagłówku widać „Offline”.
- [ ] Zrób sesję 10 min: oceń kilka kart, zamknij aplikację, otwórz ponownie. Postęp jest zachowany.
- [ ] Dokończ lekcję: wynik pojawia się w „Postępy”.
- [ ] Offline: Słownik → PDF. Plik ma poprawne polskie znaki.
- [ ] Rozmowa → Słuchaj: lektor mówi po angielsku (jeśli nie, zainstaluj głos angielski).
- [ ] Mówienie: nagraj się i odtwórz nagranie. Wpisz tekst ręcznie i porównaj.
- [ ] Ustawienia → Eksportuj wszystko. Potem „Usuń wszystkie dane”, „Przywróć z pliku”. Dane wracają.
- [ ] Po wdrożeniu nowej wersji pojawia się komunikat o aktualizacji, a postępy zostają.

## Licencje

Kod: MIT. Czcionka DejaVu Sans: licencja Bitstream Vera / DejaVu (wolna). Treści dydaktyczne: przykłady i firmy są fikcyjne.
