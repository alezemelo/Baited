import {
  ChevronLeft,
  ChevronRight,
  Copy,
  GitBranch,
  MousePointer2,
  Settings2,
  Trash2,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import type {
  WorkflowEdge,
  WorkflowNode,
} from '../../features/workflow/types'
import { NodeInspector } from './NodeInspector'

export function WorkflowPropertiesPanel() {
  const {
    duplicateNode,
    nodes,
    removeEdge,
    removeNode,
    selectedEdge,
    selectedNode,
    updateNodeData,
  } = useWorkflow()
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<'node' | 'edge' | null>(null)
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDeleteTarget(null)
  }, [selectedEdge?.id, selectedNode?.id])

  useEffect(() => {
    if (deleteTarget) {
      cancelDeleteButtonRef.current?.focus()
    }
  }, [deleteTarget])

  const duplicateSelection = () => {
    if (selectedNode) {
      duplicateNode(selectedNode.id)
    }
  }

  const confirmDeleteSelection = () => {
    if (!selectedNode) {
      return
    }

    removeNode(selectedNode.id)
    setDeleteTarget(null)
  }

  const confirmDeleteEdge = () => {
    if (!selectedEdge) {
      return
    }

    removeEdge(selectedEdge.id)
    setDeleteTarget(null)
  }

  const requestDeleteSelection = () => {
    if (!selectedNode) {
      return
    }

    setDeleteTarget('node')
  }

  const requestDeleteEdge = () => {
    if (!selectedEdge) {
      return
    }

    setDeleteTarget('edge')
  }

  const closePanel = () => {
    setDeleteTarget(null)
    setIsPanelOpen(false)
  }

  if (!isPanelOpen) {
    return (
      <aside
        aria-label="Proprietà del nodo"
        className="hidden w-14 shrink-0 flex-col items-center border-l border-white/10 bg-surface-low py-4 xl:flex"
      >
        <button
          aria-expanded="false"
          aria-label="Apri pannello proprietà"
          className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-surface-container text-on-surface-muted transition-colors hover:border-secondary/35 hover:text-secondary"
          onClick={() => setIsPanelOpen(true)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <div className="mt-4 flex size-9 items-center justify-center rounded-lg bg-surface-container text-primary">
          <Settings2 aria-hidden="true" className="size-4" />
        </div>
      </aside>
    )
  }

  return (
    <aside
      aria-label="Proprietà del nodo"
      className="stealth-scroll hidden w-64 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-surface-low p-4 xl:flex"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Settings2 aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-on-surface">Proprietà</h2>
        </div>
        <button
          aria-expanded="true"
          aria-label="Chiudi pannello proprietà"
          className="flex size-8 items-center justify-center rounded-lg text-on-surface-muted transition-colors hover:bg-white/5 hover:text-on-surface"
          onClick={closePanel}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      {selectedNode ? (
        <div className="mt-5 space-y-3">
          <NodeInspector
            key={selectedNode.id}
            node={selectedNode}
            onUpdate={(updater) => updateNodeData(selectedNode.id, updater)}
          />

          <div className="rounded-xl border border-white/[0.07] bg-surface-container p-3">
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
              Azioni nodo
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-high px-3 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:bg-surface-highest"
                onClick={duplicateSelection}
                type="button"
              >
                <Copy aria-hidden="true" className="size-3.5" />
                Duplica
              </button>
              <button
                aria-label="Elimina selezione"
                className="flex items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 font-label text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                onClick={requestDeleteSelection}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-3.5" />
                Elimina
              </button>
            </div>
          </div>

          {deleteTarget === 'node' ? (
            <div
              aria-describedby="delete-node-description"
              aria-label="Conferma eliminazione nodo"
              className="rounded-xl border border-primary/30 bg-surface-container p-3"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setDeleteTarget(null)
                }
              }}
              role="alertdialog"
            >
              <p
                className="text-xs leading-5 text-on-surface"
                id="delete-node-description"
              >
                Eliminare{' '}
                <span className="font-semibold text-primary">
                  {selectedNode.data.label}
                </span>{' '}
                e le sue connessioni?
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="flex min-h-9 w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-center font-label text-xs leading-4 text-on-surface-muted transition-colors hover:bg-white/5"
                  onClick={() => setDeleteTarget(null)}
                  ref={cancelDeleteButtonRef}
                  type="button"
                >
                  Annulla
                </button>
                <button
                  className="flex min-h-9 w-full items-center justify-center rounded-lg bg-primary-container px-3 py-2 text-center font-label text-xs font-semibold leading-4 text-on-primary transition-opacity hover:opacity-90"
                  onClick={confirmDeleteSelection}
                  type="button"
                >
                  Elimina nodo
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : selectedEdge ? (
        <div className="mt-5 space-y-3">
          <ConnectionInspector edge={selectedEdge} nodes={nodes} />

          <div className="rounded-xl border border-white/[0.07] bg-surface-container p-3">
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
              Azioni connessione
            </p>
            <button
              aria-label="Elimina connessione"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 font-label text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              onClick={requestDeleteEdge}
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
              Elimina
            </button>
          </div>

          {deleteTarget === 'edge' ? (
            <div
              aria-describedby="delete-edge-description"
              aria-label="Conferma eliminazione connessione"
              className="rounded-xl border border-primary/30 bg-surface-container p-3"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setDeleteTarget(null)
                }
              }}
              role="alertdialog"
            >
              <p
                className="text-xs leading-5 text-on-surface"
                id="delete-edge-description"
              >
                Eliminare questa connessione?
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="flex min-h-9 w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-center font-label text-xs leading-4 text-on-surface-muted transition-colors hover:bg-white/5"
                  onClick={() => setDeleteTarget(null)}
                  ref={cancelDeleteButtonRef}
                  type="button"
                >
                  Annulla
                </button>
                <button
                  className="flex min-h-9 w-full items-center justify-center rounded-lg bg-primary-container px-3 py-2 text-center font-label text-xs font-semibold leading-4 text-on-primary transition-opacity hover:opacity-90"
                  onClick={confirmDeleteEdge}
                  type="button"
                >
                  Elimina connessione
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-5 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-container text-on-surface-muted">
            <MousePointer2 aria-hidden="true" className="size-4" />
          </span>
          <p className="mt-3 text-sm font-semibold text-on-surface">
            Seleziona un elemento
          </p>
          <p className="mt-1 text-xs leading-5 text-on-surface-muted">
            Seleziona un blocco o una connessione sul canvas per configurarlo o
            eliminarlo.
          </p>
        </div>
      )}
    </aside>
  )
}

