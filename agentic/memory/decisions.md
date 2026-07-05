# Decisioni di progetto

## D-001 — SPA basata su Vite

- Data: 2026-07-05
- Stato: accettata
- Decisione: usare Vite, React e TypeScript; Next.js è escluso.
- Motivo: l'MVP è un editor client-side e non richiede rendering server o API route reali.

## D-002 — Styling con Tailwind CSS

- Data: 2026-07-05
- Stato: accettata
- Decisione: usare Tailwind CSS tramite plugin ufficiale Vite e mantenere nel CSS globale solo reset e personalizzazioni necessarie a librerie esterne.

## D-003 — Canvas con React Flow

- Data: 2026-07-05
- Stato: accettata
- Decisione: usare il pacchetto `@xyflow/react` per nodi, archi, controlli, minimappa e viewport.

## D-004 — Protocollo agentico solo Markdown

- Data: 2026-07-05
- Stato: accettata
- Decisione: gestire apertura sessione, chiusura, handoff e memoria senza script automatici.
- Conseguenza: ogni agente deve seguire manualmente e nell'ordine le checklist documentate.

## D-005 — Memoria su due livelli

- Data: 2026-07-05
- Stato: accettata
- Decisione: conservare il contesto operativo corrente in `AGENT-HANDOFF.md` e la cronologia permanente nei registri append-only sotto `memory/`.

## D-006 — Convenzione React per pagine e componenti

- Data: 2026-07-05
- Stato: accettata
- Decisione: mantenere `App.tsx` come entrypoint sottile, collocare ogni schermata raggiungibile in `src/pages/` e ogni componente riutilizzabile in `src/components/`.
- Convenzione: le pagine usano il suffisso `Page`; i componenti sono organizzati per area, mentre `src/features/` contiene soltanto logica non visuale di dominio.

## D-007 — Design system Lumina/Baited

- Data: 2026-07-05
- Stato: accettata
- Decisione: adottare una UI desktop-first scura con superfici Lumina, coral per CTA/trigger e verde per stato, selezione e connessioni.
- Tipografia e icone: Hanken Grotesk e Geist via Google Fonts con fallback di sistema; icone tramite `lucide-react`.
- Struttura: top bar da 56 px, rail da 64 px, libreria da 280 px e canvas React Flow fluido; chat e log non fanno parte di questa iterazione.

## D-008 — Modello workflow discriminato e provider condiviso

- Data: 2026-07-05
- Stato: accettata
- Decisione: rappresentare ogni blocco con una union discriminata sul campo `kind` e configurazioni specifiche per le sette azioni di dominio.
- Catalogo: template, valori iniziali e vincoli di connessione sono centralizzati in `src/features/workflow/catalog.ts`; il draft iniziale viene creato dalle stesse factory.
- Stato: `WorkflowProvider` possiede metadati, nodi, archi e selezione ed espone operazioni esplicite; canvas e pagina consumano il context senza stato React Flow locale.

## D-009 — Wizard locale sopra il draft condiviso

- Data: 2026-07-05
- Stato: accettata
- Decisione: gestire localmente lo step corrente e la massima tappa visitata, mantenendo metadati e grafo nel `WorkflowProvider`.
- Navigazione: gli step futuri restano disabilitati finché non vengono raggiunti; quelli visitati sono navigabili da tastiera tramite label univoche.
- Validazione: il passaggio Dettagli → Workflow richiede un nome non vuoto, mostra errore inline e riporta il focus al campo.
