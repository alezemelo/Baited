# Task completate

Registro append-only. Non modificare o rimuovere le voci esistenti; eventuali correzioni vanno aggiunte come note datate.

## TASK-001 — Fondazioni frontend e sistema agentico

- Completata: 2026-07-05
- Risultato: inizializzata la SPA React/TypeScript con Vite, configurati Tailwind CSS e React Flow, realizzata una shell visuale minima e creato il protocollo agentico Markdown.
- File principali: `package.json`, `vite.config.ts`, `src/App.tsx`, `src/index.css`, `agentic/`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; server Vite — avviato e risposta HTTP verificata.
- Decisioni: D-001, D-002, D-003, D-004.
- Follow-up: TASK-002 deve estrarre dal prototipo iniziale un modello dati tipizzato e uno store dedicato.

## TASK-009 — Struttura React pages/components

- Completata: 2026-07-05
- Risultato: reso `App.tsx` un entrypoint sottile, spostata la schermata in `src/pages/` ed estratti header, libreria nodi e canvas sotto `src/components/`.
- File principali: `src/App.tsx`, `src/pages/WorkflowStudioPage.tsx`, `src/components/layout/AppHeader.tsx`, `src/components/workflow/`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; browser locale — titolo, sidebar, canvas e quattro nodi verificati.
- Decisioni: D-006.
- Follow-up: TASK-002 deve mantenere componenti e provider React sotto `src/components/` e collocare in `src/features/` soltanto tipi e logica non visuale.

## TASK-010 — Design system Lumina/Baited

- Completata: 2026-07-05
- Risultato: applicata la shell scura Lumina/Baited con top bar, rail, libreria, toolbar, nodi custom e grafo demo ramificato in italiano.
- File principali: `src/index.css`, `src/components/layout/`, `src/components/workflow/`, `src/features/workflow/`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; browser 1280×720 e 1440×900 — dimensioni, overflow e rendering verificati; drag, selezione, nuova connessione, zoom, fit view e pan — superati; console — nessun warning o errore.
- Decisioni: D-007.
- Follow-up: TASK-002 deve evolvere i tipi e dati demo esistenti nel modello definitivo senza spostare componenti React fuori da `src/components/`.

## TASK-002 — Modello workflow e stato applicativo

- Completata: 2026-07-05
- Risultato: introdotti union discriminata, configurazioni per i sette kind, catalogo/factory, draft iniziale tipizzato e provider condiviso con operazioni per metadati, nodi, archi e selezione.
- File principali: `src/features/workflow/`, `src/components/workflow/WorkflowProvider.tsx`, `src/components/workflow/WorkflowCanvas.tsx`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato senza warning; browser — sette nodi, sei archi e sei template verificati; drag/selezione e nuova connessione — superati; console — nessun warning o errore.
- Decisioni: D-008.
- Follow-up: TASK-003 deve costruire il wizard sui metadati e sulle operazioni già esposte dal provider.

## TASK-003 — Shell del wizard

- Completata: 2026-07-05
- Risultato: implementati gli step Dettagli, Workflow e Revisione con progress accessibile, navigazione avanti/indietro, form collegato al provider e area proprietà del nodo.
- File principali: `src/components/wizard/`, `src/components/workflow/WorkflowPropertiesPanel.tsx`, `src/pages/WorkflowStudioPage.tsx`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; browser 1024 px — validazione nome, focus, navigazione e persistenza superati; browser 1280 px — area proprietà e selezione nodo superate; console — nessun warning o errore.
- Decisioni: D-009.
- Follow-up: TASK-004 deve rendere operativa la libreria con drag-and-drop, duplicazione ed eliminazione usando le operazioni già esposte dal provider.

## TASK-004 — Editor canvas

