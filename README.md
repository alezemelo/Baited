# Baited Workflow Studio

MVP desktop-first per comporre, validare e salvare workflow di campagne come grafi diretti aciclici. La demo non esegue campagne reali: il salvataggio è intercettato in browser da MSW.

## Avvio rapido

Requisiti: Node.js 24 o compatibile e npm.

```bash
npm install
npm run dev
```

Vite espone l'app all'indirizzo indicato nel terminale. L'ultimo workflow salvato viene recuperato automaticamente al refresh dallo storage del browser.

## Comandi

```bash
npm run dev          # server di sviluppo
npm run build        # typecheck e build di produzione
npm run lint         # lint con oxlint
npm run test         # test dominio + componenti
npm run test:domain  # test Node del validator e dell'API
npm run test:unit    # test Vitest + Testing Library
npm run test:e2e     # percorso Chromium con Playwright
```

Al primo uso di Playwright può essere necessario installare Chromium:

```bash
npx playwright install chromium
```

## Percorso utente

1. **Dettagli:** nome, descrizione e gruppo target.
2. **Workflow:** composizione del grafo, collegamenti e configurazione dei sette tipi di nodo.
3. **Revisione:** riepilogo di nodi, archi e branch, errori strutturati e salvataggio mock.

Il salvataggio è disabilitato finché `validation.isValid` è falso. Lo stato del draft segnala le modifiche non salvate e attiva la conferma nativa quando si tenta di chiudere o ricaricare la pagina.

## Canvas e accessibilità

- I blocchi della libreria possono essere trascinati oppure aggiunti con click, `Invio` o `Spazio`.
- Form, progress del wizard, errori e conferme distruttive espongono label, focus e annunci accessibili.
- L'eliminazione di ogni nodo richiede conferma; `Esc` annulla il dialogo.
- Zoom, pan e creazione visuale dei collegamenti restano interazioni specifiche del canvas React Flow e richiedono un dispositivo di puntamento. Configurazione, revisione e salvataggio sono utilizzabili da tastiera.
- La suite E2E esegue axe sulle schermate Dettagli e Revisione per label, ruoli e contrasto rilevabile automaticamente.

## Contratto API mock

`POST /api/workflows` riceve un payload privo dello stato UI temporaneo di React Flow:

```json
{
  "version": 1,
  "metadata": {
    "name": "Campagna Q3 — Sicurezza email",
    "description": "Simulazione multicanale",
    "category": "Simulazione phishing",
    "targetGroupId": "target-group-q3"
  },
  "nodes": [],
  "edges": []
}
```

La risposta contiene `id`, `version`, `status` e `createdAt`. Request e response vengono conservate sotto la chiave `localStorage` `baited:last-saved-workflow`. La checkbox nello step Revisione invia l'header `x-baited-simulate-error: true`, che forza un errore `503` one-shot per verificare il retry senza perdere il draft.

Per disabilitare il worker mock e collegare un backend reale, avviare o compilare con `VITE_DISABLE_WORKFLOW_MOCKS=true`.

## Architettura

```text
src/
├── App.tsx                       # entrypoint sottile
├── pages/                        # schermate raggiungibili
├── components/
│   ├── layout/                   # shell applicativa
│   ├── wizard/                   # Dettagli, Workflow, Revisione
│   └── workflow/                 # canvas, libreria e inspector
└── features/workflow/
    ├── api/                      # serializer, client, MSW, storage
    ├── validation/               # validazione pura DAG/config
    ├── catalog.ts                # template e vincoli dei nodi
    └── types.ts                  # modello discriminato
```

`WorkflowProvider` possiede metadati, nodi, archi, selezione, validazione e dirty state. Canvas, inspector e revisione consumano la stessa fonte di verità; serializer e validator restano funzioni pure testabili.

## Stack

- React 19, TypeScript e Vite
- Tailwind CSS
- React Flow (`@xyflow/react`)
- MSW
- Vitest, Testing Library, Playwright e axe
- Lucide React

L'interfaccia usa il design system scuro Lumina/Baited: Hanken Grotesk per i contenuti, Geist per label e metadati, coral per le azioni primarie e verde per stati e connessioni attive.

## Protocollo agentico

Prima di iniziare una sessione leggere [`agentic/START-SESSION.md`](agentic/START-SESSION.md). Prima di terminarla seguire [`agentic/END-SESSION.md`](agentic/END-SESSION.md). Il contesto operativo corrente si trova in [`agentic/AGENT-HANDOFF.md`](agentic/AGENT-HANDOFF.md).
