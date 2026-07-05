# TASK-002 — Modello workflow e stato applicativo

- Stato: `planned`
- Dipendenze: TASK-001, TASK-010

## Obiettivo

Definire un modello TypeScript stabile per metadati, nodi, branch ed archi e spostare lo stato React Flow fuori dal componente principale.

## File coinvolti

- `src/features/workflow/types.ts`
- `src/features/workflow/catalog.ts`
- `src/components/workflow/WorkflowProvider.tsx`
- `src/components/workflow/WorkflowCanvas.tsx`

## Passi di implementazione

1. Evolvere i tipi demo introdotti da TASK-010 definendo `WorkflowDraft`, `WorkflowEdgeData`, configurazioni specifiche e la union discriminata completa basata su `kind`.
2. Modellare i nodi `workflow_start`, `create_campaign`, `start_awareness_campaign`, `add_target_to_group`, `start_osint_on_targets`, `condition` e `workflow_end`.
3. Creare un catalogo con etichetta, categoria, valori iniziali e vincoli di connessione.
4. Implementare un provider con operazioni per metadati, nodi, archi e selezione corrente.
5. Adattare il canvas minimale al nuovo stato senza cambiare ancora il layout del wizard.

## Criteri di accettazione

- Nessun dato di dominio è definito direttamente in `App.tsx`.
- Ogni nodo è una union discriminata e ha configurazione iniziale tipizzata.
- Lo stato espone operazioni esplicite e non richiede cast non sicuri.
- La demo attuale continua a renderizzarsi e a permettere lo spostamento dei nodi.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Controllo manuale di spostamento e collegamento nodi.

## Note per l'handoff

Documentare i tipi pubblici introdotti, la forma dello stato e ogni modifica al catalogo concordato.
