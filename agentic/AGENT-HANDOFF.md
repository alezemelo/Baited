# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare e salvare workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

Il modello applicativo è operativo: sette kind discriminati, catalogo/factory centralizzato, draft iniziale tipizzato e `WorkflowProvider` condiviso alimentano pagina, libreria e canvas. La fase successiva è il wizard a tre step.

## Task attiva

Nessuna. `TASK-002` è stata completata e archiviata.

## Ultima sessione

- Inizializzato il progetto nella root Git esistente.
- Installate le dipendenze frontend.
- Configurati Tailwind CSS e React Flow.
- Sostituita la demo Vite con una shell minimale del Workflow Studio.
- Creato il sistema agentico Markdown e archiviata `TASK-001`.
- Applicata la convenzione React pages/components e archiviata `TASK-009`.
- Applicato il design system Lumina/Baited e archiviata `TASK-010`.
- Implementato il modello workflow e archiviata `TASK-002`.

## Verifiche effettuate

- `npm run build` — superato.
- `npm run lint` — superato.
- `npm run dev -- --host 127.0.0.1` — server avviato e risposta HTTP verificata.
- Browser locale — pagina, sidebar e quattro nodi React Flow verificati dopo il refactor.
- Browser 1280×720 e 1440×900 — layout senza overflow, sette nodi e sei archi iniziali verificati.
- Drag/selezione, nuova connessione, zoom, fit view e pan — superati; console senza warning o errori.
- Modello/provider — build e lint senza warning; browser con drag, selezione e connessione superato.

## Problemi aperti

Nessun blocco noto. I vincoli del catalogo sono dichiarativi: la loro applicazione e la validazione DAG appartengono alle task successive.

## Prossimo passo

Aprire [`tasks/TASK-003-wizard-shell.md`](tasks/TASK-003-wizard-shell.md), impostarla `in_progress` e costruire gli step Dettagli, Workflow e Revisione sopra il provider esistente.
