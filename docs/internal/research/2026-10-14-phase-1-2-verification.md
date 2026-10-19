# Weryfikacja Faz 1–2 — technika i kierunek produktu

Data: **2026-10-14**. Zakres: bieżący working tree Faz 1–2, ich kontrakty i sens produktowy przed kolejnymi fazami. To przegląd, nie implementacja poprawek.

**Decyzja właściciela z 2026-10-15:** V1–V5 trafiły do [planu poprawek przed Fazami 3–4](../plans/2026-10-15-phase-1-2-corrections.md). Historyczną rekomendację pilotażu efektywności przed dalszą realizacją zastępuje termin po ukończeniu wszystkich czterech faz i udostępnieniu narzędzia użytkownikom. Testy poprawności pozostają bieżącą częścią developmentu. Wyniki i ustalenia przeglądu poniżej zachowują datę 2026-10-14.

## Werdykt

**Kierunek obu faz był dobry. Faza 1 naprawia fundament wiarygodności; Faza 2 adresuje konieczność ręcznego prowadzenia procesu przez użytkownika. Nie ma powodu ich wycofywać ani przepisywać od początku.**

Nie potwierdzam jednak, że „wszystko jest OK” lub że obie fazy są w pełni zweryfikowane. Aktualny zestaw 40 testów przechodzi, ale dodatkowe próby ujawniły lukę w doborze wymaganych sprawdzeń i kilka problemów zwiększających tarcie. Pełne scenariusze rozmowy z modelem pozostają niezaobserwowane. Korzyść Fazy 2 dla UX i kosztu jest uzasadnioną hipotezą, a nie zmierzonym wynikiem.

## Co rzeczywiście sprawdzono

Środowisko: Node **v26.0.0**, macOS, host smoke **Claude Code 2.1.274**. HEAD `fa92074`; implementacja objęta przeglądem zawiera także zmiany working tree i nowe pliki, nie sam HEAD.

| Kontrola | Wynik | Co potwierdza / czego nie potwierdza |
|---|---|---|
| `npm run check` | exit 0; 40/40 testów; 32 pliki JS; JSON, linki, wersje | Aktualne regresje i kontrakty strukturalne przechodzą; nie dowodzi kompletności testów ani zachowania modelu |
| `npm run smoke:host` | exit 0; `observed-startup`; SessionStart i packetDelivered true; 11 komend, 10 skilli | Natywny start ładuje plugin i kontekst; `modelInvoked:false`, bez rzeczywistego `/clear` → „dalej” |
| Niezależny przegląd Fazy 1 | 26/26 wybranych testów; trzy dodatkowe reprodukcje | Inspekcja instalacji, discovery, konfiguracji, runnera, freshness i hooków |
| Niezależny przegląd Fazy 2 | 11/11 wybranych testów; dodatkowa reprodukcja parsera | Inspekcja tras workflow, handoffu, research/skill reuse i zgodności instrukcji |
| Powtórzenie głównego błędu przez prowadzącego przegląd | `passing` z pominiętym wymaganym testem; `failed` po usunięciu jawnej listy default | Błąd doboru domyślnych kontroli jest odtwarzalny, nie tylko podejrzany w kodzie |

Wybrane testy przeglądów są podzbiorami tych samych 40 testów; nie sumujemy ich jako dodatkowego pokrycia. Reprodukcje korzystały z syntetycznych repozytoriów w katalogu tymczasowym. Nie czytano ani nie kopiowano CV i nie uruchamiano fingerprintu całego roboczego repozytorium zawierającego ten plik. Nie zmieniono implementacji, konfiguracji użytkownika, commitów ani wydania. W ramach tej weryfikacji powstał raport i jego odnośnik w backlogu.

## Ustalenia techniczne

### V1 — domyślny profil może pominąć wymagany test

**Priorytet: poprawić przed wydaniem; naruszenie deklarowanego kontraktu weryfikacji.**

