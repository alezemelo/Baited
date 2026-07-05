# Baited Workflow Studio

Prototipo di un editor visuale per costruire workflow di campagne tramite grafi diretti aciclici.

## Comandi

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Stack

- React e TypeScript
- Vite
- Tailwind CSS
- React Flow (`@xyflow/react`)
- Lucide React

L'interfaccia usa il design system scuro Lumina/Baited: Hanken Grotesk per i contenuti, Geist per label e metadati, coral per le azioni primarie e verde per stati e connessioni attive.

## Struttura React

```text
src/
├── App.tsx        # entrypoint applicativo
├── pages/         # schermate raggiungibili
├── components/    # componenti riutilizzabili
└── features/      # logica di dominio non visuale
```

Le pagine usano il suffisso `Page`; i componenti sono raggruppati per area sotto `components/`. `App.tsx` assembla l'entrypoint e non contiene logica di dominio.

## Modello workflow

I tipi discriminati, il catalogo dei blocchi e il draft iniziale risiedono in `src/features/workflow/`. `WorkflowProvider` espone metadati, nodi, archi, selezione e operazioni di modifica ai componenti dell'editor.

## Wizard

La creazione usa tre step senza routing: `Dettagli`, `Workflow` e `Revisione`. I metadati e il grafo restano nel provider durante la navigazione; il passaggio all'editor richiede un nome valido.

## Lavorare sul progetto

Prima di iniziare una sessione leggere [`agentic/START-SESSION.md`](agentic/START-SESSION.md). Prima di terminarla seguire [`agentic/END-SESSION.md`](agentic/END-SESSION.md).

Il contesto operativo corrente si trova in [`agentic/AGENT-HANDOFF.md`](agentic/AGENT-HANDOFF.md).
