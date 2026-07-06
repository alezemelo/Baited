# End session

Seguire questa procedura prima di consegnare il lavoro o interrompere una sessione.

## 1. Verificare il lavoro

1. Riesaminare diff e file non tracciati.
2. Eseguire tutte le verifiche elencate nella task.
3. Per modifiche applicative eseguire almeno:

```bash
npm run build
npm run lint
```

4. Registrare comandi, esito e limitazioni. Un test non eseguito non può essere dichiarato superato.
5. Riesaminare l'impatto documentale delle modifiche e aggiornare nello stesso turno le guide pertinenti sotto `docs/`.
6. Se nessuna guida richiede modifiche, registrare esplicitamente `Impatto documentazione: nessuno` nella task o nell'handoff; non lasciare divergenze note tra codice e documentazione.

## 2. Determinare lo stato

### Task incompleta

- Conservare il file in `tasks/`.
- Lasciare lo stato `in_progress` oppure `blocked`.
- Aggiornare lavoro svolto, verifiche, file modificati e prossimi passi esatti.
- Se bloccata, specificare causa e condizione necessaria per riprendere.
- Indicare quali guide sono già state aggiornate e quali aggiornamenti documentali restano da completare.

### Task completata

Procedere in questo ordine:

1. Verificare tutti i criteri di accettazione.
2. Verificare che indice e guide sotto `docs/` riflettano comportamento, architettura, blocchi, API e test risultanti dalla sessione.
3. Aggiungere a `memory/completed-tasks.md` una voce con ID, data, risultato, file, test, decisioni e follow-up.
4. Aggiungere a `memory/decisions.md` le sole nuove decisioni vincolanti.
5. Marcare la task come completata nel piano.
6. Aggiornare `AGENT-HANDOFF.md`, indicando la prossima task eseguibile e l'impatto documentale verificato.
7. Eliminare il file Markdown della task da `tasks/`.
8. Verificare che nessun link punti ancora al file eliminato.

## 3. Chiudere l'handoff

`AGENT-HANDOFF.md` deve sempre riportare:

- obiettivo e piano attivo;
- stato sintetico verificabile;
- task attiva, oppure `Nessuna`;
- risultato dell'ultima sessione;
- verifiche realmente eseguite;
- rischi o blocchi;
- impatto documentale della sessione e guide aggiornate, oppure conferma che non servono aggiornamenti;
- prossimo passo unico e concreto.

L'handoff non deve contenere cronologia estesa: quella appartiene alla memoria.

## Formato di archiviazione

```md
## TASK-NNN — Titolo

- Completata: YYYY-MM-DD
- Risultato: ...
- File principali: ...
- Verifiche: `comando` — esito
- Decisioni: riferimenti oppure Nessuna
- Follow-up: riferimenti oppure Nessuno
```
