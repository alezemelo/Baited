import { MousePointer2, Settings2 } from 'lucide-react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'

export function WorkflowPropertiesPanel() {
  const { selectedNode } = useWorkflow()

  return (
    <aside
      aria-label="Proprietà del nodo"
      className="hidden w-64 shrink-0 flex-col border-l border-white/10 bg-surface-low p-4 xl:flex"
    >
      <div className="flex items-center gap-2">
        <Settings2 aria-hidden="true" className="size-4 text-primary" />
        <h2 className="text-sm font-semibold text-on-surface">Proprietà</h2>
      </div>

      {selectedNode ? (
        <div className="mt-5 rounded-xl border border-secondary/25 bg-surface-container p-4">
          <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-secondary">
            Nodo selezionato
          </p>
          <h3 className="mt-2 text-sm font-semibold text-on-surface">
            {selectedNode.data.label}
          </h3>
          <p className="mt-1 font-label text-[10px] text-on-surface-muted">
            {selectedNode.data.kind}
          </p>
          <dl className="mt-4 space-y-3 border-t border-white/[0.07] pt-4">
            <div>
              <dt className="font-label text-[9px] uppercase tracking-wide text-on-surface-muted">
                Stato
              </dt>
              <dd className="mt-1 text-xs text-on-surface">
                {selectedNode.data.status ?? 'Non impostato'}
              </dd>
            </div>
            <div>
              <dt className="font-label text-[9px] uppercase tracking-wide text-on-surface-muted">
                ID
              </dt>
              <dd className="mt-1 break-all font-label text-[10px] text-on-surface">
                {selectedNode.id}
              </dd>
            </div>
          </dl>
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
            La configurazione dettagliata sarà disponibile nel prossimo step di
            sviluppo.
          </p>
        </div>
      )}
    </aside>
  )
}
