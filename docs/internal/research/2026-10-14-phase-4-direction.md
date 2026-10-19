# Faza 4 — GSR Autopilot

Data: **2026-10-14**. Status: **właściciel zaakceptował wszystkie cztery punkty i zlecił ich zapisanie w Fazie 4; implementacja nierozpoczęta**.

Aktualizacja **2026-10-15**: [poprawki V1–V5 z przeglądu Faz 1–2](../plans/2026-10-15-phase-1-2-corrections.md) są warunkiem wejścia do Faz 3–4. Wykonujemy je przed Fazą 3; przed Fazą 4 potwierdzamy ich ukończenie. Badania efektywności przeprowadzamy dopiero po ukończeniu wszystkich czterech faz i udostępnieniu narzędzia użytkownikom. Testy poprawności i wykonalności integracji pozostają częścią developmentu.

## Cel i decyzja o kierunku

**Użytkownik zleca zmianę, określa granice, a GSR prowadzi ją do sprawdzonego wyniku, ograniczając zbędną pracę, zużycie kontekstu i konieczność ręcznego zarządzania procesem.** Faza 3 pozwala wcześniej zobaczyć produkt; Faza 4 upraszcza jego dalsze rozwijanie.

Właściciel zaakceptował cztery punkty opisane poniżej i poprosił o zaznaczenie przyszłego rozwoju punktu 3 przy ewentualnej Fazie 5. To aktualny kierunek Fazy 4. Wcześniejsza propozycja „od działającego projektu do pierwszego użycia” zostaje odłożona w backlogu B22–B25, bez przypisywania jej numeru kolejnej fazy.

Deploy samego GSR nadal następuje po Fazie 3. Faza 4 nie jest jego zależnością. Niniejszy dokument zapisuje zakres produktowy; szczegółowy handoff wykonawczy i implementacja są kolejnymi krokami.

Podstawa w [backlogu](../../BACKLOG.md): B11/B15 — koordynacja i konsekwencje decyzji; B13/B14 — wykorzystanie researchu i skilli; B07/B16 — powiązania wymagań, implementacji i dowodów; B18/B19/B20 — pomiar kosztu, dobór wykonania i proporcjonalna weryfikacja. Faza 2 już zawiera instrukcje reuse i minimalny read set. Nowy zakres dodaje mechanizm przygotowania i kontroli wykonania na podstawie aktualnego projektu, nie tylko kolejne instrukcje dla modelu. Pełne pozycje backlogu nie zostają przez to zamknięte.

## Doświadczenie użytkownika

> „Rezerwacja ma działać bez konta. Zachowaj obecny wygląd. Zrealizuj i sprawdź.”

GSR rozpoznaje dotknięte wymagania, formularz, zapis rezerwacji i potwierdzenie. Ujawnia istotną otwartą decyzję, np. sposób anulowania bez konta. Przygotowuje ograniczone zadania z potrzebnym kontekstem, realizuje je w autoryzowanym zakresie, zapisuje postęp i sprawdza wynik. Użytkownik otrzymuje porównanie przed/po, faktyczne wyniki sprawdzeń i pozostałe decyzje.

## 1. „Zmień to” — rozpoznawanie konsekwencji

GSR utrzymuje aktualizowaną mapę **wymaganie → fragment implementacji → sprawdzenie**. Po zleceniu zmiany ustala obszary do przeczytania, modyfikacji i ponownej weryfikacji. Użytkownik otrzymuje krótki opis konsekwencji oraz rzeczywiście nierozstrzygnięte decyzje produktowe.

Mapa jest wyprowadzana z aktualnych źródeł, wymagań i obserwacji; nie zastępuje tych źródeł. Niepełne lub nieaktualne powiązanie powoduje rozszerzenie inspekcji. Samo znalezienie identyfikatora w kodzie nie dowodzi działania funkcji. Ograniczenie zestawu sprawdzeń musi wynikać z potwierdzonych zależności i kontraktu weryfikacji, a nie potrzeby uzyskania tańszego PASS.

**Efekt dla użytkownika:** można zlecić zmianę językiem produktu, a GSR ustala jej techniczne konsekwencje bez ponownego rozpoznawania całego projektu przy każdym zadaniu.

## 2. Kontekst przygotowany osobno dla każdego zadania

