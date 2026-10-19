# Plan deployu GSR po Fazach 1–4

Data: 2026-10-15. **Status: plan przygotowany; wykonanie deployu nierozpoczęte.**
Aktualizacja 2026-10-18: właściciel zaakceptował kierunek podziału na PR-y opisany poniżej.
Zakres: wydanie pluginu GSR przez repozytorium/marketplace GitHub i sprawdzenie
instalacji/aktualizacji u odbiorcy. Nie jest to deploy aplikacji budowanych przez GSR.

To zlecenie obejmuje przygotowanie planu. Poprzedni zakaz commitów i publikacji nadal
obowiązuje; poniższe czynności zmieniające historię, ustawienia lub stan zdalny są
przyszłymi krokami. Nie wykonano ich przy pisaniu dokumentu. Kolejne polecenie wykonania
musi obejmować potrzebne commity/tag/push/release; po takim zleceniu nie wymuszać
ponownej zgody na każdy rutynowy krok już mieszczący się w jego zakresie.

## Decyzja o sposobie wydania

Proponuję **jedno wspólne wydanie 0.6.0**, zawierające Fazę 1, Fazę 2, V1–V5,
Fazę 3 i Fazę 4. To propozycja do zatwierdzenia przed wykonaniem, nie obecna wersja.
Nie wydawać tylko ostatniej fazy ani odtwarzać kandydata z samego HEAD.
Założenie wersji: dodatki zachowują publiczne komendy i legacy formaty. Jeżeli końcowa
kontrola wykaże niekompatybilność, ponownie ustalić wersję i opisać migrację przed tagiem.

### Uzgodniony podział pracy na PR-y — 2026-10-18

Jedno wspólne wydanie przygotowujemy przez osobne PR-y do gałęzi integracyjnej
`release/0.6.0`. Nazwa gałęzi odpowiada proponowanej wersji; ostateczny numer nadal
wymaga potwierdzenia. Akceptacja tego kierunku aktualizuje plan, nie uruchamia
commitów, push, tworzenia PR-ów ani publikacji.

| PR | Zakres |
|---|---|
| 1 | Faza 1: niezawodność, instalacja i weryfikacja |
| 2 | Faza 2: koordynacja pracy i przekazywanie kontekstu |
| 3 | Faza 3: preview, feedback i wznawianie pracy |
| 4 | Faza 4: mapa wpływu, pakiety zadań, trwała kolejka i raporty Autopilota |
| 5 | Przygotowanie wydania: synchronizacja wersji, changelog i instrukcje aktualizacji |

Poprawki V1–V5, testy i dokumentacja należą do PR-ów dotyczących danego zachowania.
Przed przygotowaniem commitów sprawdzić zależności i przypisanie zmian we wspólnych
plikach; podział jest punktem wyjścia, a nie poleceniem mechanicznego cięcia po katalogach.
Każdy kolejny PR opierać na scalonych poprzednikach, aby jego diff pokazywał własny
zakres. Każdy ma być możliwy do osobnego przeglądu i zawierać opis zachowania,
odpowiednie kontrole oraz znane ograniczenia. Jeśli PR Autopilota okaże się zbyt duży,
podzielić go dalej wzdłuż zależności jego mechanizmów.

Po przeglądzie poszczególnych PR-ów i sprawdzeniu całości przygotować końcowy PR
`release/0.6.0` → `main`. Obejmuje ocenę integracji, kompletności wydania i wyników D2–D5;
nie zastępuje przeglądów części funkcjonalnych. Wymagane CI uruchamiać również na PR-ach
do gałęzi wydania. Zachować commity funkcjonalne dla changelogu; nie zmieniać historii
tagowanego kandydata podczas końcowego merge.

Nie scalać części funkcjonalnych bezpośrednio do `main`: marketplace i statusline
korzystają z tej gałęzi, więc końcowy merge jest częścią udostępnienia opisanej w D6.
Dotychczasowe warunki D1–D8, w tym brakujące próby live i browser, pozostają w mocy.

Pierwszy deklarowany host: lokalny Claude Code, z dokładną wersją potwierdzoną próbą.
Dotychczas zaobserwowano Claude Code 2.1.274 na tej maszynie; nie deklarować całej
rodziny systemów/hostów na tej podstawie. CI używa Ubuntu + Node 22, lokalne dowody
pochodzą z Node 26.0.0. Przed wydaniem sprawdzić oba deklarowane środowiska zamiast
zakładać kompatybilność. Nie rozbudowywać macierzy o Windows/Codex bez potrzeby i prób.

