# TASK-013 — Generazione scenario da risultati OSINT

- Stato: `planned`
- Dipendenze: TASK-012

## Obiettivo

Modellare come azione distinta la generazione di uno scenario predefinito basato sulle informazioni raccolte da un nodo OSINT precedente.

## File coinvolti

- `src/features/workflow/types.ts`
- `src/features/workflow/catalog.ts`
- `src/features/workflow/validation/validateWorkflow.ts`
- `src/components/workflow/WorkflowIcon.tsx`
- `src/components/workflow/NodeInspector.tsx`
- `src/components/workflow/WorkflowNodeCard.tsx`
- `src/components/workflow/NodeLibrary.tsx`
- `tests/workflow-validation.test.ts`
- `src/components/workflow/NodeInspector.test.tsx`
- `e2e/workflow.spec.ts`
- `README.md`

## Passi di implementazione

1. Aggiungere un nuovo kind discriminato `generate_scenario_from_osint` con configurazione tipizzata.
2. Definire almeno template/scenario, canale risultante e strategia di selezione delle evidenze OSINT.
3. Inserire il blocco nella libreria e implementarne l'inspector accessibile.
4. Validare i campi obbligatori e il vincolo che il nodo sia preceduto, direttamente o lungo il percorso, da `start_osint_on_targets`.
5. Includere il nuovo nodo nel serializer, nel riepilogo e nel payload mock senza casi speciali non tipizzati.
6. Aggiungere un esempio OSINT → generazione scenario → campagna e coprirlo nei test.

## Criteri di accettazione

- Il nuovo blocco è aggiungibile con drag, click e tastiera e dispone di configurazione modificabile.
- Un nodo di generazione scenario privo di un predecessore OSINT valido blocca il salvataggio.
- Configurazione e relazione con OSINT sono preservate nel payload v1.
- Il catalogo espone otto kind complessivi, incluso il nuovo tipo, senza regressioni sui workflow esistenti.

## Verifiche richieste

- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run lint`

## Note per l'handoff

Documentare il contratto del nuovo nodo, il vincolo di provenienza OSINT e l'esempio aggiunto alla demo.