- Completata: 2026-07-05
- Risultato: resa operativa la libreria per categorie con drag-and-drop sul canvas, coordinate corrette con zoom/pan, minimappa, selezione persistente, spostamento, collegamento, duplicazione, eliminazione e conferma inline per nodi con connessioni.
- File principali: `src/components/workflow/NodeLibrary.tsx`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/workflow/CanvasActionBar.tsx`, `src/components/workflow/WorkflowProvider.tsx`, `src/components/wizard/WorkflowWizard.tsx`, `src/features/workflow/catalog.ts`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; browser locale 1280×720 con zoom canvas 0.4544 — aggiunti tutti i sei template di libreria, drag-and-drop, selezione, spostamento, nuova connessione, duplicazione, eliminazione senza connessioni e conferma eliminazione con connessioni superati.
- Decisioni: Nessuna.
- Follow-up: TASK-005 deve usare la selezione e le operazioni del provider per rendere modificabili le configurazioni dei nodi.

## TASK-005 — Configurazione dei nodi

- Completata: 2026-07-05
- Risultato: implementato `NodeInspector` con form specifici per i sette tipi nodo, campi obbligatori accessibili, stato incompleto visibile sul nodo, aggiornamento realtime di label/subtitle/status e supporto a regole condition `if`/`else if` ordinabili con `else` finale non eliminabile.
- File principali: `src/components/workflow/NodeInspector.tsx`, `src/components/workflow/config/FormControls.tsx`, `src/components/workflow/WorkflowPropertiesPanel.tsx`, `src/components/workflow/WorkflowNodeCard.tsx`, `src/components/workflow/WorkflowProvider.tsx`.
- Verifiche: `npm run build` — superato; `npm run lint` — superato; `git diff --check` — superato; browser 1440×900 — configurati trigger, campagna email/IM, campagna SMS, target group, awareness, condition, end e OSINT; persistenza tra selezioni e step Revisione superata; console senza warning o errori.
- Decisioni: Nessuna.
- Follow-up: TASK-006 deve validare DAG, branch condition e configurazioni incomplete prima del salvataggio.

## TASK-006 — Branching e validazione DAG

- Completata: 2026-07-05
- Risultato: introdotto un validator puro per DAG, start/end, self-loop, archi duplicati, reachability, nodi orfani, branch condition e campi obbligatori; il provider blocca nuove connessioni cicliche; canvas e revisione evidenziano errori strutturati con focus sul nodo problematico.
- File principali: `src/features/workflow/validation/graph.ts`, `src/features/workflow/validation/validateWorkflow.ts`, `src/components/workflow/WorkflowProvider.tsx`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/wizard/WorkflowReviewStep.tsx`, `tests/workflow-validation.test.ts`, `tsconfig.test.json`.
- Verifiche: `npm run test` — superato con 6 test su caso valido non mutante, ciclo, orfani/raggiungibilità, start/end, branch condition e self-loop/duplicati/campi obbligatori; `npm run build` — superato; `npm run lint` — superato.
- Decisioni: D-010.
- Note tecniche: gli algoritmi di reachability e cycle detection sono O(V+E); codici errore esposti: `missing_start`, `multiple_start`, `missing_end`, `self_loop`, `duplicate_edge`, `invalid_connection`, `cycle_detected`, `orphan_node`, `unreachable_node`, `missing_required_field`, `missing_condition_branch`, `dangling_condition_branch`.
- Follow-up: TASK-007 deve usare `validation.isValid` per bloccare il salvataggio mock e serializzare il payload.

## TASK-007 — Revisione e salvataggio mock

- Completata: 2026-07-05
- Risultato: aggiunti payload v1 privo dello stato UI React Flow, `POST /api/workflows` intercettato da MSW, persistenza e ripristino dell'ultimo workflow, riepilogo branch e stati loading/successo/errore con retry nello step Revisione.
- File principali: `src/features/workflow/api/workflows.ts`, `src/features/workflow/api/mock.ts`, `src/components/wizard/WorkflowReviewStep.tsx`, `src/components/workflow/WorkflowProvider.tsx`, `src/main.tsx`, `tests/workflow-api.test.ts`, `public/mockServiceWorker.js`.
- Verifiche: `npm run test` — superato con 9 test; `npm run build` — superato; `npm run lint` — superato; `git diff --check` — superato. Browser smoke test non eseguito perché il bind del server locale non è stato autorizzato dall'ambiente.
- Decisioni: D-011.
- Follow-up: TASK-008 deve eseguire QA browser completo, verificare accessibilità/responsive e rifinire documentazione e UX finale.

