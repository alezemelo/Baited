# Start session

Seguire questa procedura prima di modificare codice o documentazione di progetto.

## 1. Ricostruire il contesto

1. Leggere integralmente [`AGENT-HANDOFF.md`](AGENT-HANDOFF.md).
2. Leggere il piano attivo indicato nell'handoff.
3. Leggere [`memory/decisions.md`](memory/decisions.md).
4. Consultare `memory/completed-tasks.md` solo per dipendenze o risultati citati dal piano/handoff.
5. Elencare le schede presenti in `tasks/` e individuare la prima task non bloccata con dipendenze soddisfatte.
6. Leggere integralmente la scheda selezionata.

## 2. Verificare lo stato reale

1. Controllare `git status` senza sovrascrivere modifiche preesistenti.
2. Ispezionare i file dichiarati dalla task e confermare che la scheda rispecchi il codice.
3. Eseguire i test o controlli di baseline pertinenti. Per modifiche trasversali usare almeno:

```bash
npm run build
npm run lint
```

4. Se codice, handoff e task divergono, correggere prima il contesto documentale o registrare il problema.

## 3. Aprire la sessione

1. Impostare la task su `in_progress`.
2. Aggiornare nell'handoff `Task attiva`, `Stato sintetico` e `Prossimo passo`.
3. Annotare nella task eventuali fatti scoperti che cambiano i passi, senza ampliarne arbitrariamente lo scope.
4. Iniziare l'implementazione soltanto quando obiettivo, dipendenze e criteri sono chiari.

## Casi particolari

- Se la task è bloccata, indicare causa, prove effettuate e condizione di sblocco; poi scegliere la successiva task indipendente.
- Se non esistono task eseguibili, non inventarne una: aggiornare l'handoff e richiedere una decisione.
- Se emerge nuovo lavoro necessario, aggiungere una nuova scheda con il prossimo ID libero e collegarla al piano prima di eseguirla.
