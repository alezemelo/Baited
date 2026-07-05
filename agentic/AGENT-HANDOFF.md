# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare e salvare workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-004 è in corso. Il wizard a tre step resta operativo sopra il modello condiviso; baseline build/lint iniziale verde. La sessione sta collegando libreria e operazioni canvas al provider per rendere operativo l'editor.

## Task attiva

`TASK-004 — Editor canvas` (`in_progress`).

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

## Verifiche effettuate

- `npm run build` — superato.
- `npm run lint` — superato.
- `npm run dev -- --host 127.0.0.1` — server avviato e risposta HTTP verificata.
- Browser locale — pagina, sidebar e quattro nodi React Flow verificati dopo il refactor.
- Browser 1280×720 e 1440×900 — layout senza overflow, sette nodi e sei archi iniziali verificati.
- Drag/selezione, nuova connessione, zoom, fit view e pan — superati; console senza warning o errori.
- Modello/provider — build e lint senza warning; browser con drag, selezione e connessione superato.
- Wizard — validazione/focus, navigazione, persistenza, revisione e pannello proprietà verificati a 1024 e 1280 px.

## Problemi aperti

Nessun blocco noto. La libreria è ancora visuale: aggiunta tramite drag-and-drop, duplicazione, eliminazione e conferme appartengono a TASK-004.

## Prossimo passo

Implementare drag-and-drop dalla libreria al canvas, poi collegare duplicazione/eliminazione alla selezione mantenendo controlli, minimappa, zoom, pan e fit view.
