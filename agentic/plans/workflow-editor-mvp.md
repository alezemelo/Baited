# Piano — Workflow Editor MVP

## Obiettivo

Realizzare una demo desktop-first in cui l'utente definisce i dati generali, compone un workflow a blocchi con branching, ne verifica la validità e lo salva tramite API mock.

## Esperienza prevista

1. **Dettagli:** nome, descrizione e target del workflow.
2. **Costruzione:** sidebar dei blocchi, canvas drag-and-drop e pannello proprietà.
3. **Revisione:** riepilogo, errori di validazione e salvataggio.

## Contratto funzionale

- Il grafo deve avere un solo nodo iniziale, almeno un nodo finale ed essere aciclico.
- I nodi azione espongono al massimo un'uscita; i nodi condizione espongono branch ordinati `if`, `else if` ed `else`.
- I nodi possono essere incompleti durante l'editing, ma il salvataggio è bloccato in presenza di errori.
- Il salvataggio usa `POST /api/workflows` e restituisce ID, versione, stato e data.
- Nessuna campagna viene eseguita realmente.

## Struttura React

- `src/App.tsx` è l'entrypoint applicativo e compone la pagina iniziale senza contenere componenti di dominio.
- Ogni schermata raggiungibile risiede in `src/pages/` e usa il suffisso `Page`.
- Ogni componente riutilizzabile risiede in `src/components/`, organizzato per area (`layout`, `workflow`, `wizard`).
- `src/features/` contiene soltanto logica non visuale di dominio, come tipi, stato, API e validazione.

## Sequenza delle task

| Task | Risultato | Dipendenze | Stato |
| --- | --- | --- | --- |
| TASK-001 | Bootstrap e struttura agentica | — | Completata |
| TASK-002 | Modello workflow e store | TASK-001, TASK-010 | Completata |
| TASK-003 | Shell del wizard | TASK-002 | Completata |
| TASK-004 | Editor canvas | TASK-002, TASK-003 | Completata |
| TASK-005 | Configurazione dei nodi | TASK-004 | Completata |
| TASK-006 | Branching e validazione DAG | TASK-005 | Completata |
| TASK-007 | Revisione e salvataggio mock | TASK-006 | Completata |
| TASK-008 | Test, accessibilità e rifinitura | TASK-007 | Pianificata |
| TASK-009 | Convenzione React pages/components | TASK-001 | Completata |
| TASK-010 | Design system Lumina/Baited | TASK-009 | Completata |

## Definizione di completamento

- Il percorso dettagli → canvas → revisione è utilizzabile senza errori bloccanti.
- Sono disponibili i sette tipi di nodo definiti nella specifica.
- Drag-and-drop, collegamento, configurazione, duplicazione ed eliminazione funzionano.
- Cicli, nodi orfani e configurazioni incomplete impediscono il salvataggio con messaggi comprensibili.
- Un salvataggio mock riuscito restituisce e mostra l'identificativo del workflow.
- Build, lint e test automatizzati risultano verdi.
- README e handoff riflettono il comportamento effettivo.
