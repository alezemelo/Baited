# TASK-004 — Editor canvas

- Stato: `in_progress`
- Dipendenze: TASK-002, TASK-003

## Obiettivo

Trasformare il canvas dimostrativo in un editor con libreria blocchi, drag-and-drop e operazioni essenziali.

## File coinvolti

- `src/components/workflow/WorkflowCanvas.tsx`
- `src/components/workflow/NodeLibrary.tsx`
- `src/components/workflow/WorkflowNodeCard.tsx`
- `src/components/workflow/WorkflowProvider.tsx`

## Passi di implementazione

1. Mostrare il catalogo nodi nella sidebar per categoria.
2. Aggiungere nodi tramite drag-and-drop nella posizione corretta del canvas.
3. Implementare nodi custom con tipo, etichetta, stato configurazione e handle consentiti.
4. Supportare selezione, spostamento, collegamento, duplicazione ed eliminazione.
5. Mantenere controlli, minimappa, zoom, pan e fit view.
6. Richiedere conferma prima di eliminare un nodo con connessioni.

## Criteri di accettazione

- Tutti i tipi del catalogo possono essere aggiunti.
- Le coordinate restano corrette con zoom e pan.
- Le azioni aggiornano lo stato senza ID duplicati o archi pendenti.
- Il nodo selezionato è distinguibile visivamente.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Prova manuale di tutte le operazioni con zoom diverso da 100%.

## Note per l'handoff

Descrivere convenzione degli ID, limiti degli handle e problemi noti del drag-and-drop.

## Note di apertura sessione

- 2026-07-05: contesto verificato da `START-SESSION.md`; TASK-002 e TASK-003 risultano completate.
- Baseline iniziale: `npm run build` superato; `npm run lint` superato.
- Il provider espone già `addNode`, `removeNode`, `duplicateNode`, `connectNodes` e selezione; la libreria è ancora visuale e il canvas non gestisce drop da sidebar.