[config.js](../../../gsr/lib/config.js), linia 36, nadaje `profiles.default` pierwszeństwo przed zbiorem wszystkich wymaganych kontroli. [Kontrakt](../../../gsr/docs/patterns/verification-contract.md), linia 33, i gate deklarują „Default selects all required checks”. Przykład konfiguracji w tym samym dokumencie zawiera jawną listę `default`, więc błąd może powstać podczas zwykłego dopisania nowego wymaganego sprawdzenia.

Reprodukcja: tymczasowe repo Git z następującą `.gsr.json`, uruchomienie `run-checks.js --cwd <fixture>` bez `--profile`:

```json
{
  "schemaVersion": 1,
  "checks": [
    {"id":"build","argv":["node","-e","process.exit(0)"],"kind":"static","required":true},
    {"id":"tests","argv":["node","-e","process.exit(1)"],"kind":"test","required":true}
  ],
  "profiles": {"default":["build"]}
}
```

Faktyczny wynik: `status: passing`, exit 0, wykonano tylko `build`. Te same checks po usunięciu `profiles`: `status: failed`, exit 1, wykonano `build` i `tests`. W próbie użyto `process.execPath` jako ścieżki do Node. Record prawidłowo wymienia wykonany podzbiór; błędna jest gwarancja kompletności domyślnego wyboru.

Korekta: domyślny profil zawsze obejmuje wszystkie required albo walidacja odrzuca niepełną listę default. Nazwane profile częściowe zachowują celowo ograniczony zakres i jego opis. Dodać regresję „nowy required poza dotychczasowym default”. Powiązanie: B02/B10.

### V2 — zapis nawigacji unieważnia niezmienione wyniki

**Priorytet: poprawić przy domknięciu Faz 1–2; problem UX i zbędnych powtórek.**

[verify.md](../../../gsr/commands/verify.md), linia 10, podobnie jak inne wrappers, wymaga aktualizacji `.gsr-session.json` z `last_command` i timestampem. [fingerprint.js](../../../gsr/lib/fingerprint.js), linia 44, obejmuje ten nieignorowany plik. Zmiana samego manifestu z build na verify w syntetycznym projekcie zmieniła observation `passing` → `stale`, bez zmiany kodu lub wymagań.

To konsekwencja obecnej polityki hash-all, nie fałszywy PASS. Jednak normalne przejście między komendami może odbierać możliwość reuse i powodować ponowne kontrole. Korekta powinna dotyczyć precyzyjnie określonych danych administracyjnych lub zbędnego zapisu; nie wolno szeroko wykluczyć wymagań/nieznanych pól. Powiązanie: B03/B15.

### V3 — `/gsr:status` zachowuje ścieżkę niezgodną z focused feature

**Priorytet: poprawić przy domknięciu Fazy 2; sprzeczność instrukcji.**

[status.md](../../../gsr/commands/status.md), linie 14–20, kończy obsługę bez STATE, kierując do scope/learn. Linie 54–61 wybierają komendę na podstawie faz i istnienia scope, mimo że poprawna pojedyncza funkcja może istnieć bez pełnego PRD/scope. Saved Active Task z `Next step: verify` może otrzymać konkurencyjną sugestię `/gsr:scope`. Linie 47–49 traktują brak PRD jako brak otwartych założeń.

To potwierdzona sprzeczność w źródłach, nie zaobserwowany błędny wybór modelu. Korekta: pierwszeństwo aktualnego wskazanego zadania i focused spec; legacy fallback dopiero przy braku takiego kontekstu. Powiązanie: B06/B11/B15. Plan Fazy 3 już przewiduje korektę statusu; uznać ją za istniejący dług integracji, nie nową wartość preview.

### V4 — równoważne zapisy docRoot wywołują różne freshness

**Priorytet: drobna poprawka.**

[fingerprint.js](../../../gsr/lib/fingerprint.js), linia 81, porównuje ścieżki Git z surowym `project.docRoot`. Akceptowane konfiguracje `docs`, `./docs` i `docs/` nie zachowują się identycznie. Zmiana tylko kolumn Status/Evidence w planie zgodnym z dokładnym szablonem:

```text
docs    → hash bez zmiany, normalizacja zapisana
./docs  → hash zmieniony, brak normalizacji
docs/   → hash zmieniony, brak normalizacji
```

Korekta: normalizacja prefiksu względnej ścieżki przed dopasowaniem. Nie zaobserwowano nieuzasadnionego passing; problem wywołuje zbędne reruny. Powiązanie: B03/B04.

### V5 — powtórzony niepowiązany nagłówek zakłóca handoff

**Priorytet: drobna poprawka.**

[stage-packet.js](../../../gsr/lib/stage-packet.js), linia 12, odczytuje wszystkie nagłówki przez `sections(..., true)`. [task-handoff.js](../../../gsr/lib/task-handoff.js), linia 41, odrzuca każdy powtórzony nagłówek. Odnośnik do unikalnego `#Task Context` w feature spec staje się diagnostyczny, gdy pod innymi sekcjami występują dwa zwykłe `### Notes`.

Wynik izolowanej próby: `status: diagnostic`, `Ambiguous duplicate section: Notes`. Istnieje bezpieczny fallback do uzgodnienia dokumentu. Korekta: wykrywać niejednoznaczność wskazanego celu, bez odrzucania niepowiązanych duplikatów. Powiązanie: B15.

## Ocena koncepcyjna

### Faza 1: właściwa inwestycja w wiarygodność

To było więcej niż cleanup. Wcześniejsze mechanizmy mogły traktować nazwę komendy jako sprawdzenie, zachować nieuzasadniony sukces po zmianie kodu lub mieć problem z instalacją. Rzeczywiste wyniki procesów, powiązanie ich z projektem i rewizją oraz rozdzielenie testu od akceptacji człowieka są niezbędne, jeśli GSR ma później wykonywać więcej pracy samodzielnie.

Dobra decyzja: deterministyczny kod odpowiada za obserwowalne fakty, a model za interpretację celu i dobór działania. Usunięcie bramek opartych na sformułowaniach i nadmiarowych potwierdzeń ma też bezpośredni sens UX. V1 wskazuje niedokończony szczegół egzekwowania kontraktu, a nie wadliwość tego kierunku.

Granica dalszej inwestycji: nie rozbudowywać fundamentu w abstrakcyjny system dowodów dla każdego możliwego środowiska. Naprawić odtworzone luki, zachować jawne ograniczenia i sprawdzić użycie w wybranym hoście.

### Faza 2: właściwy problem, jeszcze nieudowodniony efekt

Najsilniejsza zmiana produktowa to **istniejąca aplikacja → jedna opisana funkcja → realizacja**, bez odtwarzania całego PRD i ponownego uzgadniania podanych parametrów. Reuse researchu oraz dobór aktualnie dostępnych skilli odpowiadają na życzenie właściciela: użytkownik ma zlecać rezultat, a nie pamiętać zestaw komend i metod.

Trwały checkpoint z następną akcją i ograniczeniami jest dobrym pomostem do Autopilota. Mały read set pomaga wznowić pracę, a zachowanie decyzji i rozdzielenie częściowego postępu od ukończenia zapobiega restartowaniu zadania od początku. To sensowna rozbudowa istniejącego hosta zamiast przedwczesnej budowy nowego runtime.

Nie jest jednak dowiedzione, że koszt instrukcji i uzgadniania stanu jest mniejszy od zaoszczędzonej pracy. Koordynator i powiązane wzorce dokładają obszerną warstwę instrukcji, a workflow build zawiera także kolejne przeglądy. Ich wartość trzeba ocenić po wykrywanych błędach i koszcie poprawnego wyniku. Sama liczba zapisanych reguł nie jest miarą jakości.

### Co koncepcyjnie wymaga pilnowania