## Stan wejściowy i znane ograniczenia

| Obszar | Stan przy przygotowaniu planu |
|---|---|
| Wersje manifestów/package | 0.5.0; nie zmieniono ich w tym zleceniu |
| Lockfile | Root version i packages[""].version nadal 0.2.11; obecny release.js ich nie aktualizuje |
| Repo HEAD | fa92074c5044dfd0de9dda577ef5c53cf5bc2307; nie zawiera working-tree Faz 1–4 |
| Kontrole lokalne | Ostatni pełny check: 68 testów, 43 JS, exit 0; nie powtarzano go wyłącznie dla planu |
| Native startup | 11 commands / 12 skills; to discovery, nie dowód wyboru skilla przez model |
| Instalacja/upgrade | Izolowane próby przeszły, także scenariusz z faktycznie zainstalowanym helperem |
| Runner | Retained passing record dotyczy wybranego snapshotu, nie całego workspace |
| Zachowanie modelu | S1–S8, C1–C12, P3-S1–S13 i P4-S1–S16 nadal unobserved |
| Preview wizualnie/klawiatura | Brak rzeczywistej obserwacji browser; HTTP/DOM harness tego nie zastępują |
| Public readiness | Niepotwierdzona; publikacja nie może wynikać z samego lokalnego PASS |

Źródła lokalne: [raport Fazy 3](../research/2026-10-15-phase-3-implementation.md),
[raport Fazy 4](../research/2026-10-15-phase-4-implementation.md),
[runner locator](../research/2026-10-15-phase-4-run-reference.json),
[proces release](../releasing.md),
[skrypt release](../../../scripts/release.js),
[CI](../../../.github/workflows/ci.yml).

## Kolejność wykonania i warunki przejścia

| Krok | Działanie | Wynik wymagany przed następnym krokiem |
|---|---|---|
| D1 | Zamrozić zakres i przygotować czysty kandydat z working tree | Jawna lista plików i pełne źródła wszystkich faz; żadnych unrelated materiałów |
| D2 | Uzupełnić brakujące obserwacje poprawności | Macierz S/C/P3/P4 z rzeczywistymi wynikami i brakującymi obserwacjami browser; brak znanego false PASS/utraty decyzji/naruszenia granic |
| D3 | Sprawdzić finalne źródła i przygotować historię wydania | Aktualne kontrole, source review, conventional commits i jednoznaczny release commit kandydat |
| D4 | Nadać wersję i przygotować tag lokalnie | Spójne 0.6.0 w wymaganych plikach, pełne release notes, lokalny tag wskazuje sprawdzony commit |
| D5 | Zweryfikować dokładny kandydat oraz CI | Fresh install/upgrade exact version, Node 22/26, krytyczny przebieg na zainstalowanej kopii |
| D6 | Udostępnić zatwierdzony kandydat | Właściwe main/tag/GitHub Release; identyfikowalny SHA i zgodne źródła marketplace |
| D7 | Sprawdzić kanał publiczny i pierwszego odbiorcę | Czysta instalacja oraz upgrade z GitHub, poprawny version/cache i rzeczywisty krótki przebieg |
| D8 | Zamknąć wydanie albo wykonać recovery | Raport faktycznego stanu, instrukcja aktualizacji i jawne nierozwiązane ograniczenia |

### D1 — bezpieczny, pełny kandydat

1. Zachować aktualny working tree i wszystkie wcześniejsze zmiany. Nie resetować,
   stashować ani przenosić osobistych plików tylko po to, aby uzyskać czyste repo.
2. Przygotować osobny checkout/katalog wydaniowy z historią bazową i jawnie wybranym
   overlay źródeł. Zestaw obejmuje `gsr/`, `scripts/`, właściwe docs, README, CHANGELOG,
   package/lock, `.claude-plugin/`, CI i potrzebną konfigurację repo. Uwzględnić istotne
   untracked/ignored pliki, zwłaszcza build skill, nowe lib/scripts i fixtures wszystkich faz.
3. Sporządzić pełną listę plików i porównać z kandydatem; nie korzystać z szerokiego
   kopiowania katalogu użytkownika. Nie czytać/kopiować CV, sekretów ani niezwiązanych
   materiałów. Prywatne notatki i lokalne ścieżki z dowodów wymagają przeglądu przed
   publikacją; nie kopiować osobistych plików w celu tego przeglądu. Brak zarchiwizowanego
   pliku w tmp oznacza missing evidence, nie PASS.
