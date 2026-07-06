# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare e salvare workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-028 completata: la sidebar espone una pagina archivio che visualizza tutti i workflow salvati dal mock API.

## Task attiva

Nessuna.

## Ultima sessione

- Inizializzato il progetto nella root Git esistente.
- Installate le dipendenze frontend.
- Configurati Tailwind CSS e React Flow.
- Sostituita la demo Vite con una shell minimale del Workflow Studio.
- Creato il sistema agentico Markdown e archiviata `TASK-001`.
- Applicata la convenzione React pages/components e archiviata `TASK-009`.
- Applicato il design system Lumina/Baited e archiviata `TASK-010`.
- Implementato il modello workflow e archiviata `TASK-002`.
- Implementato il wizard a tre step e archiviata `TASK-003`.
- Implementato l'editor canvas operativo e archiviata `TASK-004`.
- Implementata la configurazione dei nodi e archiviata `TASK-005`.
- Implementata la validazione DAG/branch e archiviata `TASK-006`.
- Implementati revisione, salvataggio mock e ripristino locale e archiviata `TASK-007`.
- Consolidati test, accessibilità, dirty state e documentazione e archiviata `TASK-008`.
- Aggiunta la terminazione obbligatoria dei percorsi e archiviata `TASK-011`.
- Reso esplicito il timeout delle condition e archiviata `TASK-012`.
- Aggiunta la generazione scenario da OSINT e archiviata `TASK-013`.
- Abilitata la creazione del workflow da zero e archiviata `TASK-014`.
- Sostituito MSW con JSON Server, aggiunti proxy, persistenza, reset e test HTTP reali e archiviata `TASK-015`.
- Creato l'hub documentale su composizione, blocchi, API, validazione, test ed estensione e archiviata `TASK-016`.
- Aggiunte Home, routing lazy, navigazione route-aware e guardia dirty e archiviata `TASK-017`.
- Sostituito il lockup provvisorio Home con il wordmark Baited fornito e archiviata `TASK-018`.
- Riutilizzato il wordmark nella top bar workflow, spostato il titolo nella barra di avanzamento esclusivamente nello step editor e archiviata `TASK-019`.
- Spostato il titolo workflow dalla barra di avanzamento alla libreria blocchi e archiviata `TASK-020`.
- Creato l'inventario dipendenze e librerie in `docs/09-dependencies-and-libraries.md` e archiviata `TASK-021`.
- Aggiunta selezione e cancellazione sicura delle connessioni workflow e archiviata `TASK-022`.
- Corretto il fit dei testi nei bottoni di conferma eliminazione e archiviata `TASK-023`.
- Disposti in colonna i bottoni dei dialog di conferma eliminazione e archiviata `TASK-024`.
- Implementata la riconnessione degli endpoint degli edge e archiviata `TASK-025`.
- Aggiunta la navigazione dagli errori di validazione al canvas e archiviata `TASK-026`.
- Aggiunta la pagina dei workflow salvati in sidebar e archiviata `TASK-028`.

## Verifiche effettuate