Przed krokiem wykonawczym GSR buduje niewielki pakiet: konkretny rezultat, potrzebne fragmenty specyfikacji i kodu, obowiązujące decyzje i ograniczenia, zależności oraz sposób sprawdzenia wyniku. Pakiet wynika z aktualnej mapy wpływu zmiany; przy brakującej informacji wykonawca może rozszerzyć odczyt.

Zakończony krok pozostawia wynik i referencje do dowodów dostępne kolejnym krokom. Aktualny research i wyniki są wykorzystywane ponownie tylko w granicach ich zastosowania i freshness. Pakiet nie może zgubić nadrzędnych ograniczeń, źródła autoryzacji ani żądanej częstotliwości review.

**Efekt dla użytkownika:** mniej wielokrotnego czytania historii, specyfikacji i niezwiązanych plików; mniejszy kontekst wykonania i mniej powtarzanych wyjaśnień. Oszczędność kredytów pozostaje wynikiem do zmierzenia, nie obietnicą opartą wyłącznie na krótszym prompcie.

## 3. Automatyczne wykonanie z ograniczeniem kosztownych pętli

Użytkownik może zlecić kilka poprawek wraz z granicami samodzielności. GSR prowadzi trwałą, sekwencyjną kolejkę kroków, zapisuje zakończone fragmenty i wznawia od miejsca przerwania po uzgodnieniu aktualnego stanu plików i dowodów. Zapis zakończenia nie powoduje bezwarunkowego pominięcia kroku po zewnętrznej zmianie.

Mechanizm rozpoznaje powtarzane próby bez nowego dowodu lub postępu. Zmienia podejście w ramach zlecenia albo zgłasza konkretną przeszkodę, zamiast bez końca ponawiać tę samą naprawę. Zachowuje ustalone ograniczenia zasobów i wskazuje faktycznie dostępne pomiary. Gdy host nie udostępnia kosztu kredytów, nie przedstawia przybliżenia jako twardego limitu wydatków.

Dobór modelu lub poziomu wysiłku jest uzupełnieniem tam, gdzie host zapewnia odpowiednią kontrolę, a uzgodniony zakres i pomiary uzasadniają zmianę. Pierwszeństwo ma usunięcie zbędnej pracy. Wskazany przez użytkownika model i granice kosztów pozostają obowiązujące.

**Zakres pierwszego wdrożenia:** jeden host, sekwencyjna kolejka, trwałe checkpointy, wznowienie i ograniczenie bezproduktywnych powtórek. Krótka próba techniczna ustala dostępne sterowanie sesją. Automatyczne przechodzenie między świeżymi sesjami zależy od potwierdzonych możliwości hosta; bez nich zachowaj jawny handoff `/clear` → „dalej”. Nie przedstawiaj ręcznego wznowienia jako pełnej autonomii.

> **Komentarz na przyszłość — potencjalna Faza 5:** punkt 3 będzie rozwijany dalej. Jeżeli zdecydujemy się na Fazę 5, kandydatami są bardziej samodzielna obsługa świeżych sesji, wykonywanie dłuższych kolejek bez nadzoru, lepszy dobór modelu i wysiłku w ramach budżetu oraz odzyskiwanie pracy po przerwaniach. Szczegółowy zakres wybierzemy na podstawie wyników Fazy 4 i możliwości hosta. Rozszerzenia te nie są warunkiem ukończenia Fazy 4 ani zatwierdzonym planem Fazy 5.

**Efekt dla użytkownika:** mniej ręcznego przełączania etapów, powtarzania zleceń i nadzorowania prób naprawy. Autopilot respektuje jawne granice review, późniejsze zawężenia zadania i istniejącą autoryzację.

## 4. Wynik „przed → po”

Domyślny raport pokazuje zmianę z perspektywy użytkownika: co się zmieniło, porównanie przed/po, co faktycznie sprawdzono i co pozostaje do rozstrzygnięcia. Dla UI może użyć obserwowanych widoków; dla CLI/API — przykładu wejścia i wyniku. Szczegółowe logi i dowody pozostają dostępne pod spodem.

Przykład:

> Usunięto obowiązek zakładania konta. Zobacz zmianę formularza. Sprawdzono rezerwację i zapis danych. Do rozstrzygnięcia pozostał sposób anulowania.

