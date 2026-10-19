# Plan: domknięcie Faz 1–2 przed Fazami 3–4

Data: **2026-10-15**. Status: **V1–V5 zaimplementowane i sprawdzone lokalnie; 2026-10-15**.

Decyzja właściciela: wszystkie pięć poprawek z [weryfikacji Faz 1–2](../research/2026-10-14-phase-1-2-verification.md) należy wykonać przed rozpoczęciem Fazy 3 i Fazy 4. Testy efektywności produktu odbędą się po ukończeniu wszystkich czterech faz i udostępnieniu narzędzia użytkownikom. Pierwotne zlecenie dotyczyło planu. Instrukcja właściciela z 2026-10-15 autoryzuje wykonanie V1–V5, następnie Fazy 3 oraz planu i implementacji Fazy 4, bez commitów i publikacji.

## Kolejność i warunek wejścia

**V1–V5 → sprawdzenie poprawek → Faza 3 → Faza 4 → udostępnienie kompletnego narzędzia użytkownikom → pomiar efektywności.**

Ten blok wykonujemy raz przed Fazą 3. Przed Fazą 4 sprawdzamy jego ukończenie i brak regresji w zmienianych obszarach; nie powtarzamy naprawionych zadań. Samo przygotowanie dokumentów Faz 3–4 nie oznacza rozpoczęcia ich implementacji.

Milestone wydania po Fazie 3 pozostaje w jej dokumencie. Ewentualne wcześniejsze wydanie nie uruchamia programu badań efektywności ani nie stanowi warunku uzyskania wyników tych badań przed Fazą 4.

## Zadania

| ID | Poprawka | Zakres plików | Warunek odbioru | Status |
|---|---|---|---|---|
| V1 | Domyślne sprawdzenia obejmują wszystkie required | `gsr/lib/config.js`, `scripts/test-runner.js`, kontrakt weryfikacji i przykład konfiguracji | Dopisanie required poza dotychczasową listą default nie może dać passing bez uruchomienia tej kontroli; named profiles zachowują jawny podzbiór | completed locally |
| V2 | Dane nawigacji nie unieważniają poprawnych wyników | manifesty w `gsr/commands/`, `gsr/lib/fingerprint.js`, testy freshness, kontrakt | Sama zmiana `last_command`/timestamp między build a verify nie wywołuje stale; zmiana kodu/wymagań nadal wywołuje stale | completed locally |
| V3 | Status obsługuje focused feature i właściwy następny krok | `gsr/commands/status.md`, powiązany kontrakt koordynacji i fixtures | Jawne zadanie/feature i aktualny next step mają pierwszeństwo przed legacy phase/scope fallback; brak pełnego PRD/STATE nie oznacza restartu scope ani braku decyzji | completed locally |
| V4 | Równoważny docRoot ma identyczną normalizację | `gsr/lib/project.js` lub `fingerprint.js`, testy discovery/freshness | `docs`, `./docs`, `docs/` identycznie traktują administracyjny postęp dokładnego szablonu planu; zmiana treści zadania nadal unieważnia wynik | completed locally |
| V5 | Niepowiązane nagłówki nie psują referencji handoffu | `gsr/lib/stage-packet.js`, `task-handoff.js` tylko w potrzebnym zakresie, testy handoff/packet | Unikalny `#Task Context` działa mimo powtórzonych `### Notes` gdzie indziej; niejednoznaczny lub brakujący cel nadal jest diagnostyczny | completed locally |

### Wskazówki wykonawcze

- **V1:** default powinien obejmować zbiór wszystkich required; jawna lista nie może go uszczuplać. Można zachować wskazane kontrole opcjonalne. Nie zmieniaj celowego zachowania innych nazwanych profili i nie ukrywaj brakującego pokrycia w komunikacie.
- **V2:** usuń zbędny zapis albo normalizuj tylko rozpoznane pola administracyjne. Nie wykluczaj całego manifestu bez uwzględnienia nieznanych pól i tożsamości projektu. Sprawdź zarówno samą zmianę nawigacji, jak i rzeczywistą zmianę źródeł/konfiguracji.
- **V3:** odczytaj aktualny wskazany feature/Active Task i rzeczywiste decyzje, również bez PRD. Status pozostaje read-only: nie uruchamia build ani testów. Naprawę tę przejmujemy z długu wskazanego przy P3-T6; w Fazie 3 zostaje dodanie mapy postępu, nie ponowne naprawianie routingu.
- **V4:** porównuj znormalizowane ścieżki względne bez osłabienia kontroli traversal/symlinków. Nie rozszerzaj normalizacji niejednoznacznych dokumentów.
- **V5:** zawęź sprawdzanie niejednoznaczności do żądanego celu. Zachowaj obsługę fenced headings, uszkodzonego Markdown, brakujących plików, zdublowanego celu i niebezpiecznych referencji. Nie wyłączaj globalnie diagnostyki potrzebnej innym konsumentom parsera.

## Weryfikacja wymagana teraz

1. Zachować bieżące zmiany Faz 1–2 i niezwiązane pliki. Nie resetować do HEAD; nie czytać ani nie kopiować CV.
2. Dla każdej poprawki odtworzyć problem i sprawdzić naprawę. Dla kodu dodać celową regresję; dla instrukcji statusu sprawdzić scenariusz focused feature i spójność ścieżek, nie tylko obecność zdania.
3. Po złożeniu poprawek uruchomić `npm run check` oraz adekwatny smoke integracyjny w izolowanej konfiguracji. Zachować rozróżnienie testu parsera, startupu hosta i rzeczywistego zachowania modelu.
4. Zapisać wyniki V1–V5 i pozostałe ograniczenia. Blok jest zakończony, gdy odtworzone błędy są usunięte, adekwatne kontrole przechodzą i nie ma nierozwiązanej regresji w dotkniętych ścieżkach.