1. **Dokumentacja ma obsługiwać użytkownika, nie stawać się jego zadaniem.** Modele mogą zapisywać stan i dobierać skille; użytkownik powinien oglądać rezultat, istotne trade-offy i konkretne pytania. Nowy dokument/rekord musi mieć rzeczywistego konsumenta i usuwać potrzebę ponownego wyjaśniania.
2. **Checkpoint jest wartością, ręczny reset jest kosztem obsługi.** Obecne `/clear` → „dalej” to świadomie uzgodniony kompromis dla długich prac, nie dowód pełnej automatyzacji. Drobne zadania omijają reset; build dopuszcza także wyraźnie zleconą praktyczną kontynuację. Faza 4 powinna zachować trwałość checkpointów, a automatyzację granic sesji oprzeć na realnych możliwościach hosta i wynikach prób.
3. **Procedura nie może być taka sama dla literówki i ryzykownej funkcji.** Ścieżka quick i focused feature są poprawnym kierunkiem. Warto obserwować, czy modele faktycznie omijają zbędny research, preview, przeglądy i rytuały przy małych zmianach.
4. **Więcej review nie zawsze oznacza lepszy wynik za tę samą cenę.** Mierzyć dodatkowo wykryte istotne błędy, powtórki i czas; nie usuwać kontroli tylko dla kosztu, ale też nie rozszerzać ich bez zaobserwowanej wartości.
5. **Następny etap powinien dać widoczną wartość.** Preview w Fazie 3 wykorzystuje decyzje i ciągłość z Fazy 2. Autopilot w Fazie 4 wykorzystuje dowody Fazy 1 i checkpointy Fazy 2. Kolejność jest spójna; kolejne miesiące samego porządkowania nie są potrzebne.

## Co pozostaje niezweryfikowane

[Raport Fazy 1](2026-10-11-phase-1-implementation.md) pozostawia live S1–S8 bez wyników, a [raport Fazy 2](2026-10-13-phase-2-implementation.md) i ledger pozostawiają C1–C12 bez obserwacji modelowych. Ten przegląd potwierdził startup hosta, ale nie wykonał rzeczywistej rozmowy `/clear` → „dalej”, pomiaru doboru/reuse skilli ani pilotażu użytkowników. Przegląd przez agentów nie zastępuje testu zainstalowanego pluginu w takim przebiegu.

Nie ma więc podstaw do twierdzeń o zmierzonej redukcji kosztu, czasu lub pytań. Brak tych wyników nie dowodzi, że UX jest zły; oznacza, że zasadnicza obietnica Fazy 2 czeka na sprawdzenie.

## Historyczna rekomendacja z 2026-10-14

Termin badań efektywności z punktów 2–3 poniżej został zmieniony decyzją z 2026-10-15 opisaną na początku raportu. Do wykonania obowiązuje podlinkowany plan poprawek i aktualne dokumenty Faz 3–4.

**Zachować kierunek, wykonać ograniczone domknięcie jakości i przejść do wartości widocznej dla użytkownika.**

1. Naprawić V1 z regresją oraz V2/V3, żeby nie przenosić pomijania kontroli i zbędnych przejść do preview/Autopilota. V4/V5 są małymi, odtworzonymi usprawnieniami tej samej ścieżki.
2. Przeprowadzić mały rzeczywisty pilot: focused feature bez pełnego PRD, literówka bez ceremonii, reset/resume ze zmianą plików i zachowaną granicą review oraz późniejsze „tylko review”. To szybka kontrola kierunku; nie zastępuje reszty S/C do pełnej deklaracji walidacji.
3. Obserwować poprawność wyniku, niepotrzebne pytania, powtarzane czytanie/research, ręczne interwencje i dostępne zużycie. Wykorzystać istniejące wejścia i ledger, bez nowej platformy benchmarkowej.
4. Kontynuować Fazę 3, a potem ograniczony zakres Autopilota z Fazy 4. Przed publicznym wydaniem zamknąć wymagane próby live zgodnie z kontraktami faz. Dalszą rozbudowę mechanizmów uzasadniać obserwowanymi problemami, nie samą ambicją automatyzacji.

Ocena końcowa: **Faza 1 — potrzebna i trafna, z odtworzoną luką do naprawy. Faza 2 — trafny kierunek, implementacja wymaga kilku korekt, a korzyść UX/kosztowa pozostaje do potwierdzenia.**
