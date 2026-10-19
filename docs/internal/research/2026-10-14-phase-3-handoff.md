# Faza 3 — zobacz i sprawdź pomysł przed pełną implementacją

Data: **2026-10-14**. Status: **implementacja lokalna dostarczona 2026-10-15; gotowość publicznego wydania niesprawdzona**.

Aktualizacja **2026-10-15**: przed P3-T1 wykonać [blok poprawek V1–V5](../plans/2026-10-15-phase-1-2-corrections.md). Badania efektywności, kosztu i UX przeniesiono na okres po ukończeniu Faz 1–4 i udostępnieniu narzędzia użytkownikom. Regresje i scenariusze poprawności pozostają w realizacji; pomiar korzyści nie blokuje wejścia do Fazy 3 ani jej odbioru.

Model wykonawczy wskazany przez właściciela: **Sol**. Dokument nie wybiera za niego konkretnej wersji, identyfikatora API ani ustawień modelu. Nie wymaga dodatkowych modeli ani delegowania zadań. Wskazanie Sola do implementacji GSR nie oznacza zmiany modeli używanych przez sam plugin.

Autoryzacja tej sesji: przygotowanie dokumentu pod realizację i propozycji Fazy 4. Akceptacja kierunku nie jest uruchomieniem implementacji, testów z płatną inferencją ani publikacji. Poniższy prompt startowy służy do późniejszego zlecenia implementacji. Deploy GSR następuje po Fazie 3, po sprawdzeniu gotowości wydania; Faza 4 pozostaje osobną propozycją.

## 1. Cel i źródła

**Użytkownik może ocenić istotny fragment produktu i poprawić założenia, zanim GSR rozbuduje implementację.** Feedback aktualizuje wymagania i pozostaje dostępny po `/clear`. GSR dobiera demonstrację do niepewności: mapa przepływu, kierunek wizualny lub działający fragment.

Przeczytaj na początku:

- [Stan po Fazie 1](2026-10-11-phase-1-implementation.md) i [stan po Fazie 2](2026-10-13-phase-2-implementation.md).
- [Audyt workflow, w szczególności punkt 10](2026-10-09-workflow-audit.md): obecny sketch jest szkicem inżynierskim.
- [Kierunek produktu](2026-10-09-gsr-direction.md): eksperymenty D-pinów i pierwsze rzeczywiste użycie.
- [Backlog](../../BACKLOG.md): głównie B17 oraz wybrane fragmenty B12/B14/B15/B16/B18/B21/B34.

Następnie czytaj tylko pliki właściwe dla bieżącego zadania. Nie odtwarzaj całego researchu ani nie wykonuj nowego przeglądu rynku. Zewnętrzne kontrakty hosta sprawdź w aktualnych źródłach dopiero przy integracji zależnej od tych kontraktów.

Fazy 1–2 są zaimplementowane w working tree. Raport Fazy 2 dokumentuje 40 testów i smoke startu hosta; pełne próby modelowe pozostają niezaobserwowane. To historyczna obserwacja, nie wynik aktualnego checkoutu. **Nie zaczynaj od czystego HEAD i nie resetuj zmian poprzednich faz.** Nie czytaj, kopiuj ani modyfikuj niezwiązanych plików osobistych, w szczególności CV. Snapshot do testów twórz z jawnie wybranych źródeł, z uwzględnieniem istotnych plików untracked/ignored.

## 2. Zakres wydania

| Element | Zakres Fazy 3 | Poza tym wydaniem |
|---|---|---|
| Mapa produktu | Główna ścieżka funkcji, istotne rozgałęzienie/błąd i decyzje do podjęcia | Edytor diagramów i pełna mapa architektury projektu |
| Kierunek wizualny | Jeden reprezentatywny ekran; maksymalnie dwa warianty, jeśli istnieje rzeczywisty wybór | Pełny redesign, biblioteka design systemów, obowiązkowe warianty |
| Interakcja/eksperyment | Jedna ograniczona ścieżka do kliknięcia albo próba techniczna odpowiadająca na konkretne pytanie | Budowa całej aplikacji w ramach preview |
| Decyzje i pamięć | Feedback → wymagania/D-piny → aktualny handoff → dalsza implementacja | Ogólny graf decyzji, nowa baza stanu, przebudowa wszystkich pinów |
| Mapa pracy GSR | Krótki widok obecnego etapu, następnej akcji i otwartych decyzji na żądanie | Dashboard, companion app, monitor w tle |
| Gotowość release'u | Rzeczywiste próby, przykład demonstracyjny, dokumentacja i kontrola instalacji/aktualizacji | Uniwersalny system deployowania aplikacji użytkowników |