## TASK-008 — Test, accessibilità e rifinitura

- Completata: 2026-07-05
- Risultato: configurati Vitest/Testing Library, Playwright e axe; coperti configurazione nodo, focus/errori, dirty state, eliminazione, aggiunta da tastiera, errore/retry API e recupero dopo refresh; aggiunti `beforeunload`, feedback coerenti e documentazione completa.
- File principali: `vite.config.ts`, `playwright.config.ts`, `src/**/*.test.tsx`, `e2e/workflow.spec.ts`, `src/components/layout/AppHeader.tsx`, `src/components/workflow/NodeLibrary.tsx`, `src/components/workflow/WorkflowPropertiesPanel.tsx`, `src/components/workflow/WorkflowProvider.tsx`, `README.md`.
- Verifiche: `npm run test` — superato con 9 test dominio e 5 test componenti; `npm run test:e2e` — superato con 3 test Chromium inclusi axe, errore/retry e refresh; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-012.
- Follow-up: Nessuno; tutte le task del piano Workflow Editor MVP sono completate.

## TASK-011 — Terminazione di tutti i percorsi

- Completata: 2026-07-05
- Risultato: aggiunta la reachability inversa multi-end, introdotto l'errore strutturato `unterminated_path`, completato il ramo training del workflow iniziale e mantenuto il focus generico dalla revisione.
- File principali: `src/features/workflow/validation/graph.ts`, `src/features/workflow/validation/validateWorkflow.ts`, `src/features/workflow/initialWorkflow.ts`, `tests/workflow-validation.test.ts`, `e2e/workflow.spec.ts`, `README.md`.
- Verifiche: `npm run test` — superato con 11 test dominio e 5 componenti; `npm run test:e2e` — superato con 3 test Chromium; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-013.
- Follow-up: TASK-012 deve rendere esplicito il timeout di valutazione delle condizioni.

## TASK-012 — Timeout esplicito delle condizioni

- Completata: 2026-07-06
- Risultato: aggiunto `waitForMinutes` alla config condition con default 2880, input numerico accessibile, validazione, subtitle derivato e serializzazione automatica nel payload v1.
- File principali: `src/features/workflow/types.ts`, `src/features/workflow/catalog.ts`, `src/features/workflow/validation/validateWorkflow.ts`, `src/components/workflow/NodeInspector.tsx`, `tests/workflow-validation.test.ts`, `tests/workflow-api.test.ts`, `src/components/workflow/NodeInspector.test.tsx`, `e2e/workflow.spec.ts`, `README.md`.
- Verifiche: `npm run test` — superato con 12 test dominio e 6 componenti; `npm run test:e2e` — superato con 3 test Chromium; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-014.
- Follow-up: TASK-013 deve introdurre il nodo tipizzato di generazione scenario da risultati OSINT.

## TASK-013 — Generazione scenario da risultati OSINT

- Completata: 2026-07-06
- Risultato: aggiunto l'ottavo kind `generate_scenario_from_osint` con icona, catalogo, inspector, campi tipizzati, validazione di configurazione e provenienza OSINT; la demo include OSINT → scenario → email e il payload conserva la config senza casi speciali.
- File principali: `src/features/workflow/types.ts`, `src/features/workflow/catalog.ts`, `src/features/workflow/initialWorkflow.ts`, `src/features/workflow/validation/validateWorkflow.ts`, `src/components/workflow/NodeInspector.tsx`, `src/components/workflow/WorkflowIcon.tsx`, `src/components/workflow/WorkflowNodeCard.tsx`, `tests/workflow-validation.test.ts`, `tests/workflow-api.test.ts`, `e2e/workflow.spec.ts`, `README.md`.
- Verifiche: `npm run test:domain` — superato con 15 test; `npm run test:unit` — superato con 7 test; `npm run test:e2e` — superato con 3 test Chromium; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-015.
- Follow-up: Nessuno; le tre rifiniture finali richieste sono completate.

## TASK-014 — Creazione workflow da zero

