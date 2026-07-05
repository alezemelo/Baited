# TASK-003 — Shell del wizard

- Stato: `planned`
- Dipendenze: TASK-002

## Obiettivo

Creare il percorso a tre step e il layout applicativo che ospiterà editor, proprietà e revisione.

## File coinvolti

- `src/pages/WorkflowStudioPage.tsx`
- `src/components/wizard/WorkflowWizard.tsx`
- `src/components/wizard/WorkflowDetailsStep.tsx`
- `src/components/wizard/WizardProgress.tsx`

## Passi di implementazione

1. Implementare gli step `Dettagli`, `Workflow` e `Revisione` senza routing URL.
2. Collegare nome, descrizione e target allo stato della TASK-002.
3. Impedire il passaggio allo step Workflow se il nome è vuoto.
4. Preparare nello step Workflow le aree sidebar, canvas e proprietà.
5. Rendere navigabili step e controlli tramite tastiera.

## Criteri di accettazione

- Lo step corrente è sempre riconoscibile.
- Avanti e indietro conservano i dati inseriti.
- Il nome obbligatorio mostra errore inline e focus coerente.
- Il layout resta utilizzabile da 1024 px in su.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- Percorso manuale avanti/indietro con controllo persistenza dati.

## Note per l'handoff

Registrare eventuali scelte di navigazione o accessibilità che vincolino gli step successivi.