Nie zamykaj całych pozycji backlogu na podstawie tych fragmentów. B23/B24 w sensie nowej funkcjonalności ship/deploy dla produktów użytkownika pozostają odłożone w backlogu. Właściciel wybrał dla [Fazy 4 kierunek GSR Autopilot](2026-10-14-phase-4-direction.md), zastępujący wcześniejszą propozycję first-use/deploy. Wydanie samego GSR po Fazie 3 korzysta z istniejącego procesu release i nie zależy od Fazy 4.

## 3. Kontrakt zachowania

### Wybór demonstracji

| Sytuacja | Najmniejszy przydatny wynik |
|---|---|
| Niejasny przebieg, kolejność kroków, konta lub uprawnienia | Mapa przepływu z oznaczoną nierozstrzygniętą decyzją |
| Niejasna hierarchia informacji lub wygląd nowego UI | Reprezentatywny ekran z realistyczną przykładową treścią |
| Niejasna obsługa kilku kroków lub stanów | Mały interaktywny prototyp obejmujący tę interakcję |
| Ryzyko techniczne, np. rzeczywiste przetwarzanie pliku | Wąski eksperyment wykonujący ryzykowną operację na syntetycznym przykładzie |
| Jasna funkcja w istniejącym design systemie | Wykorzystanie aktualnych wzorców; preview tylko gdy wnosi odpowiedź lub użytkownik go żąda |
| Literówka lub jasna drobna poprawka | Bez preview, dodatkowego scope i resetu kontekstu |

GSR wybiera na podstawie celu, istniejącego produktu i faktycznej niepewności. Nie twórz klasyfikatora regex ani listy pytań o tryb. Nie wykonuj wszystkich form po kolei. Domyślny zakres pierwszej demonstracji to jedna decyzja i jeden ekran lub przepływ; rozszerzenie musi odpowiadać konkretnej potrzebie/feedbackowi. Limit dwóch wariantów dotyczy domyślnej propozycji, nie nadpisuje jawnego zlecenia użytkownika.

### Wejście i miejsce w procesie

- Naturalne „pokaż mi wcześniej jak to będzie działać/wyglądać” obsługuje istniejący koordynator i właściwy scope/build.
- Nie dodawaj nowej publicznej komendy ani flagi w tej fazie. Zachowaj obecne znaczenie `/gsr:build --sketch`: żąda przygotowania szkicu inżynierskiego, nie automatycznego prototypu ani dodatkowej zgody.
- Dodaj wewnętrzny skill `preview`, dobierany przez koordynację/scope/build, z wąskim opisem zastosowania. Wykorzystuj aktualnie dostępne narzędzia i właściwe skille hosta. Nie uzależniaj funkcjonalności od pluginu dostępnego tylko na komputerze autora.
- W scope demonstracja może powstać po ustaleniu celu i głównego działania, przed rozpisaniem pełnego PRD. W istniejącym projekcie pracuj na kontrakcie jednej funkcji bez wymuszania PRD całego produktu.
- Preview nie jest nowym top-level etapem w parserze handoffu. `Next step` pozostaje np. `scope` albo `build`; `Stage` i `Next action` opisują konkretną pracę nad preview. Zachowaj enumerację i kompatybilność Fazy 2.
- Samo „zaplanuj” nie upoważnia do pisania kodu aplikacji. Żądanie preview upoważnia do ograniczonego artefaktu demonstracyjnego, z zachowaniem wskazanych ograniczeń. „Tylko diagram, bez kodu” kończy się diagramem.

### Sposób prezentacji i narzędzia

Mapa produktu: Mermaid w Markdown, jeśli host ją renderuje; w przeciwnym razie czytelne strzałki/lista kroków z tym samym znaczeniem. Nie wymagaj instalacji renderera tylko dla diagramu. Pokaż główną ścieżkę i istotny błąd/rozgałęzienie, oznacz pytanie, na które użytkownik ma odpowiedzieć. Nie dokładaj wymyślonych reguł biznesowych, aby wypełnić mapę.