- Completata: 2026-07-06
- Risultato: separati draft vuoto ed esempio, resi Start/End disponibili nella libreria, aggiunto empty state con esempio opzionale e introdotto reset esplicito con conferma e pulizia dello storage.
- File principali: `src/features/workflow/initialWorkflow.ts`, `src/features/workflow/catalog.ts`, `src/components/workflow/WorkflowProvider.tsx`, `src/features/workflow/WorkflowContext.ts`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/layout/AppHeader.tsx`, `src/pages/WorkflowStudioPage.tsx`, `e2e/workflow.spec.ts`, `README.md`.
- Verifiche: `npm run test` — superato con 15 test dominio e 9 componenti; `npm run test:e2e` — superato con 3 test Chromium; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-016.
- Follow-up: Nessuno.

## TASK-015 — API mock con JSON Server

- Completata: 2026-07-06
- Risultato: sostituito il mock browser MSW con un server HTTP JSON Server persistente, aggiunti adapter del contratto, proxy Vite, avvio congiunto, reset del database e lettura dei record tramite API; rimossi bootstrap, handler, dipendenza diretta e service worker MSW.
- File principali: `mocks/server.cjs`, `mocks/db.seed.json`, `package.json`, `vite.config.ts`, `playwright.config.ts`, `src/main.tsx`, `tests/workflow-api.test.ts`, `e2e/workflow.spec.ts`, `README.md`.
- Verifiche: `npm run test` — 15 test dominio e 9 componenti superati; `npm run test:e2e` — 3 test Chromium superati; `npm run build`, `npm run lint`, `npm audit --omit=optional` e `git diff --check` — superati; smoke test `POST`/`GET` con `curl` e avvio congiunto `npm run dev` — superati.
- Decisioni: D-017.
- Follow-up: Nessuno.

## TASK-016 — Documentazione composizione applicazione

- Completata: 2026-07-06
- Risultato: creato un hub tecnico developer-first in inglese con indice e otto guide su sistema, bootstrap, stato frontend, nove template workflow, modello e validazione DAG, API/persistenza, test ed estensione; aggiunto il collegamento dal README root.
- File principali: `docs/README.md`, `docs/01-system-overview.md`–`docs/08-extending-the-app.md`, `README.md`.
- Verifiche: inventario catalogo — 9 template e 8 kind corrispondenti; link Markdown locali — tutti risolti; `docs/` — esattamente 9 file e soltanto `.md`; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-018.
- Follow-up: aggiornare la guida pertinente nello stesso cambiamento quando evolvono catalogo, contratto API o architettura.

## TASK-017 — Home page e navigazione applicativa

- Completata: 2026-07-06
- Risultato: aggiunte Home su `/` ed editor su `/workflow` con React Router, lazy loading per route, rail route-aware che riusa l'icona Home Lucide, fallback delle route sconosciute, riepilogo dell'ultimo workflow valido e guardia dirty per navigazione SPA/history.
- File principali: `src/App.tsx`, `src/pages/HomePage.tsx`, `src/components/layout/SideNavigation.tsx`, `src/pages/WorkflowStudioPage.tsx`, `src/pages/HomePage.test.tsx`, `e2e/workflow.spec.ts`.
- Verifiche: `npm run test` — 15 test dominio e 12 componenti superati; `npm run test:e2e` — 4 test Chromium superati; `npm run build`, `npm run lint`, `npm audit --omit=optional` e diff check — superati; browser 1024×768 e 1440×900 — Home/editor senza overflow orizzontale e console pulita.
- Decisioni: D-020.
- Follow-up: le future pagine devono aggiungere route lazy, link reale nella rail, test URL/history/accessibilità e aggiornamenti documentali nello stesso turno.

## TASK-018 — Wordmark Baited nella Home

- Completata: 2026-07-06
- Risultato: sostituito nella top bar Home il lockup provvisorio con il wordmark SVG Baited 118×34 fornito, mantenendo il simbolo compatto nella rail e aggiungendo testo alternativo accessibile.
- File principali: `public/baited-logo.svg`, `src/pages/HomePage.tsx`, `src/pages/HomePage.test.tsx`.
- Verifiche: `npm run test:unit` — 12 test componenti superati; `npm run build`, `npm run lint` e diff check — superati; asset presente nel bundle e contenuto SVG verificato rispetto all'allegato.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: nessuno; struttura, comportamento, API e flussi restano invariati.

## TASK-019 — Wordmark workflow e titolo nello step editor

- Completata: 2026-07-06
- Risultato: riutilizzato il wordmark SVG Baited nella top bar del Workflow Studio e spostato il lockup icona/titolo nella barra di avanzamento esclusivamente durante lo step `workflow`; negli step `details` e `review` il titolo non viene mostrato.
- File principali: `src/components/layout/AppHeader.tsx`, `src/components/wizard/WizardProgress.tsx`, `src/components/wizard/WorkflowWizard.tsx`, `src/pages/WorkflowStudioPage.tsx`, `src/components/layout/AppHeader.test.tsx`, `src/components/wizard/WizardProgress.test.tsx`, `e2e/workflow.spec.ts`.
- Verifiche: `npm run test` — 15 test dominio e 14 componenti superati; `npm run test:e2e` — 4 test Chromium superati; `npm run build`, `npm run lint` e diff check — superati; browser 1024×768 e 1440×900 — tutti e tre gli step verificati senza overflow orizzontale.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: nessuno; disposizione visuale aggiornata senza modifiche a gerarchia applicativa, flussi, API o comportamento del workflow.

## TASK-020 — Titolo workflow nella libreria blocchi

- Completata: 2026-07-06
- Risultato: rimosso il lockup icona/titolo workflow da `WizardProgress` e renderizzato come primo elemento della sidebar `NodeLibrary` durante lo step editor.
- File principali: `src/components/wizard/WizardProgress.tsx`, `src/components/wizard/WorkflowWizard.tsx`, `src/components/workflow/NodeLibrary.tsx`, `src/components/wizard/WizardProgress.test.tsx`, `src/components/workflow/NodeLibrary.test.tsx`, `e2e/workflow.spec.ts`.
- Verifiche: `npm run test:unit` — 8 file e 14 test componenti superati; `npm run build`, `npm run lint`, `git diff --check` e `npm run test:e2e` — superati.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: nessuno; disposizione visuale aggiornata senza modifiche a gerarchia applicativa, flussi, API o comportamento del workflow.

## TASK-021 — Inventario dipendenze e librerie

- Completata: 2026-07-06
- Risultato: aggiunta la guida `docs/09-dependencies-and-libraries.md` con tutte le 23 dipendenze dirette di `package.json`, scopo, aree d'uso e moduli Node built-in usati da mock/test; collegata la guida dall'indice `docs/README.md`.
- File principali: `docs/09-dependencies-and-libraries.md`, `docs/README.md`, `agentic/memory/decisions.md`.
- Verifiche: controllo inventario — 23 dipendenze dirette documentate; controllo link Markdown locali — 10 file docs risolti; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: D-021.
- Follow-up: aggiornare `docs/09-dependencies-and-libraries.md` nello stesso cambio quando vengono aggiunte o rimosse dipendenze dirette.
- Impatto documentazione: guida nuova e indice docs aggiornato.

## TASK-022 — Selezione ed eliminazione connessioni

- Completata: 2026-07-06
- Risultato: aggiunta selezione esplicita degli edge, pannello dettagli connessione con origine/destinazione/branch, eliminazione con conferma e modello modifica tramite delete-and-recreate.
- File principali: `src/features/workflow/WorkflowContext.ts`, `src/components/workflow/WorkflowProvider.tsx`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/workflow/WorkflowPropertiesPanel.tsx`, `src/components/workflow/WorkflowProvider.test.tsx`, `src/components/workflow/WorkflowPropertiesPanel.test.tsx`, `e2e/workflow.spec.ts`, `docs/03-frontend-state-and-data-flow.md`, `docs/05-graph-model-and-validation.md`.
- Verifiche: `npm run test` — 15 test dominio e 19 componenti superati; `npm run test:e2e` — 5 test Chromium superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: se serve modifica diretta degli endpoint, creare una task separata per reconnect controllato e validato.
- Impatto documentazione: aggiornate le guide state/data flow e graph model/validation; nessun cambio API o dipendenze.

