# TASK-005 — Configurazione dei nodi

- Stato: `planned`
- Dipendenze: TASK-004

## Obiettivo

Implementare il pannello proprietà con form specifici per ogni blocco previsto dall'MVP.

## File coinvolti

- `src/components/workflow/NodeInspector.tsx`
- `src/components/workflow/config/`
- `src/features/workflow/catalog.ts`

## Passi di implementazione

1. Mostrare un invito alla selezione quando nessun nodo è attivo.
2. Implementare campi per campagna, canale, target/gruppi, tempo di attesa e tipo OSINT.
3. Implementare per `condition` un elenco ordinabile di regole e un branch `else` non eliminabile.
4. Aggiornare nodi e label in tempo reale senza perdere le connessioni.
5. Indicare sul nodo configurazioni mancanti senza bloccare l'editing.

## Criteri di accettazione

- Ogni tipo mostra soltanto i campi pertinenti.
- I valori persistono cambiando selezione e step.
- Le regole supportano `if`, più `else if` ed un solo `else` finale.
- I campi obbligatori hanno label e messaggi accessibili.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Configurazione manuale di tutti i tipi di nodo.

## Note per l'handoff

Elencare campi obbligatori, valori ammessi e qualsiasi semplificazione adottata per l'MVP.
