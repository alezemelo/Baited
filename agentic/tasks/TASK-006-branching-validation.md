# TASK-006 — Branching e validazione DAG

- Stato: `planned`
- Dipendenze: TASK-005

## Obiettivo

Applicare i vincoli strutturali del grafo e produrre errori utilizzabili sia nel canvas sia nella revisione.

## File coinvolti

- `src/features/workflow/validation/validateWorkflow.ts`
- `src/features/workflow/validation/graph.ts`
- `src/components/workflow/WorkflowCanvas.tsx`

## Passi di implementazione

1. Rifiutare self-loop, archi duplicati e connessioni che introducono cicli.
2. Associare gli archi delle condizioni a branch stabili e mostrare le relative label.
3. Validare un solo start, almeno un end, raggiungibilità, nodi orfani e campi obbligatori.
4. Validare tutti i branch di condizione, incluso `else`.
5. Restituire errori strutturati con codice, messaggio e riferimento al nodo/arco.
6. Evidenziare gli elementi errati e consentire di portarli in focus.

## Criteri di accettazione

- Non è possibile creare un ciclo dal canvas.
- Ogni grafo non salvabile produce almeno un errore specifico.
- Un workflow valido non produce falsi positivi.
- La validazione non modifica il grafo ricevuto.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Test automatici per ciclo, orfani, start/end, branching e caso valido.

## Note per l'handoff

Registrare complessità dell'algoritmo, codici errore e casi limite non coperti.
