import { ArrowRight, GitBranch, Target, Workflow } from 'lucide-react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'

export function WorkflowReviewStep() {
  const { draft } = useWorkflow()

  return (
    <section
      aria-labelledby="workflow-review-title"
      className="stealth-scroll min-h-0 flex-1 overflow-y-auto bg-surface-lowest px-6 py-8"
    >
      <div className="mx-auto max-w-4xl">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
          Controllo finale
        </p>
        <h2
          className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-on-surface"
          id="workflow-review-title"
        >
          Revisione workflow
        </h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-muted">
          Verifica i dati principali prima di procedere al salvataggio mock.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/[0.08] bg-surface-container p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-primary">
              <Workflow aria-hidden="true" className="size-4" />
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.12em]">
                Workflow
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-on-surface">
              {draft.metadata.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-muted">
              {draft.metadata.description || 'Nessuna descrizione disponibile.'}
            </p>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-surface-container p-5">
            <div className="flex items-center gap-2 text-secondary">
              <Target aria-hidden="true" className="size-4" />
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.12em]">
                Target
              </span>
            </div>
            <p className="mt-4 break-words text-sm font-semibold text-on-surface">
              {draft.metadata.targetGroupId || 'Non selezionato'}
            </p>
          </article>
        </div>

        <article className="mt-4 rounded-2xl border border-white/[0.08] bg-surface-container p-5">
          <div className="flex items-center gap-2 text-secondary">
            <GitBranch aria-hidden="true" className="size-4" />
            <h3 className="text-sm font-semibold text-on-surface">
              Struttura del grafo
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-surface-lowest px-3 py-2 font-label text-xs text-on-surface">
              {draft.nodes.length} nodi
            </span>
            <ArrowRight aria-hidden="true" className="size-4 text-on-surface-muted" />
            <span className="rounded-lg bg-surface-lowest px-3 py-2 font-label text-xs text-on-surface">
              {draft.edges.length} connessioni
            </span>
            <ArrowRight aria-hidden="true" className="size-4 text-on-surface-muted" />
            <span className="rounded-lg bg-secondary/10 px-3 py-2 font-label text-xs font-medium text-secondary">
              Bozza pronta per la validazione
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}