Kierunek wizualny: lokalny artefakt HTML/CSS lub ograniczona trasa/przykład w istniejącym stacku, z realnym sposobem otwarcia. W nowym projekcie preferuj samodzielny HTML bez nowych zależności. W istniejącym projekcie wykorzystuj obecne komponenty, style i fonty, jeśli dostępne. Nie uruchamiaj nowego scaffoldingu frameworka tylko na potrzeby jednego ekranu. Obraz koncepcyjny może być pomocą, ale nie dowodzi działania interfejsu.

Interakcja: podaj co działa, co jest symulowane oraz czego eksperyment nie sprawdza. Gdy pytanie dotyczy persystencji, płatności lub transformacji danych, sam kliknięty przycisk nie jest dowodem; potrzebna jest odpowiednia obserwacja zachowania/danych. Nie uruchamiaj rzeczywistych płatności ani produkcyjnych zapisów w demonstracji.

Przed pokazaniem sprawdź, czy artefakt istnieje i czy opisany sposób otwarcia jest poprawny. Przy dostępnej przeglądarce obejrzyj wynik, przejdź zadeklarowaną ścieżkę i zapisz obserwacje. Bez takiego narzędzia daj użytkownikowi lokalny artefakt i dokładnie oznacz brak obserwacji; kontrola kodu nie staje się kontrolą wizualną. Brak opcjonalnego skilla nie blokuje pracy dostępnymi narzędziami. Brak niezbędnego narzędzia ujawnia konkretną lukę, a nie uruchamia automatycznej instalacji.

### Feedback, decyzje i tempo współpracy

- Każdy preview odpowiada na nazwaną niepewność albo jawne żądanie demonstracji. Pokaż: co można ocenić, istotne ograniczenia i wynik/otwartą decyzję.
- „Podoba mi się” dotyczy prezentowanego zakresu; nie potwierdza automatycznie wszystkich D-pinów, działania backendu ani zgody na deploy.
- Jawny feedback o zachowaniu aktualizuje istniejącą specyfikację i powiązane decyzje. Zachowaj źródło, datę i poprzednią decyzję. Jeśli feedback ma dwie istotnie różne interpretacje, zapytaj o tę jedną różnicę; kontynuuj niezależne prace.
- Rozszerz checkpointy D-pinów o moment uzyskania przydatnego dowodu z preview/eksperymentu przed pełną budową. Samo wygenerowanie artefaktu nie wymusza pytań ani zmiany statusu.
- Dalej obowiązuje możliwość pozostawienia decyzji odroczonej. Nie ponawiaj niedawno odłożonego pytania bez nowego dowodu. Test nigdy nie oznacza samodzielnie `confirmed`.
- Jeśli użytkownik prosi „pokaż i poczekaj”, pokaż wynik i zachowaj tę granicę po `/clear`. Jeśli kierunek jest ustalony i implementacja autoryzowana, nie pytaj ponownie o rozpoczęcie. Milczenie nie jest wyborem wariantu.
- Przy zmianie decyzji opisz dotknięte wymagania oraz co z preview/implementacji wymaga zmiany. Nie przepisuj całej specyfikacji i nie odnawiaj niezwiązanego researchu.

## 4. Artefakty i jedno źródło decyzji

W projekcie użytkownika przyjmij domyślnie:

```text
DOC_ROOT/previews/<feature-slug>/README.md  # pytanie, wariant, obserwacje, odnośniki
DOC_ROOT/previews/<feature-slug>/index.html # jeśli samodzielny preview HTML
```

To planowane ścieżki, nie istniejące zasoby. Trasa demonstracyjna może zamiast tego żyć w istniejącym stacku; README wskazuje faktyczny plik/trase i sposób uruchomienia. Nie twórz duplikatu kodu tylko dla zachowania układu katalogów. Dostosuj slug do istniejącego projektu i sprawdź, czy nie nadpisujesz wcześniejszej pracy.

Minimalny rekord preview zawiera: cel/pytanie; powiązany dokument i ID wymagania/decyzji (jeśli istnieje); istotną treść założeń użytych do tej wersji; artefakty i sposób otwarcia; granice symulacji; faktyczne obserwacje i luki; feedback ze źródłem/datą; wpływ na wymagania; następną akcję. Jeśli nie było testu albo feedbacku, zapisz to wprost. Nie twórz pustego D-pina dla każdego ekranu.

Wymagania pozostają w `scope.md` lub feature spec/PRD. Rejestr D-pinów: istniejący PRD, wcześniej scope; dla focused feature bez tych dokumentów właściwa sekcja `Open Decisions` w feature spec. Jeden właściciel danej decyzji, bez dwóch edytowanych kopii. Jeśli później powstaje PRD, przenieś wpis z zachowaniem ID i zostaw odnośnik do nowego właściciela. Dobór kolejnego ID sprawdza istniejące dokumenty projektu.

