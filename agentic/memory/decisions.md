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

## D-010 — Validazione workflow come logica pura testabile

- Data: 2026-07-05
- Stato: accettata
- Decisione: mantenere la validazione strutturale del workflow in moduli puri sotto `src/features/workflow/validation/`, senza dipendenze React.
- Motivo: il canvas, la revisione e il salvataggio mock devono consumare gli stessi errori strutturati senza duplicare regole.
- Test: usare `node --test` dopo compilazione TypeScript dedicata in `.tmp-tests`, evitando nuove dipendenze per i test unitari del dominio.

## D-011 — API mock MSW e record locale dell'ultimo salvataggio

- Data: 2026-07-05
- Stato: accettata
- Decisione: simulare `POST /api/workflows` con MSW e mantenere serializer, client, persistenza e macchina a stati in `src/features/workflow/api/`.
- Persistenza: salvare request e response sotto la chiave `baited:last-saved-workflow`, così il provider può ricostruire il grafo dopo un refresh.
- Test errore: l'header `x-baited-simulate-error: true` forza una risposta `503` una sola volta dall'interfaccia di revisione; il tentativo successivo può riuscire senza perdere il draft.

## D-012 — Piramide test e alternativa tastiera al drag

- Data: 2026-07-05
- Stato: accettata
- Decisione: mantenere test di dominio con `node:test`, test componenti con Vitest/Testing Library e percorso browser con Playwright; usare axe nel test E2E per l'audit automatico di Dettagli e Revisione.
- Accessibilità: ogni blocco della libreria è un pulsante che aggiunge il nodo con click, Invio o Spazio, mantenendo il drag-and-drop per il posizionamento libero.
- Eccezione documentata: pan, zoom e creazione visuale degli archi restano interazioni specifiche di React Flow che richiedono un dispositivo di puntamento nell'MVP.

## D-013 — Terminazione verificata con reachability inversa

- Data: 2026-07-05
- Stato: accettata
- Decisione: un workflow è salvabile solo se ogni nodo raggiungibile dallo start può raggiungere almeno un `workflow_end`.
- Algoritmo: costruire l'adiacenza inversa e visitare il grafo a partire da tutti gli end; l'intersezione negativa con i nodi raggiungibili dallo start produce gli errori `unterminated_path` in O(V+E).
- Feedback: associare l'errore a ciascun nodo del percorso non terminato con il messaggio `<label> non conduce ad alcun nodo end.`.

## D-014 — Timeout condition distinto dall'attesa delle azioni

- Data: 2026-07-06
- Stato: accettata
- Decisione: rappresentare il tempo massimo prima della valutazione dei branch con `ConditionConfig.waitForMinutes`, espresso in minuti e valido se finito e non negativo.
- Default: 2880 minuti, equivalenti alle 48 ore già descritte dal template iniziale.
- Semantica: `waitForMinutes` appartiene alla condition; `elapsedTimeMinutes` resta l'attesa propria delle azioni campagna e awareness.

## D-015 — Generazione scenario come azione downstream da OSINT

- Data: 2026-07-06
- Stato: accettata
- Decisione: modellare la generazione con il kind `generate_scenario_from_osint` e config `scenarioTemplate`, `channel`, `evidenceStrategy`.
- Vincolo: il nodo deve essere raggiungibile da almeno un `start_osint_on_targets`; in caso contrario esporre `missing_osint_source` con `nodeId`.
- Algoritmo: visita forward multi-source da tutti i nodi OSINT, complessità O(V+E).
- Demo: inserire OSINT → generazione scenario → campagna email nel workflow iniziale.

## D-016 — Draft vuoto distinto dall'esempio

- Data: 2026-07-06
- Stato: accettata
- Decisione: usare `emptyWorkflowDraft` come fallback quando lo storage è vuoto e mantenere `exampleWorkflowDraft` come contenuto opzionale caricato dall'empty state.
- Libreria: rendere disponibili anche `workflow_start` e `workflow_end`, così l'intero grafo può essere costruito da zero.
- Reset: “Nuovo workflow” genera un nuovo ID, pulisce `baited:last-saved-workflow`, marca il draft vuoto come allineato e rimonta il wizard su Dettagli; richiede conferma solo in presenza di modifiche non salvate.