4. Zachować jawnie wszystkie pliki potrzebne przez checkery i linki dokumentów;
   wcześniejszy snapshot wymagał m.in. `docs/internal/releasing.md`. Jeżeli wewnętrzne
   raporty/locatory nie mają być publiczne, ustalić i sprawdzić spójną redakcję/pakowanie,
   a nie usuwać ich bez naprawy checków/linków lub podmieniać wyniki na zielone.
5. Przed jakimkolwiek przyszłym stagingiem sprawdzić listę plików, cel remote i gałąź.
   `git add -A` z obecnego workspace jest niedopuszczalne. Oryginalne repo pozostaje
   nienaruszone; skrypt release będzie uruchamiany wyłącznie na czystym kandydacie.

### D2 — poprawność live, oddzielona od badań efektywności

Przygotować izolowany, syntetyczny projekt i wersję pluginu pochodzącą z finalnych
źródeł D1, bez kopiowania osobistego konta/konfiguracji. Zapisać host/model/version,
rewizję źródeł, narzędzia, działania, rzeczywisty rezultat i refs dowodów. Zachować
minimalne obserwacje, bez pełnych transkryptów/danych osobowych domyślnie.

Do wykonania są warunki z istniejących ledgerów i scenariuszy:
[S1–S8](../research/2026-10-11-phase-1-implementation.md),
[C1–C12](../../../scripts/fixtures/phase-2/scenarios.json),
[P3-S1–S13](../../../scripts/fixtures/phase-3/scenarios.json),
[P4-S1–S16](../../../scripts/fixtures/phase-4/scenarios.json).
Wspólny przebieg może pokryć kilka ID tylko przy jawnym dopasowaniu rzeczywistych
wejść/warunków i dowodów. Nie przepisywać oczekiwanego zachowania jako wyniku.

Minimalne grupy prób do rozplanowania w tej macierzy:

- Naturalne zlecenie istniejącej funkcji bez pełnego PRD/STATE; bounded learn/scope,
  relevant skill/research reuse i właściwy dalszy krok bez ponownego intake.
- Preview przepływu bez kodu; dwa warianty z żądaniem czekania; aktualne komponenty
  istniejącego UI; korekta wyboru aktualizująca właściwe wymagania i historię decyzji.
- Rzeczywiste interaktywne `/clear` → bare „dalej”, osobno partial i checked checkpoint,
  zachowanie wariantu/cadence oraz istniejący direct-command fallback. Sam parser lub
  podane `source=clear` nie zalicza tego warunku.
- Zmienione wymaganie pod tym samym ID, zniknięty preview i zewnętrzna edycja po checked:
  uzgodnienie źródeł, brak starego PASS, zachowany faktyczny postęp.
- Latest failed/unavailable/masked checks; jasne rozdzielenie implementacji, aktualności
  dowodów, persystencji, symulacji oraz akceptacji człowieka.
- Późniejsze review-only, per-chunk review, „pokaż i poczekaj” i nadal odroczony D-pin;
  brak sfabrykowanej zgody, wyboru wariantu, reviewedThrough i policyChangeSource.
- Drobna literówka bez preview/kolejki/full scope oraz CLI z prawdziwą transformacją
  danych; fallback bez Mermaid/browser bez cichej instalacji.
- Zmiana językiem produktu → impact map → dwa małe pakiety → sekwencyjne wykonanie
  z przerwaniem/wznowieniem → rzeczywista weryfikacja → raport przed/po.
- Dwie nieskuteczne próby bez nowego postępu, nowe run IDs, zmiana podejścia i limit
  prób/kroków; brak nieskończonego retry i nieuzasadnionych deklaracji limitu kredytów.
- Status-only wskazanej funkcji/queue, alternatywny DOC_ROOT, brak PRD/STATE i stale
  verification — odczyt bez edycji, testów lub automatycznego wznowienia.

Oddzielnie obejrzeć rzeczywisty booking preview w przeglądarce: czytelność na desktop
oraz wąskim widoku, Tab/strzałki/Enter, focus i komunikaty success/busy/reset. To kontrola
objętej ścieżki, bez deklaracji pełnego audytu dostępności. Zachować dowód i ograniczenia.

