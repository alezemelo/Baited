# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare, salvare e gestire workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-031 completata: Home e Archivio aprono workflow salvati tramite `/workflow/:workflowId`, caricando il record direttamente dal mock DB.

## Task attiva

Nessuna.

## Ultima sessione

- Creata `TASK-031` per rimuovere il bridge localStorage nell'apertura dei workflow salvati.
- Aggiunta rotta `/workflow/:workflowId` con fetch `GET /api/workflows/:id` e mount del provider con draft DB.
- Home e `/workflows` ora linkano direttamente allo studio per ID; localStorage resta solo per `/workflow` senza ID e per il draft salvato localmente.
- Aggiornati test, E2E e documentazione; archiviata `TASK-031`.

## Verifiche effettuate

- `npm run test` — superato: 15 test dominio e 31 test componenti.
- `npm run test:e2e` — superato: 6 test Chromium, incluso refresh diretto di `/workflow/:id` senza bridge localStorage.
- `npm run build` — superato.
- `npm run lint` — superato.
- `git diff --check` — superato.

## Rischi o blocchi

Nessun blocco noto. Eccezione già nota: pan, zoom e creazione visuale degli archi sul canvas React Flow richiedono un dispositivo di puntamento; aggiunta blocchi, configurazione, revisione, salvataggio e gestione archivio restano utilizzabili da UI standard.

## Impatto documentazione

- Aggiornato `docs/02-bootstrap-and-runtime.md` con `/workflow/:id` e refresh DB-backed.
- Aggiornato `docs/03-frontend-state-and-data-flow.md` con apertura tramite ID e ruolo residuo di localStorage.
- Aggiornato `docs/06-api-and-persistence.md` con `GET /api/workflows/:id` usato dallo studio.
- Nessun cambio a payload `POST /api/workflows`.
- Nessuna nuova dipendenza.

## Prossimo passo

Nessuna task attiva; scegliere il prossimo incremento dal piano o da una nuova richiesta.