- TASK-019 — 15 test dominio, 14 componenti e 4 E2E Chromium superati; build, lint e diff check superati; browser verificato nei tre step a 1024×768 e 1440×900 senza overflow.
- TASK-020 — `npm run test:unit` superato: 8 file e 14 test componenti; `npm run build`, `npm run lint`, `git diff --check` e `npm run test:e2e` superati.
- TASK-021 — 23 dipendenze dirette documentate e link Markdown locali risolti su 10 file docs; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-022 — `npm run test` superato: 15 test dominio e 19 componenti; `npm run test:e2e` superato: 5 test Chromium; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-023 — `npm run test:unit` superato: 8 file e 19 test componenti; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-024 — `npm run test:unit` superato: 8 file e 19 test componenti; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-025 — `npm run test` superato: 15 test dominio e 22 componenti; `npm run test:e2e` superato: 6 test Chromium; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-026 — `npm run test` superato: 15 test dominio e 25 componenti; `npm run test:e2e` superato: 6 test Chromium; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-028 — `npm run test` superato: 15 test dominio e 29 componenti; `npm run test:e2e` superato: 6 test Chromium; `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-018 — 12 test componenti, build, lint e diff check superati; asset SVG incluso nel bundle e contenuto verificato.
- TASK-017 — 15 test dominio, 12 componenti e 4 E2E Chromium superati; build, lint, audit e diff check superati; browser Home/editor verificato a 1024×768 e 1440×900 senza overflow o errori console.
- TASK-016 — 9 documenti Markdown, link locali e inventario 9 template/8 kind verificati; build, lint e diff check superati.
- TASK-015 — 15 test dominio, 9 componenti e 3 E2E Chromium superati; build, lint, audit, diff check, smoke `curl` e avvio congiunto superati.
- TASK-014 — 15 test dominio, 9 componenti e 3 E2E Chromium superati; build, lint e diff check superati.
- TASK-013 — 15 test dominio, 7 componenti e 3 E2E Chromium superati; build, lint e diff check superati.
- TASK-012 — `npm run test` superato: 12 test dominio e 6 componenti; `npm run test:e2e` superato: 3 test Chromium; build, lint e diff check superati.
- TASK-011 — `npm run test` superato: 11 test dominio e 5 test componenti; `npm run test:e2e` superato: 3 test Chromium; build, lint e diff check superati.
- TASK-008 — `npm run test` superato: 9 test dominio e 5 test componenti.
- TASK-008 — `npm run test:e2e` superato: 3 test Chromium per errore/retry/refresh, aggiunta tastiera/dirty state e audit axe su Dettagli/Revisione.
- TASK-008 — `npm run build`, `npm run lint` e `git diff --check` superati.
- TASK-007 — `npm run build`, `npm run lint`, `npm run test` e `git diff --check` superati; suite a 9 test inclusi serializer, stati API e persistenza.
- `npm run build` — superato.
- `npm run lint` — superato.
- `npm run test` — superato con 6 test del validator workflow.
- `npm run dev -- --host 127.0.0.1` — server avviato e risposta HTTP verificata.
- Browser locale — pagina, sidebar e quattro nodi React Flow verificati dopo il refactor.
- Browser 1280×720 e 1440×900 — layout senza overflow, sette nodi e sei archi iniziali verificati.
- Drag/selezione, nuova connessione, zoom, fit view e pan — superati; console senza warning o errori.
- Modello/provider — build e lint senza warning; browser con drag, selezione e connessione superato.
- Wizard — validazione/focus, navigazione, persistenza, revisione e pannello proprietà verificati a 1024 e 1280 px.
- Editor canvas — build e lint superati; browser 1280×720 con zoom canvas 0.4544: sei template aggiunti, drag-and-drop, selezione, spostamento, connessione, duplicazione, eliminazione e conferma eliminazione superati.
- Configurazione nodi — build, lint e diff check superati; browser 1440×900: trigger, campagne, target group, awareness, condition, end e OSINT configurati; persistenza tra selezione/step e console pulita verificate.
- Validazione DAG — build, lint e test superati; codici errore strutturati disponibili per start/end, cicli, self-loop, duplicati, reachability, orfani, campi obbligatori e branch condition.

## Problemi aperti

Nessun blocco noto. Eccezione di accessibilità documentata: pan, zoom e creazione visuale degli archi sul canvas React Flow richiedono un dispositivo di puntamento; aggiunta blocchi, configurazione, revisione e salvataggio sono utilizzabili da tastiera.

## Impatto documentazione

- TASK-019: nessun aggiornamento alle guide necessario; il cambiamento riguarda esclusivamente la disposizione visuale di wordmark e titolo, senza modificare gerarchia applicativa, flussi, API o comportamento del workflow.
- TASK-020: nessun aggiornamento alle guide necessario; il cambiamento riguarda esclusivamente la posizione visuale del titolo workflow nello step editor.
- TASK-021: aggiornati `docs/09-dependencies-and-libraries.md` e `docs/README.md`; registrata D-021 per la nona guida del hub documentale.
- TASK-022: aggiornati `docs/03-frontend-state-and-data-flow.md` e `docs/05-graph-model-and-validation.md`; nessun cambio API o dipendenza.
- TASK-023: nessun aggiornamento alle guide necessario; correzione visuale locale del fit testo nei bottoni.
- TASK-024: nessun aggiornamento alle guide necessario; correzione visuale locale della disposizione bottoni.
- TASK-025: aggiornati `docs/03-frontend-state-and-data-flow.md` e `docs/05-graph-model-and-validation.md`; nessun cambio API o dipendenza.
- TASK-026: aggiornati `docs/03-frontend-state-and-data-flow.md` e `docs/05-graph-model-and-validation.md`; nessun cambio API o dipendenza.
- TASK-028: aggiornati `docs/02-bootstrap-and-runtime.md`, `docs/03-frontend-state-and-data-flow.md` e `docs/06-api-and-persistence.md`; nessun cambio API payload o dipendenza.
- TASK-018: nessun aggiornamento alle guide necessario; la sostituzione del lockup non cambia struttura, comportamento, API o flussi documentati.

## Terminazione percorsi

- Codice errore: `unterminated_path`.
- Messaggio: `<label> non conduce ad alcun nodo end.` con `nodeId` per focus ed evidenziazione.
- Algoritmo: visita inversa multi-source dagli end più reachability dallo start, complessità O(V+E).

## Contratto salvataggio mock

- Request: `version`, `metadata`, `nodes`, `edges`; response: `id`, `version`, `status`, `createdAt`.
- Server: JSON Server 0.17.4 su `127.0.0.1:3001`, proxy Vite `/api`, database runtime `mocks/data/db.json` inizializzato dal seed versionato.
- Persistenza: chiave `localStorage` `baited:last-saved-workflow`, contenente request e response.
- Errore simulato: checkbox in Revisione, implementata con header one-shot `x-baited-simulate-error: true` e risposta `503`.

## Contratto scenario OSINT

- Kind: `generate_scenario_from_osint`.
- Config: `scenarioTemplate`, `channel`, `evidenceStrategy`.
- Vincolo: deve trovarsi downstream da `start_osint_on_targets`; errore `missing_osint_source` in caso contrario.
- Demo: `workflow_start → OSINT → generazione scenario → create_campaign`.

## Prossimo passo

Nessuna task attiva; scegliere il prossimo incremento dal piano o da una nuova richiesta.
