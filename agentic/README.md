# Sistema agentico del progetto

Questa cartella è la fonte di verità per pianificazione, task attive, decisioni e passaggio di contesto tra sessioni. Il sistema è volutamente composto soltanto da file Markdown: ogni aggiornamento è leggibile, revisionabile tramite Git e indipendente da strumenti proprietari.

## Documenti principali

- [`START-SESSION.md`](START-SESSION.md): procedura obbligatoria di apertura.
- [`END-SESSION.md`](END-SESSION.md): procedura obbligatoria di chiusura.
- [`AGENT-HANDOFF.md`](AGENT-HANDOFF.md): stato operativo corrente, breve e riscrivibile.
- [`plans/workflow-editor-mvp.md`](plans/workflow-editor-mvp.md): obiettivo, ordine e criteri globali.
- [`tasks/`](tasks/): una scheda per ogni task non completata.
- [`memory/completed-tasks.md`](memory/completed-tasks.md): registro append-only dei risultati completati.
- [`memory/decisions.md`](memory/decisions.md): decisioni architetturali consolidate.

## Stati ammessi

Una task può essere `planned`, `in_progress` oppure `blocked`. Lo stato `completed` non permane in `tasks/`: quando tutti i criteri sono verificati, il risultato viene archiviato in memoria e il file della task viene eliminato.

## Ciclo di vita di una task

1. Scegliere la prima task non bloccata le cui dipendenze sono completate.
2. Impostarla `in_progress` e registrarla nell'handoff.
3. Implementare soltanto lo scope descritto nella scheda.
4. Aggiornare scheda e handoff se il lavoro resta parziale o bloccato.
5. Se completata, eseguire le verifiche richieste.
6. Aggiungere una voce a `memory/completed-tasks.md` e le eventuali decisioni a `memory/decisions.md`.
7. Aggiornare il piano e l'handoff.
8. Eliminare il file della task completata.

## Regole di coerenza

- Non eliminare mai una task prima di averne archiviato risultato e verifiche.
- Non dichiarare completata una task con criteri di accettazione non soddisfatti.
- Non riscrivere o rimuovere voci da `completed-tasks.md`; aggiungere correzioni come nuove note datate.
- Tenere `AGENT-HANDOFF.md` sintetico: deve descrivere il presente, non duplicare la cronologia.
- Registrare in `decisions.md` solo scelte che vincolano lavoro futuro.
- Aggiornare i link se un documento viene rinominato.

## Convenzione degli identificativi

Le task usano identificativi sequenziali `TASK-NNN` e file `TASK-NNN-descrizione.md`. L'identificativo non viene mai riutilizzato, anche dopo l'eliminazione del file.
