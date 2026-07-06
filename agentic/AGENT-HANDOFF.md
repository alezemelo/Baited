# Agent handoff

## Obiettivo

Costruire un MVP desktop-first per comporre, validare, salvare e gestire workflow di campagne tramite un grafo diretto aciclico.

## Piano attivo

[`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md)

## Stato sintetico

TASK-029 completata: i workflow salvati si possono eliminare dalla pagina `/workflows` con conferma, aggiornamento della lista e pulizia del ripristino locale quando necessario.

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
- Archiviata `TASK-029` in `agentic/memory/completed-tasks.md`; `agentic/tasks/` è vuota.

## Verifiche effettuate

- `npm run test` — superato: 15 test dominio e 31 test componenti.
- `npm run test:e2e` — superato: 6 test Chromium, inclusa eliminazione reale da `/workflows` dopo salvataggio.
- `npm run build` — superato.
- `npm run lint` — superato.
- `git diff --check` — superato.

## Rischi o blocchi

Nessun blocco noto. Eccezione già nota: pan, zoom e creazione visuale degli archi sul canvas React Flow richiedono un dispositivo di puntamento; aggiunta blocchi, configurazione, revisione, salvataggio e gestione archivio restano utilizzabili da UI standard.

## Impatto documentazione

- Aggiornato `docs/03-frontend-state-and-data-flow.md` con il comportamento di eliminazione archivio e cleanup di `baited:last-saved-workflow`.
- Aggiornato `docs/06-api-and-persistence.md` con `DELETE /api/workflows/:id`, comportamento UI e esempio `curl`.
- Nessun cambio a payload `POST /api/workflows`.
- Nessuna nuova dipendenza.

## Prossimo passo

Scegliere il prossimo incremento: caricamento editor diretto per ID dal database, duplicazione workflow salvato, oppure cleanup/release checkpoint.
