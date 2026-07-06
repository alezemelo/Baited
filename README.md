# Baited Workflow Studio

MVP desktop-first per comporre, validare e salvare workflow di campagne come grafi diretti aciclici. La demo non esegue campagne reali: il salvataggio usa un'API HTTP locale basata su JSON Server.

La guida tecnica completa è disponibile in [docs/README.md](docs/README.md): architettura, bootstrap, stato frontend, blocchi, validazione, API, test ed estensione dell'applicazione.

## Avvio rapido

Requisiti: Node.js 24 o compatibile e npm.

```bash
npm install
npm run dev
```

Il comando avvia insieme Vite e il mock API su `http://127.0.0.1:3001`; Vite espone l'app all'indirizzo indicato nel terminale e inoltra `/api` al mock. La Home è disponibile su `/`, mentre l'editor è su `/workflow`. La Home riepiloga l'ultimo salvataggio valido; nell'editor, con storage vuoto il wizard parte da un draft senza nodi né archi.

## Comandi

```bash
npm run dev          # frontend e mock API insieme
npm run dev:web      # solo frontend Vite
npm run mock:api     # solo API, conserva i dati esistenti
npm run mock:api:reset # solo API, riparte dal database vuoto
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

1. **Home:** accesso al Workflow Studio, capability e riepilogo dell'ultimo workflow salvato.
2. **Dettagli:** nome, descrizione e gruppo target.
3. **Workflow:** composizione del grafo, collegamenti e configurazione degli otto kind di nodo.
4. **Revisione:** riepilogo di nodi, archi e branch, errori strutturati e salvataggio mock.

Il salvataggio è disabilitato finché `validation.isValid` è falso. Lo stato del draft segnala le modifiche non salvate e attiva la conferma nativa quando si tenta di chiudere o ricaricare la pagina.

La validazione richiede uno start unico, almeno un end, assenza di cicli e che ogni nodo raggiungibile possa condurre a un end. Un ramo operativo lasciato senza terminazione viene segnalato con `unterminated_path` e blocca il salvataggio.

Le condizioni espongono `waitForMinutes`, il tempo massimo prima della valutazione dei branch. È distinto da `elapsedTimeMinutes`, che descrive l'attesa propria delle azioni campagna e awareness; il template iniziale usa 2880 minuti, equivalenti a 48 ore.

Il kind `generate_scenario_from_osint` configura `scenarioTemplate`, `channel` ed `evidenceStrategy`. Deve trovarsi a valle di `start_osint_on_targets`; in caso contrario il validator produce `missing_osint_source`. Il workflow di esempio opzionale include la catena OSINT → generazione scenario → campagna email.

## Canvas e accessibilità

- I blocchi della libreria possono essere trascinati oppure aggiunti con click, `Invio` o `Spazio`.
- Start ed End fanno parte della libreria; l'empty state propone anche un workflow di esempio opzionale.
- **Nuovo workflow** cancella il salvataggio locale e torna al draft vuoto, chiedendo conferma in presenza di modifiche non salvate.
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

La risposta `201` contiene `id`, `version`, `status` e `createdAt`:

```json
{
  "id": "workflow-550e8400-e29b-41d4-a716-446655440000",
  "version": 1,
  "status": "saved",
  "createdAt": "2026-07-06T12:00:00.000Z"
}
```

Il record completo è persistito in `mocks/data/db.json`, creato da `mocks/db.seed.json` al primo avvio. La directory runtime è ignorata da Git; `npm run mock:api:reset` la riporta allo stato iniziale. Request e response vengono inoltre conservate sotto la chiave `localStorage` `baited:last-saved-workflow` per ripristinare il draft al refresh.

La checkbox nello step Revisione invia l'header `x-baited-simulate-error: true`, che forza un errore `503` one-shot senza scrivere il record e consente di verificare il retry senza perdere il draft.

Gli endpoint possono essere verificati senza aprire l'app:

```bash
curl http://127.0.0.1:3001/api/health
curl http://127.0.0.1:3001/api/workflows

curl --request POST http://127.0.0.1:3001/api/workflows \
  --header 'content-type: application/json' \
  --data '{"version":1,"metadata":{"name":"Test curl","description":"","category":"","targetGroupId":""},"nodes":[],"edges":[]}'
```

Dopo il `POST`, `GET /api/workflows/:id` restituisce il record persistito completo. Per simulare l'errore da `curl`, aggiungere `--header 'x-baited-simulate-error: true'`.

Per collegare il frontend di sviluppo a un backend diverso, avviare Vite con `VITE_MOCK_API_TARGET=https://api.example.test npm run dev:web`. In produzione, il reverse proxy dell'ambiente deve inoltrare `/api` al backend reale.

## Architettura

```text
src/
├── App.tsx                       # router Home/Workflow e lazy loading
├── pages/                        # schermate raggiungibili
├── components/
│   ├── layout/                   # shell applicativa
│   ├── wizard/                   # Dettagli, Workflow, Revisione
│   └── workflow/                 # canvas, libreria e inspector
└── features/workflow/
    ├── api/                      # serializer, client e storage locale
    ├── validation/               # validazione pura DAG/config
    ├── catalog.ts                # template e vincoli dei nodi
    └── types.ts                  # modello discriminato
mocks/
├── server.cjs                   # adapter HTTP e contratto custom
├── db.seed.json                 # database iniziale versionato
└── data/                        # database runtime ignorati da Git
```

`WorkflowProvider` possiede metadati, nodi, archi, selezione, validazione e dirty state. Canvas, inspector e revisione consumano la stessa fonte di verità; serializer e validator restano funzioni pure testabili.

## Stack

- React 19, TypeScript e Vite
- React Router per route, link e guardia del draft dirty
- Tailwind CSS
- React Flow (`@xyflow/react`)
- JSON Server 0.17.4
- Vitest, Testing Library, Playwright e axe
- Lucide React

L'interfaccia usa il design system scuro Lumina/Baited: Hanken Grotesk per i contenuti, Geist per label e metadati, coral per le azioni primarie e verde per stati e connessioni attive.

## Protocollo agentico

Prima di iniziare una sessione leggere [`agentic/START-SESSION.md`](agentic/START-SESSION.md). Prima di terminarla seguire [`agentic/END-SESSION.md`](agentic/END-SESSION.md). Il contesto operativo corrente si trova in [`agentic/AGENT-HANDOFF.md`](agentic/AGENT-HANDOFF.md).
