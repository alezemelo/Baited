import {
  ChevronLeft,
  ChevronRight,
  Copy,
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
import { NodeInspector } from './NodeInspector'

export function WorkflowPropertiesPanel() {
  const {
    duplicateNode,
    removeNode,
    selectedNode,
    updateNodeData,
  } = useWorkflow()
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsConfirmingDelete(false)
  }, [selectedNode?.id])

  useEffect(() => {
    if (isConfirmingDelete) {
      cancelDeleteButtonRef.current?.focus()
    }
  }, [isConfirmingDelete])

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
    setIsConfirmingDelete(false)
  }

  const requestDeleteSelection = () => {
    if (!selectedNode) {
      return
    }

    setIsConfirmingDelete(true)
  }

  const closePanel = () => {
    setIsConfirmingDelete(false)
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

          {isConfirmingDelete ? (
            <div
              aria-describedby="delete-node-description"
              aria-label="Conferma eliminazione nodo"
              className="rounded-xl border border-primary/30 bg-surface-container p-3"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsConfirmingDelete(false)
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
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="rounded-lg border border-white/10 px-3 py-2 font-label text-xs text-on-surface-muted transition-colors hover:bg-white/5"
                  onClick={() => setIsConfirmingDelete(false)}
                  ref={cancelDeleteButtonRef}
                  type="button"
                >
                  Annulla
                </button>
                <button
                  className="rounded-lg bg-primary-container px-3 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
                  onClick={confirmDeleteSelection}
                  type="button"
                >
                  Elimina nodo
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
            Seleziona un nodo
          </p>
          <p className="mt-1 text-xs leading-5 text-on-surface-muted">
            Seleziona un blocco sul canvas per configurarlo, duplicarlo o
            eliminarlo.
          </p>
        </div>
      )}
    </aside>
  )
}
