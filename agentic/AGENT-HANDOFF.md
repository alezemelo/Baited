# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare e salvare workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

La shell Lumina/Baited è completata: top bar, rail, libreria blocchi, toolbar e canvas scuro compongono l'editor. Il grafo demo usa sette nodi custom tipizzati e mantiene tutte le interazioni React Flow. La fase successiva deve trasformare tipi e dati demo nel modello applicativo definitivo.

## Task attiva

Nessuna. `TASK-010` è stata completata e archiviata.

## Ultima sessione

- Inizializzato il progetto nella root Git esistente.
- Installate le dipendenze frontend.
- Configurati Tailwind CSS e React Flow.
- Sostituita la demo Vite con una shell minimale del Workflow Studio.
- Creato il sistema agentico Markdown e archiviata `TASK-001`.
- Applicata la convenzione React pages/components e archiviata `TASK-009`.
- Applicato il design system Lumina/Baited e archiviata `TASK-010`.

## Verifiche effettuate

- `npm run build` — superato.
- `npm run lint` — superato.
- `npm run dev -- --host 127.0.0.1` — server avviato e risposta HTTP verificata.
- Browser locale — pagina, sidebar e quattro nodi React Flow verificati dopo il refactor.
- Browser 1280×720 e 1440×900 — layout senza overflow, sette nodi e sei archi iniziali verificati.
- Drag/selezione, nuova connessione, zoom, fit view e pan — superati; console senza warning o errori.

## Problemi aperti

Nessun blocco noto. I font remoti hanno fallback di sistema; pulsanti e navigazione esterni al canvas restano dimostrativi come previsto.

## Prossimo passo

Aprire [`tasks/TASK-002-workflow-model.md`](tasks/TASK-002-workflow-model.md), impostarla `in_progress` ed evolvere tipi e dati demo nel modello definitivo rispettando D-006 e D-007.