To kontrola poprawności, nie badanie efektywności. Nie wymaga pomiaru oszczędności ani rekrutacji użytkowników. Testy działania funkcji, resume, instalacji, granic autoryzacji i fałszywego PASS nadal towarzyszą wdrażaniu kolejnych faz. Nieuruchomione próby nie stają się zaliczone przez odroczenie badań.

## Efektywność — dopiero po czterech fazach i udostępnieniu użytkownikom

Odroczone są: pilot porównujący korzyści UX, benchmark kosztów/czasu, pomiar powtarzanych pytań i ręcznych interwencji oraz porównanie GSR z wcześniejszymi wersjami lub pracą bez GSR. Nie są warunkiem rozpoczęcia ani zakończenia implementacji Faz 3–4.

Podczas developmentu wystarczy zachować wersje, syntetyczne wejścia i zwykłe dowody sprawdzeń, które później umożliwią uczciwe porównanie. Nie uruchamiaj osobnego benchmarku ani nie buduj telemetrii w ramach tego bloku.

Po ukończeniu Faz 1–4 i oddaniu narzędzia użytkownikom oceń koszt dojścia do poprawnego wyniku, czas, poprawki, interwencje i wygodę pracy na rzeczywistych zadaniach. Korzystaj z dostępnych danych i uzgodnionego feedbacku; nie dopisuj niewidocznych kosztów ani automatycznego zbierania danych. Do tego czasu redukcja kosztu i poprawa efektywności pozostają celami produktu, bez deklaracji zmierzonych oszczędności.

## Wyniki wykonania — 2026-10-15

- V1: `config.select` łączy jawny default ze wszystkimi required; nazwane profile zachowują podzbiór. Nowy test odtworzył pominięcie `added`, po naprawie runner uruchamia tę kontrolę i zachowuje jej exit 7 jako failure.
- V2: fingerprint rozpoznanego manifestu normalizuje tylko top-level `last_command`/`timestamp`. Tożsamość, nieznane pola, uszkodzony JSON i realne źródła pozostają objęte. Test przed naprawą: fałszywe stale; po: passing dla samej nawigacji, stale dla zmian istotnych.
- V3: status rozwiązuje jawny/current feature i pasujący Active Task przed legacy fallback; działa bez PRD/STATE, czyta rzeczywistego właściciela decyzji, brak ledgeru oznacza unknown. Cztery syntetyczne wejścia: `scripts/fixtures/corrections/status-scenarios.json`; test sprawdza realne referencje, decyzję D1, alternatywny DOC_ROOT i brak mutacji. Inspekcja instrukcji usuwa wcześniejsze wczesne wyjście i pierwszeństwo legacy NOT STARTED; nie jest próbą zachowania modelu.
- V4: canonical discovery normalizuje project-relative docRoot po walidacji traversal/symlink. Dla docs, ./docs i docs/ postęp dokładnego szablonu nie unieważnia wyniku, treść zadania nadal unieważnia.
- V5: parser zachowuje domyślną ścisłą diagnostykę; sprawdzanie referencji zawęża duplicate do celu. Unikalny Task Context przechodzi mimo powtarzanych Notes; brak/duplikat/kolizja slugu celu i uszkodzony Markdown pozostają diagnostyczne. Fenced headings nadal pomijane.

`node --test scripts/test-runner.js scripts/test-freshness.js scripts/test-stage-packet.js`: przed zmianą implementacji 22/26 pass, cztery celowe regresje fail; po 26/26 pass. `npm run check`: exit 0, 45 testów, 32 pliki JS, JSON, linki i wersje poprawne. Test fixture V3 początkowo porównał /var z canonical /private/var; poprawiono oczekiwanie na realpath, bez zmiany zachowania produktu. Końcowy pełny check powtórzono po dodaniu fixture V3.

`npm run smoke:host`: exit 0, Claude Code 2.1.274, SessionStart i packetDelivered true, 11 commands / 10 skills, modelInvoked false. To izolowany startup, nie rzeczywisty /clear ani próba modelowa. Zainstalowana kopia hooków/upgrade/preservation przechodzi w `check:install`. Brak znanej regresji deterministycznej w zmienianych ścieżkach; faktyczny routing modelu nadal unobserved, jak w Fazach 1–2.

Nie uruchamiano fingerprintu całego workspace: obejmowałby niezwiązany plik osobisty. Runner/freshness wykonywano wyłącznie na syntetycznych fixture; `npm run check` w workspace jest bezpośrednią obserwacją polecenia, nie przenośnym rekordem runnera. Nie wykonano resetu, stagingu, commitów ani publikacji, nie odczytano ani nie kopiowano CV. Jedno omyłkowe wyszukiwanie nazw AGENTS poza repo zostało przerwane; nie czytano znalezionych treści.

Następny krok: P3-T1 z handoffu Fazy 3. Nie powtarzać napraw V1–V5; przed Fazą 4 sprawdzić brak regresji w ich obszarach. Badania efektywności pozostają odroczone.

Kompaktowa kontynuacja całego zlecenia: [handoff rozwoju](2026-10-15-development-handoff.md).