Rekord preview opisuje eksperyment i wskazuje właściciela decyzji. `STATE.md` przechowuje tylko nawigację i bieżący handoff. W handoffie odnoś się do sekcji specyfikacji i rekordu preview, zachowując istniejący limit sześciu początkowych `Read next`.

Na resume porównaj aktualne wymagania, treść decyzji i artefakty. Zmienione wymaganie pod tym samym ID może unieważnić preview. Brak artefaktu lub rozbieżność oznacza potrzebę uzgodnienia/odświeżenia; nie pokazuj starego wariantu jako aktualnie wybranego. Zachowaj istniejący mechanizm freshness Fazy 1, nie dodawaj drugiej bazy dowodów ani nowych wykluczeń ukrywających wymagania. Metadane lub hash nie dowodzą semantycznej zgodności UI — ta wymaga inspekcji i obserwacji.

Przy przejściu do build nazwij sposób wykorzystania prototypu: **reuse**, **adapt** albo **discard**, wraz z powodem. Nie kopiuj automatycznie atrap, tymczasowych danych i obejść do kodu docelowego. Nie usuwaj artefaktów użytkownika bez właściwej autoryzacji. Akceptacja preview nie oznacza statusu `done`/`accepted` wszystkich Truth pins funkcji.

## 5. Mapa pracy GSR

To małe uzupełnienie, wyraźnie oddzielone od mapy produktu. Na „gdzie jesteśmy?” lub `/gsr:status` pokaż potrzebny fragment procesu, np.:

```text
Cel ustalony → Preview [teraz] → Budowa → Weryfikacja
Otwarta decyzja: rezerwacja z kontem czy bez?
Następna akcja: pokazać wariant bez logowania.
```

Wyprowadzaj widok z aktualnej specyfikacji, Active Task i obserwacji dowodów. Nie przechowuj osobnego grafu ani nie dodawaj fikcyjnych procentów. „Zbudowane, sprawdzenie nieaktualne” zachowuje oba fakty. Nie pokazuj wszystkich etapów dla literówki i nie drukuj mapy przy każdej odpowiedzi.

Status-only pozostaje read-only, nie uruchamia testów ani implementacji. Brak STATE nie oznacza, że nie ma pracy: korzystaj z jednoznacznie wskazanego feature spec/preview i nazwij brakujące informacje. Istniejący status ma wczesne wyjście przy braku STATE — dostosuj tylko ten fragment dla focused feature, bez nowego silnika wykrywania projektów. Liczenie otwartych decyzji respektuje wskazanego wyżej właściciela rejestru.

## 6. Kolejność implementacji dla Sola

Aktualne wyniki: [plan wykonania](../plans/2026-10-14-phase-3.md) i [raport implementacji](2026-10-15-phase-3-implementation.md); braki live pozostają jawne. Pierwotna lista zadań poniżej jest kontraktem zakresu. Najpierw zakończ [blok poprawek V1–V5](../plans/2026-10-15-phase-1-2-corrections.md), następnie wykonuj P3-T1–P3-T8 po kolei. Po każdym zapisz w wewnętrznym planie pliki, sprawdzenia, rzeczywisty wynik i ograniczenia; nie traktuj zadania jako nowej bramki zgody. Przy dużym etapie korzystaj z istniejącego handoffu i zalecenia `/clear` → „dalej”. Nie wprowadzaj osobnego workflow zależnego od konkretnego modelu.

### P3-T1 — baseline i scenariusze

**Pliki:** przyszły `docs/internal/plans/2026-10-14-phase-3.md`, syntetyczne scenariusze pod `scripts/fixtures/phase-3/`, przyszły ledger ewaluacji pod `docs/internal/research/`.

Sprawdź ukończenie V1–V5, bieżący diff i rzeczywiste wersje narzędzi. Uruchom `npm run check` bez resetu poprzednich faz. Zapisz punkt odniesienia po poprawkach Faz 1–2, wejścia P3-S1–S13 oraz rozdzielenie wyników deterministycznych i modelowych. To baseline poprawności i wersji, bez benchmarku efektywności. W razie istniejącej regresji nazwij ją i rozwiąż tylko potrzebną zależność przed zmianą dotkniętej ścieżki. Nie dopisuj oczekiwanych zachowań jako zaobserwowanych sukcesów.

