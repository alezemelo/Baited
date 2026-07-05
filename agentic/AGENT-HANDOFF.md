# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare e salvare workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-006 è completata. Il workflow ora ha validazione DAG/branch/configurazioni incomplete con errori strutturati, evidenziazione su canvas, focus dalla revisione e test automatici dedicati.

## Task attiva

Nessuna task in corso.

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

## Verifiche effettuate

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

Nessun blocco noto. Caso limite consapevole: TASK-006 non richiede ancora di forzare ogni foglia non-end a convergere su un end; TASK-007 dovrà solo bloccare il salvataggio sugli errori già esposti da `validation.isValid`.

## Prossimo passo

Avviare TASK-007 — Revisione e salvataggio mock: serializzare il payload, bloccare il salvataggio quando `validation.isValid` è falso, simulare `POST /api/workflows` e salvare l'ultimo workflow in `localStorage`.
