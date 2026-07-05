# TASK-012 — Timeout esplicito delle condizioni

- Stato: `planned`
- Dipendenze: TASK-011

## Obiettivo

Rendere esplicita la semantica temporale del workflow introducendo nel nodo condition un timeout configurabile, separato dall'eventuale attesa delle azioni campagna.

## File coinvolti

- `src/features/workflow/types.ts`
- `src/features/workflow/catalog.ts`
- `src/features/workflow/initialWorkflow.ts`
- `src/features/workflow/validation/validateWorkflow.ts`
- `src/components/workflow/NodeInspector.tsx`
- `src/components/workflow/WorkflowNodeCard.tsx`
- `tests/workflow-validation.test.ts`
- `src/components/workflow/NodeInspector.test.tsx`

## Passi di implementazione

1. Aggiungere `waitForMinutes` alla configurazione discriminata del nodo `condition`.
2. Definire valori iniziali e vincoli numerici coerenti nel catalogo.
3. Esporre il campo nell'inspector con label e hint che chiariscano quando vengono valutati i branch.
4. Validare valori mancanti, non finiti o negativi e bloccare il salvataggio.
5. Mostrare il timeout nel subtitle del nodo e conservarlo nel payload serializzato.
6. Aggiornare test dominio, componenti e documentazione del contratto.

## Criteri di accettazione

- Il nodo condition distingue chiaramente timeout di valutazione e `elapsedTimeMinutes` delle azioni.
- Il valore è modificabile da tastiera, persistito nel draft e serializzato nell'API mock.
- Valori invalidi producono feedback accessibile e impediscono il salvataggio.
- L'esempio “se la mail non viene aperta dopo N minuti” è rappresentabile senza affidarsi a testo descrittivo.

## Verifiche richieste

- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run lint`

## Note per l'handoff

Documentare unità, valore predefinito e relazione semantica tra timeout condition ed elapsed time delle campagne.