## TASK-023 — Fit testo nei bottoni di conferma eliminazione

- Completata: 2026-07-06
- Risultato: aggiornato il layout delle azioni nei dialog di conferma eliminazione per dare piu spazio al bottone distruttivo e centrare il testo con altezza stabile.
- File principali: `src/components/workflow/WorkflowPropertiesPanel.tsx`.
- Verifiche: `npm run test:unit` — 8 file e 19 test componenti superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: nessuno; correzione visuale locale senza cambi funzionali, API o dipendenze.

## TASK-024 — Bottoni conferma eliminazione in colonna

- Completata: 2026-07-06
- Risultato: sostituito il layout affiancato dei bottoni nei dialog di conferma eliminazione con una disposizione verticale a larghezza piena.
- File principali: `src/components/workflow/WorkflowPropertiesPanel.tsx`.
- Verifiche: `npm run test:unit` — 8 file e 19 test componenti superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: nessuno; correzione visuale locale senza cambi funzionali, API o dipendenze.

## TASK-025 — Riconnessione endpoint degli edge

- Completata: 2026-07-06
- Risultato: aggiunta riconnessione degli endpoint delle connessioni tramite mouse, con validazione delle regole esistenti, preservazione dell'ID edge, selezione coerente e rigenerazione di label/metadati branch per edge condition.
- File principali: `src/features/workflow/WorkflowContext.ts`, `src/components/workflow/WorkflowProvider.tsx`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/workflow/WorkflowPropertiesPanel.tsx`, `src/components/workflow/WorkflowProvider.test.tsx`, `e2e/workflow.spec.ts`, `docs/03-frontend-state-and-data-flow.md`, `docs/05-graph-model-and-validation.md`.
- Verifiche: `npm run test` — 15 test dominio e 22 componenti superati; `npm run test:e2e` — 6 test Chromium superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: aggiornate le guide state/data flow e graph model/validation; nessun cambio API o dipendenze.

## TASK-026 — Navigazione dagli errori di validazione

- Completata: 2026-07-06
- Risultato: rese azionabili le issue di validazione in Revisione; le issue con nodo tornano allo step workflow selezionando il blocco, quelle con connessione selezionano l'edge e aprono il connection inspector, mentre le issue workflow-level restano informative.
- File principali: `src/components/wizard/WorkflowReviewStep.tsx`, `src/components/wizard/WorkflowWizard.tsx`, `src/components/workflow/WorkflowCanvas.tsx`, `src/components/wizard/WorkflowReviewStep.test.tsx`, `e2e/workflow.spec.ts`, `docs/03-frontend-state-and-data-flow.md`, `docs/05-graph-model-and-validation.md`.
- Verifiche: `npm run test` — 15 test dominio e 25 componenti superati; `npm run test:e2e` — 6 test Chromium superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: Nessuno.
- Impatto documentazione: aggiornate le guide state/data flow e graph model/validation; nessun cambio API o dipendenze.

## TASK-028 — Pagina workflow salvati

- Completata: 2026-07-06
- Risultato: aggiunta la route `/workflows` raggiungibile dalla sidebar con lista dei workflow salvati via `GET /api/workflows`, stati loading/empty/error, metriche aggregate e azione per aprire un workflow nello studio usando il ripristino localStorage esistente.
- File principali: `src/App.tsx`, `src/components/layout/SideNavigation.tsx`, `src/features/workflow/api/workflows.ts`, `src/pages/WorkflowsPage.tsx`, `src/pages/WorkflowsPage.test.tsx`, `e2e/workflow.spec.ts`, `docs/02-bootstrap-and-runtime.md`, `docs/03-frontend-state-and-data-flow.md`, `docs/06-api-and-persistence.md`.
- Verifiche: `npm run test` — 15 test dominio e 29 componenti superati; `npm run test:e2e` — 6 test Chromium superati; `npm run build`, `npm run lint` e `git diff --check` — superati.
- Decisioni: Nessuna.
- Follow-up: quando serve gestione completa, aggiungere caricamento per ID senza passare dal localStorage e azioni di duplicazione/eliminazione.
- Impatto documentazione: aggiornate bootstrap/runtime, state/data flow e API/persistenza; nessun cambio API payload o dipendenze.
