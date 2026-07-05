# TASK-008 — Test, accessibilità e rifinitura

- Stato: `planned`
- Dipendenze: TASK-007

## Obiettivo

Consolidare la demo con copertura automatizzata, feedback coerenti, documentazione e verifica completa del percorso utente.

## File coinvolti

- `src/**/*.test.tsx`
- `e2e/workflow.spec.ts`
- `README.md`
- componenti applicativi interessati dai risultati di audit

## Passi di implementazione

1. Configurare Vitest e Testing Library per unità e componenti.
2. Configurare Playwright per il percorso dettagli → costruzione → revisione → salvataggio.
3. Coprire validazione, serializzazione, configurazione nodo ed errore API.
4. Verificare focus, label, contrasto, tastiera e annunci di errore.
5. Aggiungere conferma per modifiche non salvate e stati vuoti coerenti.
6. Aggiornare README con setup, comandi, architettura e payload.
7. Eseguire la checklist finale del piano.

## Criteri di accettazione

- Test unitari, componenti ed end-to-end sono verdi.
- Il percorso principale è completabile da tastiera, salvo le interazioni canvas che richiedono alternativa documentata.
- Errori e operazioni distruttive hanno feedback comprensibile.
- README e documenti agentici corrispondono al comportamento reale.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- suite unit/component definita nel package
- suite end-to-end definita nel package

## Note per l'handoff

Riportare copertura ottenuta, eventuali eccezioni di accessibilità e istruzioni esatte per riprodurre la demo.
