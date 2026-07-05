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
