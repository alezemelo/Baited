# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare, salvare e gestire workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-030 completata: la Home legge "Ultimo workflow" dal mock DB via `GET /api/workflows` e prepara il restore editor solo quando l'utente apre quel record.

## Task attiva

Nessuna.

## Ultima sessione

- Creata `TASK-029 — Eliminazione workflow salvati`.
- Aggiunto `deleteSavedWorkflow` al client API per `DELETE /api/workflows/:id`.
- Aggiunta conferma di eliminazione nelle card di `WorkflowsPage`.
- Dopo DELETE riuscita, la pagina rimuove il record dalla lista senza refresh e aggiorna metriche/empty state.
- Se il workflow eliminato coincide con `baited:last-saved-workflow`, il record localStorage viene rimosso per evitare restore stale in `/workflow`.
- Gli errori di eliminazione lasciano la card visibile e mostrano un alert recuperabile.
- Aggiornate le guide su state/data flow e API/persistenza.
- Archiviata `TASK-029` in `agentic/memory/completed-tasks.md`.
- Aggiornata la Home per leggere l'ultimo workflow dal DB, con stati loading/empty/error.
- L'azione Home "Apri workflow" ora scrive il record DB in `baited:last-saved-workflow` prima di entrare nello studio.
- Aggiornati test componenti, E2E e documentazione; archiviata `TASK-030`.

## Verifiche effettuate

- `npm run test` — superato: 15 test dominio e 32 test componenti.
- `npm run test:e2e` — superato: 6 test Chromium, inclusi stato Home da DB dopo salvataggio e stato vuoto dopo eliminazione.
- `npm run build` — superato.
- `npm run lint` — superato.
- `git diff --check` — superato.

## Rischi o blocchi

Nessun blocco noto. Eccezione già nota: pan, zoom e creazione visuale degli archi sul canvas React Flow richiedono un dispositivo di puntamento; aggiunta blocchi, configurazione, revisione, salvataggio e gestione archivio restano utilizzabili da UI standard.

## Impatto documentazione

- Aggiornato `docs/02-bootstrap-and-runtime.md` con `/` che legge `GET /api/workflows`.
- Aggiornato `docs/03-frontend-state-and-data-flow.md` con Home DB-backed e staging localStorage solo su apertura.
- Aggiornato `docs/06-api-and-persistence.md` con uso Home del list endpoint.
- Nessun cambio a payload `POST /api/workflows`.
- Nessuna nuova dipendenza.

## Prossimo passo

Nessuna task attiva; scegliere il prossimo incremento dal piano o da una nuova richiesta.