Raport powstaje z rzeczywistych artefaktów i obserwacji. Makieta, screenshot lub udany build nie dowodzą samodzielnie poprawnego zapisu danych. Zachowaj rozróżnienie wyniku implementacji, aktualności dowodów, niesprawdzonych obszarów i akceptacji człowieka.

**Efekt dla użytkownika:** łatwiejsza ocena rezultatu, mniej szumu i jasne decyzje wymagające jego udziału.

## Granice pierwszego wydania

Wszystkie cztery punkty należą do Fazy 4. Pierwsze wdrożenie obejmuje zmiany w istniejącym projekcie, jeden wybrany host i wykonanie sekwencyjne. Korzysta z fundamentów Faz 1–3; nie wymaga dashboardu, nowej platformy hostingowej ani orkiestracji wielu agentów. Wybór konkretnego hosta wymaga próby możliwości przed szczegółowym handoffem.

Publikacja, nowe koszty, instalacje i działania poza zleceniem zachowują rzeczywiste granice autoryzacji. Nie dodawaj rutynowych potwierdzeń dla pracy już objętej instrukcją. Przy zmianie wymagań, uszkodzonym checkpointcie albo niepełnej mapie nie zgaduj, że zadanie jest wykonane lub sprawdzone.

## Kryterium poprawności i późniejszy pomiar efektywności

Reprezentatywna zmiana przechodzi: zlecenie językiem produktu → mapa wpływu → ograniczone pakiety kontekstu → wykonanie z przerwaniem i poprawnym wznowieniem → rzeczywista weryfikacja → czytelne porównanie przed/po. W oddzielnym przypadku powtarzana nieskuteczna naprawa kończy się zmianą podejścia lub konkretną diagnozą, bez ukrytego przekroczenia ustalonych granic.

**Po ukończeniu Faz 1–4 i udostępnieniu narzędzia użytkownikom** porównuj te same zadania z zachowaną wersją bazową, przy zapisanych warunkach host/model/narzędzia. Wtedy mierz **koszt dojścia do poprawnego wyniku**, wliczając poprawki, powtórki i przerwania, oraz czas, odczyty/kontekst i interwencje użytkownika. Nie wymagaj tych pomiarów do rozpoczęcia ani odbioru Fazy 4. Podczas developmentu zachowaj jedynie wersje, wejścia i zwykłe dowody testów, bez odrębnego benchmarku. Nie obiecuj procentowej oszczędności przed pomiarem. Niedostępne koszty/kredyty pozostają nieznane; mniej tokenów nie musi oznaczać proporcjonalnie mniej kredytów.

Oszczędność nie może wynikać z pominięcia koniecznych sprawdzeń, zgubienia wymagań lub przekazania dodatkowej pracy użytkownikowi. Raportuj testy deterministyczne, zachowanie modelu i obserwacje użytkowników oddzielnie.

## Kolejność po Fazie 3

1. Potwierdzić ukończenie V1–V5 i Fazy 3; zachować jej milestone wydania. Nie czekać na badania efektywności ani pilot użytkowników przed implementacją Fazy 4.
2. Wykonać ograniczoną techniczną próbę możliwości jednego hosta; zachować wersję bazową bez uruchamiania pomiaru efektywności.
3. Przygotować handoff wykonawczy wszystkich czterech punktów, z konkretnymi plikami, kontraktami i scenariuszami.
4. Dostarczyć mapę wpływu i pakiety kontekstu, następnie kolejkę wykonania i raport przed/po; sprawdzić poprawność całego przebiegu.
5. Po ukończeniu wszystkich czterech faz udostępnić narzędzie użytkownikom i przeprowadzić pomiary efektywności: kosztu poprawnego wyniku, czasu i UX.
6. Na podstawie użycia określić dalszy rozwój punktu 3, jeżeli podejmiemy Fazę 5.

Do późniejszego rozważenia pozostają: pierwsze użycie/deploy produktów użytkownika (B22–B25), dashboard/companion (B32), ciągły monitoring (B26) i kolejne hosty (B28). Zachowujemy te możliwości w backlogu; nie rozszerzają automatycznie Fazy 4 ani potencjalnej Fazy 5.