**Odbiór:** znany punkt odniesienia, zachowane poprzednie zmiany, wszystkie scenariusze mają wejście i oczekiwany wynik; nieuruchomione próby pozostają `unobserved`.

### P3-T2 — kontrakt preview i rekord eksperymentu

**Pliki:** nowe `gsr/docs/patterns/product-preview.md`, `gsr/templates/preview-record-md.md`; opcjonalne sekcje istniejącego `gsr/templates/feature-md.md`.

Zaimplementuj sekcje 3–4 jako instrukcje i zwięzły szablon. Zachowaj zgodność ze starymi feature specs; brak sekcji preview nie blokuje zwykłego build. Nie wprowadzaj nowego parsera ani zależności bez konkretnej potrzeby strukturalnej. Artefakty projektu użytkownika powstają podczas użycia funkcji; szablon nie może udawać gotowego podglądu.

**Odbiór:** rekord jasno łączy pytanie, faktyczny artefakt, obserwację i decyzję; symulacja i nieprzetestowane zachowanie są odróżnione; wymagania mają wskazanego właściciela.

### P3-T3 — routing i wewnętrzny skill

**Pliki:** nowy `gsr/skills/preview/SKILL.md`; `gsr/skills/coordinate/SKILL.md`, `gsr/skills/scope-shaping/SKILL.md`, `gsr/skills/build/SKILL.md`, `gsr/skills/prd-generation/SKILL.md`; wzorce `task-coordination.md`, `feature-sketch.md`; tylko powiązane fragmenty `gsr/docs/phases/` i command wrappers.

Wprowadź wybór demonstracji i wewnętrzny skill. Rozdziel scope-only, preview-only i autoryzowany build. PRD ma zużywać ustalone decyzje i odnośniki, nie odtwarzać intake. Zachowaj sketch i istniejącą enumerację etapów. Sprawdź rzeczywisty kontrakt pakowania/discovery hosta, bez twierdzenia o automatycznym doborze skilla na podstawie samego frontmatter.

**Odbiór:** poprawka tekstu omija preview; diagram-only nie produkuje kodu; naturalne żądanie wchodzi w odpowiedni krok; preview nie wymusza pełnego PRD ani nowej komendy.

### P3-T4 — demonstracje dostępne do obejrzenia

**Pliki:** instrukcje preview i pattern z T2–T3; syntetyczne przykłady/fixtures pod `scripts/fixtures/phase-3/`; niewielki publiczny przykład pod planowanym `gsr/examples/product-preview/`.

Przygotuj przykład rezerwacji: mapa z pytaniem o konto, reprezentatywny ekran i jedna ścieżka lokalna. Przykład demonstruje możliwości, ale nie narzuca aplikacjom użytkownika domeny, stacku lub estetyki. Dodaj oddzielne wejście CLI/transformacji danych w fixtures. Przetestuj sposób otwarcia, istotną interakcję i stany związane z pytaniem; zapewnij fallback bez renderera Mermaid i bez narzędzia browser.

**Odbiór:** użytkownik otrzymuje istniejący artefakt i realny sposób otwarcia; ograniczenia są widoczne; działanie usług nie jest wywnioskowane z atrakcyjnego UI. W demonstracji wizualnej sprawdź czytelność i obsługę klawiaturą w objętej ścieżce. Nie deklaruj pełnego audytu dostępności.

### P3-T5 — feedback, D-piny, resume i przejście do build

**Pliki:** `gsr/docs/patterns/deferred-decisions.md`, `stage-handoff.md`, `task-handoff.md`; właściwe fragmenty preview/scope/PRD/build/verification i `gsr/templates/feature-md.md`. `gsr/lib/` i testy resume/freshness zmieniaj wyłącznie, gdy istniejące zachowanie rzeczywiście nie obsługuje kontraktu.

Dodaj checkpoint po użytecznym eksperymencie oraz właściciela decyzji w focused feature. Feedback aktualizuje właściwe wymagania, zachowuje ID i historię, a handoff przenosi aktualny wariant, ograniczenia i cadence. Obsłuż zmianę treści wymagania pod tym samym ID, zniknięcie artefaktu i późniejsze zawężenie autoryzacji. W build jawnie zdecyduj reuse/adapt/discard. Nie przebudowuj całego lifecycle pinów.

