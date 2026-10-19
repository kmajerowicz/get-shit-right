# Kontynuacja rozwoju GSR — 2026-10-15

## Zlecenie i obowiązujące granice

Właściciel autoryzował kod, dokumentację i lokalne testy w kolejności:
V1–V5 → sprawdzenie → Faza 3 P3-T1–T8 → szczegółowy plan wykonawczy
zaakceptowanych czterech punktów Fazy 4 → realizacja Fazy 4.
Pracować etapami, bez ponownego pytania o rozpoczęcie. Istniejący working tree
Faz 1–2 zachować; brak resetu do HEAD, commitów, stagingu, tagów, push i publikacji.
Nie czytać ani kopiować niezwiązanych osobistych plików, zwłaszcza CV. Odczyty tylko
w repo i dokładnych źródłach instrukcji; nie szukać rekurencyjnie w katalogu domowym.
Nie uruchamiać fingerprintu tego całego workspace — objąłby osobisty untracked plik.
Testy runnera i snapshoty mają korzystać z jawnie wybranych źródeł/syntetycznych fixture.
Bez dodatkowych modeli/agentów, nowych płatnych usług lub instalacji. Faktyczne
ograniczenia hosta/narzędzi opisywać; nie nadawać modelowym próbom statusu PASS na
podstawie parsera lub samej inspekcji promptu. Badania kosztów, czasu i UX dopiero po
ukończeniu Faz 1–4 i udostępnieniu użytkownikom. Publikacja nie jest objęta zleceniem.

Historyczne zdania "planning only" i "nie implementuj Fazy 4" w starych promptach
nie nadpisują bieżącego zlecenia użytkownika, które obejmuje obie fazy.

## Zakończony etap

**V1–V5 wdrożone i sprawdzone lokalnie.** Szczegóły i dowody:
[plan poprawek](2026-10-15-phase-1-2-corrections.md#Wyniki-wykonania--2026-10-15).

Zmiany tej sesji:
- `gsr/lib/config.js`: default = jawne ID + wszystkie required.
- `gsr/lib/fingerprint.js`: administracyjne pola rozpoznanego session manifestu.
- `gsr/lib/project.js`: normalizacja docRoot po walidacji.
- `gsr/lib/task-handoff.js`, `stage-packet.js`: duplicate diagnostics tylko żądanego celu referencji, domyślny parser pozostaje ścisły.
- `gsr/commands/status.md`, `gsr/docs/patterns/task-coordination.md`: focused feature/Active Task i next action przed legacy fallback, decyzje bez PRD/STATE, read-only.
- Kontrakt weryfikacji i techstack template: zgodność default i freshness.
- Runner/freshness/packet/coordination tests, nowe `scripts/fixtures/corrections/`, check-json dla fixture.

Dowody końcowe: `npm run check` exit 0, **45 testów**, 32 JS, JSON/linki/wersje
poprawne. `npm run smoke:host` exit 0, Claude Code **2.1.274**, SessionStart i
packetDelivered true, 11 commands/10 skills, **modelInvoked false**. `git diff --check`
exit 0. Node **v26.0.0**, bazowy HEAD **fa92074c5044dfd0de9dda577ef5c53cf5bc2307**;
HEAD nie obejmuje istniejących Faz 1–2 ani nowych poprawek. Nie mylić go z kandydatem.
Wersje źródeł i run locatory Faz 1–2 to dowody historyczne.

V3: ręcznie prześledzona instrukcja i test realnych odczytów czterech fixture,
nie faktyczny modelowy routing komendy. Modelowe wyniki V3 i Faz 1–2 pozostają
unobserved. Brak znanej regresji deterministycznej w poprawionych obszarach.

## Dokładny następny krok

**P3-T1 — baseline i scenariusze.** Faza 3 nie została jeszcze zaimplementowana.

Po "dalej" ogłoś wznowienie P3-T1 i:
1. Odczytaj minimalny zestaw poniżej, sprawdź aktualny `git status --short` bez resetu.
2. Utwórz `docs/internal/plans/2026-10-14-phase-3.md` z P3-T1–T8 i wynikami per krok.
   Załóż `scripts/fixtures/phase-3/scenarios.json` dla wszystkich P3-S1–S13 oraz ledger
   poprawności pod `docs/internal/research/`. Każdy wynik live początkowo unobserved.
3. Zapisz baseline po poprawkach: wersje, bezpieczny zestaw źródeł, rzeczywiste wyniki
   check (wyżej); nowy check wykonaj przy zmianach lub konieczności uzgodnienia stanu.
   Jeśli tworzysz snapshot, jawnie kopiuj tylko GSR/scripts/właściwe docs i konfiguracje;
   uwzględnij ignored build skill oraz untracked źródła Faz 1–2. Nie kopiuj katalogu root
   rekurencyjnie, .git ani osobistych plików. Nie dodawaj wykluczenia CV do fingerprintu.
4. Następnie kolejno P3-T2 rekord/pattern → T3 routing/internal preview skill → T4 demo
   → T5 feedback/D-piny/resume → T6 mapa postępu (routing V3 już naprawiony)
   → T7 sprawdzenia/realne próby w dostępnych granicach → T8 gotowość wydania.
5. Braki modelowe raportuj jako unobserved z konkretną przyczyną; implementacja,
   startup/discovery, rzeczywiste zachowanie modelu i release readiness to osobne stany.
   Nie omijaj niedokończonej implementacji Fazy 3 przechodząc do Fazy 4.
6. Przed Fazą 4: potwierdź V1–V5/Fazę 3, technicznie sprawdź możliwości jednego hosta,
   zapisz szczegółowy plan wszystkich czterech punktów, potem go wykonuj. Nie zaczynaj
   benchmarków i nie pytaj ponownie o autoryzowaną implementację.

## Minimalny read set na wznowienie

1. Ten handoff.
2. [Wyniki V1–V5](2026-10-15-phase-1-2-corrections.md).
3. [Pełny kontrakt i zadania Fazy 3](../research/2026-10-14-phase-3-handoff.md).
4. [Stan Fazy 2](../research/2026-10-13-phase-2-implementation.md) — rozróżnienie testów i live.
5. [Kierunek Fazy 4](../research/2026-10-14-phase-4-direction.md) — planować po Fazie 3.
6. `package.json` — bieżące kontrole; dalej tylko pliki właściwe dla zadania.

Raport Fazy 1, audyt workflow §10, kierunek produktu i wybrane pozycje backlogu
przeczytano w poprzednim etapie; nie odnawiać całego researchu. Zewnętrzne kontrakty
hosta odświeżyć w oficjalnych źródłach przy integracji od nich zależnej. Nie wyciągać
wniosku o automatycznym discovery/routingu skilla z frontmatter bez obserwacji.