function ConnectionInspector({
  edge,
  nodes,
}: {
  edge: WorkflowEdge
  nodes: WorkflowNode[]
}) {
  const sourceNode = nodes.find((node) => node.id === edge.source)
  const targetNode = nodes.find((node) => node.id === edge.target)
  const branchType = edge.data?.branchType

  return (
    <div className="rounded-xl border border-white/[0.07] bg-surface-container p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-secondary">
            Connessione
          </p>
          <h3 className="mt-1 text-sm font-semibold text-on-surface">
            {sourceNode?.data.label ?? edge.source} →{' '}
            {targetNode?.data.label ?? edge.target}
          </h3>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-high text-secondary">
          <GitBranch aria-hidden="true" className="size-4" />
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-on-surface-muted">
        Trascina un'estremità della connessione sul canvas per ricollegarla a
        un altro nodo valido.
      </p>

      <dl className="mt-4 space-y-3 border-t border-white/[0.07] pt-4">
        <ConnectionDetail
          label="Origine"
          value={sourceNode?.data.label ?? edge.source}
        />
        <ConnectionDetail
          label="Destinazione"
          value={targetNode?.data.label ?? edge.target}
        />
        {edge.label ? (
          <ConnectionDetail label="Branch" value={String(edge.label)} />
        ) : null}
        {branchType ? (
          <ConnectionDetail
            label="Tipo branch"
            value={branchType === 'else' ? 'Else' : 'Regola'}
          />
        ) : null}
      </dl>
    </div>
  )
}

function ConnectionDetail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-on-surface">
        {value}
      </dd>
    </div>
  )
}