**Odbiór:** P3-S4/S5/S6/S10/S11 działają w faktycznych próbach; stare rekordy pozostają obsługiwane; brak automatycznej akceptacji na podstawie testu lub „dalej”. Testy strukturalne nie zastępują prób modelowych.

### P3-T6 — krótka mapa postępu

**Pliki:** `gsr/commands/status.md`, odpowiednie wskazówki koordynacji i raportowania; istniejący wzorzec stage-handoff tylko jeśli potrzebny.

Dodaj widok z sekcji 5, uwzględniając focused feature bez STATE, alternatywny DOC_ROOT i brakujące/stare dane. Routing statusu dla focused feature jest już naprawiony przez V3 przed Fazą 3; wykorzystaj go, nie duplikuj zadania naprawczego. Korzystaj z istniejącego discovery i observation API. Nie dodawaj serwera, bazy grafu ani wymagania renderowania Mermaid.

**Odbiór:** status pokazuje właściwy etap/następną akcję i ograniczenia, pozostaje read-only, nie myli stanu wykonania z aktualnością sprawdzeń i nie wymusza kompletnego pipeline.

### P3-T7 — regresje, próby rzeczywiste i raport

**Pliki:** właściwe testy/fixtures pod `scripts/`, `package.json` tylko dla uzasadnionych kontroli, `scripts/check-doc-links.js`, przyszły raport implementacji i ledger ewaluacji Fazy 3.

Obecny checker linków obejmuje nazwy `phase-[12]`; rozszerz go na nowe dokumenty faz bez listy ograniczonej do 1/2. Sprawdź kompletność walidacji pakietu po dodaniu skilla i przykładów. Nie pisz testów, których jedynym znaczeniem jest obecność zdania w prompcie. Testuj rzeczywistą logikę pomocników, jeśli ją zmieniasz, oraz działanie przykładów. Uruchom pełne `npm run check` po złożeniu zmian.

Zrealizuj macierz z sekcji 7 na dostępnym, autoryzowanym hoście/modelu. Instancja Sola implementująca plugin nie jest automatycznie testem produktu. Odnotuj host, faktycznie użyty model i narzędzia. Brak dostępu/inferencji pozostawia część live niesprawdzoną; kontynuuj niezależne prace. Nie instaluj ani nie wykupuj narzędzi tylko po to, aby ledger miał zielone pola.

**Odbiór:** rozdzielone wyniki deterministyczne, discovery/startup, zachowania modelu i akceptacji użytkownika. Fałszywy PASS, utrata decyzji i naruszenie review boundary są błędami do naprawy. Nie nazywaj prompt inspection dowodem działania.

### P3-T8 — gotowość wydania GSR

**Pliki:** `README.md`, demo z T4, raport Fazy 3, [backlog](../../BACKLOG.md), ewentualne korekty [instrukcji release](../releasing.md) wynikające z rzeczywistych prób.

Pokaż krótką ścieżkę użycia i sprawdzony przykład. Sprawdź świeżą instalację i aktualizację z poprzedniego wydania na izolowanej konfiguracji, zachowanie ustawień użytkownika, discovery oraz jeden pełny przebieg na zainstalowanej kopii. Przygotuj zestaw zmian i opis wydania na podstawie zaimplementowanego zachowania. Istniejące zmiany Faz 1–2 muszą znaleźć się w kandydacie do wydania; nie wolno przypadkiem wydać tylko nowej fazy.

Uwzględnij `scripts/release.js`: sprawdza czysty working tree i buduje changelog z commitów. Przygotuj zakres przyszłych commitów/wersji i dry-run, gdy stan repo/narzędzia na to pozwalają. Nie wykonuj commitów, tagów, push ani publikacji bez obejmującej je instrukcji; dokument planu nie jest taką instrukcją. Żaden unrelated plik nie może trafić do stagingu/pakietu. Wersję i zakres wspieranych hostów zaproponuj na podstawie końcowych zmian i obserwacji, nie samej nazwy fazy.

**Odbiór:** opisany kandydat do wydania, rzeczywiste wyniki z sekcji 8 i konkretna następna czynność release. Faza 4 nie stanowi zależności wydania Fazy 3.

## 7. Scenariusze odbioru

Scenariusze są wejściami do ewaluacji, nie nowymi bramkami pytań dla użytkownika. Początkowy status każdego: **unobserved**.