Brak dostępu do modelu/browser lub odpowiedniej autoryzacji inferencji pozostawia
warunek unobserved i blokuje deklarację public readiness; nie wymusza zakupu/instalacji.
Uzgodnienie wykonania tych prób powinno określić dostępny host/model i realne granice
kosztu; nie rozpoczynać ich na podstawie samego planu. Znany false PASS, utrata decyzji
lub naruszenie granic wymaga naprawy i ponownego sprawdzenia dotkniętych warunków.

### D3 — źródła, checki i historia

Przed tagowaniem domknąć wykrytą lukę narzędzia release: `package-lock.json` nadal
zawiera root version oraz packages[""].version 0.2.11, a obecny release.js zmienia tylko
package.json i dwa manifesty. W przyszłym zakresie przygotowania wydania rozszerzyć
release/version-sync o te metadane lockfile, tak aby właściwy bump objął je w tym samym
release commicie **przed tagiem**. Dodać celową regresję: wszystkie root wersje zgodne,
dry-run bez zapisu, dependency resolutions/integrity bez zmian. Nie aktualizować pakietów
ani nie uruchamiać instalacji wyłącznie w celu zmiany numeru. To warunek D4, nie zmiana
wykonana podczas pisania planu. README highlight przygotować w jawnym commicie docs
przed właściwym releasem; po bumpie ma odpowiadać finalnej wersji.

Wykonać na kandydacie, po istotnych poprawkach z D2:

```sh
npm run check
npm run smoke:host
npm run smoke:installed
```

`check` musi przejść na Node 22 używanym przez CI i deklarowanym lokalnym Node 26.
Native smoke wymaga zainstalowanego Claude CLI, więc pozostaje osobną obserwacją,
nie fikcyjnym zielonym wynikiem na runnerze bez hosta. 68 testów/43 JS to obecny punkt
odniesienia, nie niezmienna docelowa liczba po ewentualnych poprawkach.

Po późniejszym zleceniu obejmującym commity przygotować logiczny zestaw conventional
commits z jawnej listy plików: reliability/V1–V5, coordination/handoff, preview/feedback,
autopilot/context/queue/report, tests/docs. Zmiany funkcjonalne opisać feat/fix, aby
weszły do changelogu; nie ukrywać ich jako docs/chore. Zweryfikować commit-msg lint.
Wyraźnie wskazać pełny SHA kandydata i co faktycznie sprawdzono na tej rewizji.

### D4 — wersja, changelog i lokalny tag

1. Przed tagiem potwierdzić docelowe repo, gałąź wydania, politykę PR/merge i brak istniejącego
   lokalnego/zdalnego `v0.6.0`. Gdy wersja zajęta, nie nadpisywać tagu; uzgodnić następną.
2. Po commitach funkcjonalnych wykonać `node scripts/release.js 0.6.0 --dry-run`.
   Ocenić konkretną treść changelogu. Wcześniejszy dry-run dawał sam nagłówek, bo zmiany
   nie miały commitów; exit 0 z samym nagłówkiem nie spełnia warunku wydania.
3. Release notes obejmują wszystkie cztery fazy i V1–V5, sposób start/update, wspierany
   sprawdzony host, ograniczenia jednej aktywnej kolejki, ręczne przejście między
   kontekstami i koszt unknown. Bez obietnic pełnej autonomii/oszczędności.
4. W czystym checkoutcie, dopiero przy zleceniu obejmującym commity/tag, uruchomić
   `node scripts/release.js 0.6.0` **raz, bez --publish**. Po uzupełnieniu D3 skrypt ma
   aktualizować package, oba manifesty, root metadane lockfile i CHANGELOG, sprawdzić
   projekt, a następnie utworzyć release commit i lokalny tag.
5. Porównać package.json, plugin manifest, marketplace entry, root metadane lockfile
   i pierwszy wpis CHANGELOG; wszystkie mają wskazywać 0.6.0. Potwierdzić, że README
   przygotowany w D3 trafił do sprawdzonego release tree. Nie dodawać plików po tagu
   bez ponownego przygotowania i weryfikacji kandydata.
6. Jeżeli checks przerwą release przed commitem, zachować i przejrzeć zmienione pliki
   wersji; skrypt nie wycofuje ich transakcyjnie. Nie resetować oryginalnego repo i nie
   ponawiać bumpa w ciemno. Gdy tag już istnieje, dalsze kroki publikują ten sam tag;
   **nie uruchamiać release drugi raz z --publish**.

