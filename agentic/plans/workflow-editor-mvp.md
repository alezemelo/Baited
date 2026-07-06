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
| TASK-008 | Test, accessibilità e rifinitura | TASK-007 | Completata |
| TASK-009 | Convenzione React pages/components | TASK-001 | Completata |
| TASK-010 | Design system Lumina/Baited | TASK-009 | Completata |
| TASK-011 | Terminazione di tutti i percorsi | TASK-008 | Completata |
| TASK-012 | Timeout esplicito delle condizioni | TASK-011 | Completata |
| TASK-013 | Generazione scenario da risultati OSINT | TASK-012 | Completata |
| TASK-014 | Creazione workflow da zero | TASK-013 | Completata |
| TASK-015 | Sostituzione MSW con JSON Server | TASK-014 | Completata |
| TASK-016 | Documentazione composizione applicazione | TASK-015 | Completata |
| TASK-017 | Home page e navigazione applicativa | TASK-016 | Completata |
| TASK-018 | Wordmark Baited nella Home | TASK-017 | Completata |
| TASK-019 | Wordmark workflow e titolo nello step editor | TASK-018 | Completata |
| TASK-020 | Titolo workflow nella libreria blocchi | TASK-019 | Completata |
| TASK-021 | Inventario dipendenze e librerie | TASK-020 | Completata |
| TASK-022 | Selezione ed eliminazione connessioni | TASK-021 | Completata |
| TASK-023 | Fit testo nei bottoni di conferma eliminazione | TASK-022 | Completata |
| TASK-024 | Bottoni conferma eliminazione in colonna | TASK-023 | Completata |
| TASK-025 | Riconnessione endpoint degli edge | TASK-024 | Completata |
| TASK-026 | Navigazione dagli errori di validazione | TASK-025 | Completata |
| TASK-028 | Pagina workflow salvati | TASK-026 | Completata |

## Definizione di completamento

- Il percorso dettagli → canvas → revisione è utilizzabile senza errori bloccanti.
- Sono disponibili i sette tipi di nodo definiti nella specifica.
- Drag-and-drop, collegamento, configurazione, duplicazione ed eliminazione funzionano.
- Cicli, nodi orfani e configurazioni incomplete impediscono il salvataggio con messaggi comprensibili.
- Un salvataggio mock riuscito restituisce e mostra l'identificativo del workflow.
- Build, lint e test automatizzati risultano verdi.
- README e handoff riflettono il comportamento effettivo.
- Ogni percorso raggiungibile termina in un nodo end.
- Le condizioni rappresentano esplicitamente il tempo massimo di attesa.
- La generazione di uno scenario dai risultati OSINT è disponibile come azione tipizzata.
- Con storage vuoto l'editor parte senza nodi o archi e consente di aggiungere anche start ed end dalla libreria.
- Il mock API usa un server HTTP JSON Server interrogabile anche fuori dal browser e conserva il contratto di salvataggio esistente.
- Un hub Markdown developer-first descrive composizione, runtime, blocchi, validazione, API, test ed estensione dell'applicazione.
- Una Home page coerente con il design system è raggiungibile dalla rail e collega esplicitamente l'editor workflow.