| ID | Wejście | Oczekiwany obserwowalny wynik |
|---|---|---|
| P3-S1 | „Zaplanuj rezerwację wizyty. Pokaż sam przepływ, bez kodu; konto jest jeszcze otwartą decyzją.” | Mapa ujawnia decyzję o koncie; nie powstaje kod aplikacji ani fikcyjne rozstrzygnięcie |
| P3-S2 | „Pokaż dwa różne układy ekranu wyboru terminu i poczekaj.” | Dwa istniejące, znacząco różne warianty; jasno wskazana różnica; brak pełnego build i wyboru za użytkownika |
| P3-S3 | Istniejąca aplikacja z komponentami/design systemem; preview nowej funkcji | Reuse stylów i komponentów; brak nowego stacku i arbitralnego redesignu |
| P3-S4 | Po S2: „Wybieram B, usuń osobne potwierdzenie; wdroż lokalnie i sprawdź.” | Aktualizacja właściwych wymagań i recordu, wpływ zmiany, dalsza praca w autoryzowanym zakresie bez drugiej zgody na ten sam build |
| P3-S5 | Zapisz etap po wyborze B; rzeczywiste `/clear`, potem „dalej” | Model odczytuje minimalne referencje, pamięta B/zmianę/ograniczenia i właściwą następną akcję bez odtwarzania rozmowy; wariant z zachowanym „poczekaj po fragmencie” respektuje pauzę |
| P3-S6 | Po checkpoint zmień treść wymagania pod tym samym ID; osobno usuń artefakt preview | Rozbieżność/brak zostają wykryte, stary preview nie jest przedstawiany jako aktualny ani sprawdzony; brak fałszywego PASS |
| P3-S7 | „Popraw literówkę przycisku, zachowaj układ.” | Bounded quick, bez preview, pytań o kierunek, pełnego scope i resetu |
| P3-S8 | CLI/no UI: ryzyko transformacji syntetycznego pliku | Wąski rzeczywisty eksperyment wejście/wyjście; brak wymuszonego mockupu webowego |
| P3-S9 | Preview na hoście bez renderera Mermaid / osobno bez browser tool | Czytelny diagram tekstowy / istniejący artefakt do ręcznego obejrzenia; jawny brak kontroli wizualnej; żadnej cichej instalacji |
| P3-S10 | UI z symulowanym zapisem; użytkownik mówi „wygląda dobrze” | Potwierdzenie dotyczy wyglądu; symulowany zapis nadal nie jest zweryfikowany, finalna implementacja wymaga rzeczywistego sprawdzenia |
| P3-S11 | D-pin nadal odroczony; później „od teraz tylko review” | Bez wymuszonego rozstrzygnięcia i bez kolejnych edycji produktu po zawężeniu; niezależna inspekcja może trwać |
| P3-S12 | Status-only, focused feature bez PRD/STATE, alternatywny DOC_ROOT; osobno stale evidence przy ukończonym fragmencie | Właściwa mapa/ograniczenie, bez testów i build; wykonany fragment i nieaktualne sprawdzenie rozróżnione |
| P3-S13 | Zainstalowany kandydat: brief → preview → korekta → reset → build → verify | Docelowa funkcja odzwierciedla korektę; atrapy nie udają produkcyjnego działania; wynik ma rzeczywiste dowody i pozostałe ograniczenia |

Funkcjonalne warunki prób S1–S8 z Fazy 1 oraz C1–C12 z Fazy 2 nadal wymagają obserwacji zgodnie z ich kontraktami. Porównawcze pomiary efektywności z tych kontraktów są odroczone zgodnie z decyzją z 2026-10-15. Wspólny przebieg może pokryć kilka przypadków tylko przy jawnym mapowaniu ich warunków poprawności i wyników. Nie zastępuj faktycznego `/clear` wywołaniem parsera ze sztucznym polem `source=clear`. Zachowaj warianty partial/checked checkpoint oraz direct-command z Fazy 2.

Zapis pojedynczej próby poprawności: ID, rewizja wejścia, host/model/wersja jeśli widoczna, narzędzia, faktyczne kroki, rezultat, referencje dowodów i naruszenia kontraktu. Pola czasu/kosztu i tarcia w istniejących ledgerach mogą pozostać `null`/`unobserved`; nie uruchamiaj dodatkowych prób w celu ich uzupełnienia. Nie zapisuj pełnych transkryptów ani danych osobowych domyślnie.