### D5 — dokładny release candidate, CI i gotowość do udostępnienia

Sprawdzić wersję 0.6.0, nie tylko poprzedni syntetyczny catalog 0.6.0-test.1. Obecny
smoke:installed jest przydatny dla struktury/upgrade, ale celowo podmienia wersję w temp;
sam nie certyfikuje przyszłego publicznego numeru/tagu. W osobnym isolated config sprawdzić:

- instalację z pełnego finalnego drzewa/tagu i odczytaną faktycznie wersję;
- upgrade z ostatniego publicznego 0.5.0, zachowanie własnego statusline/ustawień i restart;
- wszystkie 11 komend, 12 skilli i krytyczne refs/helpery; liczby ponownie odczytać, jeżeli
  zakres zmienił się po D2; hidden skill nie musi być w publicznym menu;
- aktualny modelowy przebieg i checks z D2 oraz przywracalne wyłączenie pluginu.

Uruchamiać CI dla PR-ów cząstkowych do `release/0.6.0`, a następnie dla końcowego PR
do `main` z release commit, w ramach późniejszego zlecenia obejmującego te działania.
Obecny workflow uruchamia się dla PR i push do main, nie dla dowolnego push;
sam push gałęzi nie stanowi wyniku CI. Wymagane checks muszą przejść przed przeniesieniem
kandydata na main. Zachować SHA i wyniki; nie modyfikować źródeł po zatwierdzeniu.

Pakiet do przeglądu przed udostępnieniem: wersja, candidate SHA/tag, lista plików,
release notes, wyniki local/CI/live/browser, dokładne polecenia publikacji, upgrade i
recovery. Dopiero na takim konkretnym wyniku oprzeć wykonanie publikacji objętej zleceniem;
nie prosić o ogólną zgodę na nieprzygotowany release.

### D6 — publikacja właściwego kandydata

**Granica udostępnienia:** zapis nowej wersji/źródeł na publicznym `main` jest częścią
rolloutu. Marketplace wskazuje `./gsr/`, a obecny statusline odpytuje surowy manifest na
`main`. Sam draft GitHub Release nie izoluje tych użytkowników od aktualizacji. Dlatego
nie przenosić niesprawdzonego kandydata na main jako „przygotowania”; osobna gałąź/local
catalog służą wcześniejszym próbom.

W ramach późniejszego zlecenia publikacji:

1. Potwierdzić zielone wymagane checks i niezmieniony kandydat. Przenieść go na main
   zgodnie z polityką repo, zachowując wydawany commit w historii. Preferować zachowanie
   commitów; nie squashować/rebase'ować po utworzeniu tagu bez ponownego uzgodnienia
   tagowanego kandydata. Sprawdzić zgodność drzewa wydawanego tagu z dystrybuowanymi
   plikami main, również przy merge commicie.
2. Wypchnąć właściwy lokalny tag `v0.6.0`; nie tworzyć tagu z przypadkowego HEAD/default
   przez automat GitHub i nie nadpisywać istniejącego tagu.
3. Opublikować GitHub Release z przygotowanego pliku notatek, np.:

```sh
gh release create v0.6.0 --verify-tag --title v0.6.0 --notes-file <gotowy-plik-notatek>
```

