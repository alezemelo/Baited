# TASK-007 — Revisione e salvataggio mock

- Stato: `planned`
- Dipendenze: TASK-006

## Obiettivo

Completare lo step Revisione e simulare `POST /api/workflows` con persistenza locale e stati di interfaccia.

## File coinvolti

- `src/features/workflow/api/workflows.ts`
- `src/features/workflow/api/mock.ts`
- `src/components/workflow/WorkflowReviewStep.tsx`

## Passi di implementazione

1. Serializzare metadati, nodi e archi in un payload con `version: 1`.
2. Mostrare riepilogo, conteggi, branch ed errori nello step Revisione.
3. Bloccare il salvataggio finché la validazione non è superata.
4. Simulare `POST /api/workflows` con MSW e risposta `id`, `version`, `status`, `createdAt`.
5. Conservare l'ultimo workflow salvato in `localStorage`.
6. Gestire loading, successo, errore e nuovo tentativo.

## Criteri di accettazione

- Il payload riflette esattamente lo stato visualizzato.
- Il salvataggio valido restituisce un ID mostrato all'utente.
- Un errore simulato non perde il draft e può essere ritentato.
- Il refresh consente di recuperare l'ultimo workflow salvato.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Test del serializer e dei tre stati API.

## Note per l'handoff

Documentare contratto request/response, chiave `localStorage` e metodo per simulare l'errore.