**Odroczone do okresu po Fazie 4 i udostępnieniu użytkownikom:** porównanie z wcześniejszym workflow, pomiar czasu do feedbacku, kosztów, powtarzanych wyjaśnień i zakresu przeróbek oraz pilot efektywności z użytkownikami. Zachowaj wejścia i wersje do przyszłego porównania. Te badania nie są kryterium odbioru Fazy 3; korzyść produktowa pozostaje hipotezą do czasu pomiaru.

## 8. Warunek zakończenia i deploy

Rozdziel trzy stany:

1. **Implementacja zakończona:** T1–T6 dostarczone, właściwe regresje/testy lokalne z T7 przeszły, raport wskazuje wszystkie braki live. To nie jest jeszcze gotowość publicznego wydania.
2. **Kandydat gotowy do wydania:** T7–T8 zakończone, wszystkie mające zastosowanie warunki poprawności P3-S1–S13 oraz odziedziczone S/C mają rzeczywiste wyniki na deklarowanym hoście; instalacja/upgrade i przebieg na zainstalowanej kopii sprawdzone; brak znanego fałszywego PASS, utraty decyzji lub naruszenia granic. Porównania efektywności i pilot korzyści UX nie należą do tego kryterium. N/A wymaga rzeczowego powodu; nie zastępuje brakującego narzędzia lub czasu. Model implementujący i host docelowy są zapisane oddzielnie.
3. **Wydano:** rzeczywisty release/tag/publikacja oraz kontrola instalacji opublikowanej wersji. Sama lokalna gotowość nie oznacza deployu. Publikację wykonaj dopiero w ramach instrukcji, która ją obejmuje.

Nie obiecuj redukcji czasu/kosztu ani pełnej zgodności innych hostów bez obserwacji. Jeśli części live nie można uruchomić, dokumentuj konkretną przeszkodę i pozostaw release readiness jako niesprawdzone. Nie otwieraj Fazy 4, aby ominąć niedokończone kryteria Fazy 3.

## 9. Prompt startowy dla Sola

Poniższy tekst jest przeznaczony do użycia przez właściciela w późniejszej sesji wykonawczej:

```text
Zaimplementuj Fazę 3 GSR według
docs/internal/research/2026-10-14-phase-3-handoff.md.
Pracuj jako Sol wybrany w tej sesji; nie zmieniaj modelu i nie uruchamiaj
dodatkowych agentów/modeli bez osobnego zlecenia.

Autoryzuję zmiany kodu i dokumentacji oraz lokalne sprawdzenia w granicach
poprawek V1–V5 z docs/internal/plans/2026-10-15-phase-1-2-corrections.md
oraz P3-T1–P3-T8. Zachowaj working tree Faz 1–2 i wszystkie niezwiązane pliki;
nie czytaj ani nie kopiuj CV. Nie resetuj repo do HEAD.

Zacznij od raportów Faz 1–2 i aktualnego stanu repo. Zrealizuj i sprawdź V1–V5
przed rozpoczęciem P3-T1; jeśli są już wykonane, sprawdź dowody i nie powtarzaj ich.
Testy poprawności wykonuj na bieżąco. Benchmarki kosztu/czasu i badania
efektywności UX zostaw na okres po ukończeniu Faz 1–4 i oddaniu narzędzia userom.
Utwórz wewnętrzny plan i wykonuj zadania kolejno. Po każdym zapisz rzeczywiste
wyniki i pozostałe ograniczenia. Nie pytaj ponownie o rozpoczęcie zatwierdzonych
prac. Zachowaj istotne granice decyzji produktowych i późniejsze ograniczenia.

Preview ma być częścią scope/build: dobór mapy, kierunku wizualnego lub wąskiej
interakcji; feedback ma zmieniać wymagania i przetrwać /clear → dalej.
Zachowaj --sketch, stare projekty, istniejącą semantykę dowodów i etapów.

Na granicy dużego etapu zapisz handoff i minimalny read set, potem wskaż
/clear → dalej. Nie automatyzuj resetów. Nie implementuj Fazy 4.

Próby host/model wykonuj w zakresie dostępnej autoryzacji; ten prompt nie
autoryzuje nowych płatnych usług ani instalacji. Braki live zapisz jako
unobserved, kontynuując niezależne prace. Testy lokalne nie dowodzą zachowania
modelu. Przygotuj gotowość release'u; nie commituj, taguj, pushuj ani publikuj
w ramach tego zlecenia. Raport końcowy ma oddzielić implementację, wyniki live
i gotowość do wydania oraz podać konkretny następny krok.
```