`--verify-tag` sprawdza istnienie tagu na remote; nie sprawdza zgodności zawartości
z kandydatem. Zgodność SHA/drzewa należy sprawdzić przed komendą. To zachowanie opisuje
[oficjalna dokumentacja GitHub CLI](https://cli.github.com/manual/gh_release_create).
W razie częściowego powodzenia wznowić brakujący krok (np. Release po push), bez kolejnego
bumpa, nowego tagu lub powtarzania wykonanej publikacji.

Nie jest potrzebny deploy serwera, npm publish ani nowa platforma hostingowa. Nie
publikować komunikatów na Slack/email/social bez obejmującej je instrukcji.

### D7 — kontrola opublikowanego kanału

Sprawdzić GitHub main, tag i Release oraz manifest z kanału używanego przez statusline.
W nowej izolowanej konfiguracji, z GitHub zamiast local catalog:

```sh
claude plugin marketplace add https://github.com/kmajerowicz/get-shit-right
claude plugin install gsr@gsr
```

Dla testowej instalacji 0.5.0:

```sh
claude plugin marketplace update gsr
claude plugin update gsr@gsr
```

Uruchomić nową sesję/restart właściwy dla testowanego hosta, odczytać realną wersję,
startup/komendy/skille, settings preservation i krótki przebieg użytkowy. Nie zakładać,
że marketplace refresh sam zaktualizował załadowany proces lub cache. Aktualne opcje
instalacji, scope i przeładowania opisuje [dokumentacja Claude Code](https://code.claude.com/docs/en/discover-plugins).
Sprawdzić także `/gsr:update` z rzeczywistej zainstalowanej wersji, w tym ścieżkę hook
installer po restarcie; samo powodzenie dwóch komend nie zalicza całej tej ścieżki.

Badge aktualizacji jest obecnie cache'owany przez dobę. Jego brak nie jest dowodem
braku wydania; odczyt zainstalowanej wersji i faktyczny startup są źródłem obserwacji.
Nie usuwać globalnego cache/ustawień użytkownika tylko aby wymusić zielony screenshot.

### D8 — recovery i zamknięcie

Wyzwalacze przerwania rolloutu: brak skilli/komend/helpera w zainstalowanej wersji,
niepoprawne hooki, utrata ustawień/decyzji, false PASS, przekroczenie review/authority
lub niemożliwe wznowienie krytycznej ścieżki. Zachować faktyczne błędy i wersje źródeł.

- Przed publikacją: zatrzymać się na isolated checkoutcie, naprawić przyczynę i ponowić
  dotknięte checks. Nie zmieniać roboczego repo ani przenosić na main niesprawdzonego kodu.
- Po publikacji: w razie krytycznego problemu poinstruować odbiorcę o czasowym wyłączeniu
  GSR w jego właściwym scope; `claude plugin disable gsr@gsr` jest opcją CLI opisaną w
  [zarządzaniu pluginami](https://code.claude.com/docs/en/discover-plugins#manage-installed-plugins).
  Wyłączenie pluginu nie dowodzi usunięcia skopiowanego statusline: przywracać wyłącznie
  znane ustawienia GSR z właściwej uprzedniej kopii, zachowując obcy statusline i pozostałe
  ustawienia. Nie kasować katalogu konfiguracji, historii, specyfikacji lub kolejki użytkownika.
- Preferować mały forward fix 0.6.1 z regresją i tym samym procesem sprawdzeń. Nie przepisywać
  publicznych tagów ani force-pushować main. Ukrycie/usunięcie GitHub Release samo nie cofa
  marketplace/main ani kopii już zainstalowanych u użytkowników.
- Jeżeli potrzebny jest fallback do 0.5.0, przygotować i sprawdzić jego instalację z checkoutu
  właściwego tagu w oddzielnym local catalog/konfiguracji; nie wymyślać niezweryfikowanej
  składni instalacji konkretnej wersji. Zachować nowe specyfikacje/queue; stary host/plugin
  może ich nie rozumieć. Bez dowodu nie obiecywać downgrade'u jako bezstratnego rollbacku.

Raport końcowy zapisuje faktycznie opublikowany tag/SHA, wyniki instalacji publicznej,
upgrade, znane ograniczenia i recovery instructions. Rozróżnić: przygotowano, lokalnie
wydano, wypchnięto, opublikowano Release, zweryfikowano odbiorcę. Częściowe powodzenie
nie oznacza pełnego deployu. Dopiero po rzeczywistym udostępnieniu narzędzia użytkownikom
uruchamiać osobno uzgodnione badania efektywności/kosztów/czasu/UX, z dostępnymi danymi
bez automatycznego zbierania telemetrycznego i bez procentowych obietnic przed pomiarem.

## Najbliższa czynność

Przy późniejszym zleceniu wykonania zacząć od D1 i brakujących obserwacji D2; nie od
uruchomienia `release --publish`. Przygotować finalny przeglądalny kandydat i zapisać
braki dostępu/obserwacji. Nie powtarzać implementacji Faz 1–4 ani badań rynku.

## Sprawdzenie samego planu

Odczytano bieżące manifesty, lockfile, workflow CI, release/update scripts i raporty faz.
`node scripts/check-doc-links.js` oraz `git diff --check` przeszły dla zmian dokumentacji.
Nie uruchamiano release/dry-run/instalacji/modelu/benchmarku i nie powtarzano całej suity
na potrzeby samego planu. Aktualne zewnętrzne kontrakty instalacji/update oraz GitHub
Release sprawdzono w oficjalnych dokumentach podlinkowanych przy odpowiednich krokach.
