import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  LocateFixed,
  Target,
  Workflow,
} from 'lucide-react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import type {
  WorkflowEdge,
} from '../../features/workflow/types'
import type {
  WorkflowValidationIssue,
} from '../../features/workflow/validation/validateWorkflow'

interface WorkflowReviewStepProps {
  onFocusNode?: (nodeId: string) => void
}

export function WorkflowReviewStep({
  onFocusNode,
}: WorkflowReviewStepProps) {
  const { draft, validation } = useWorkflow()

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
            <span
              className={`rounded-lg px-3 py-2 font-label text-xs font-medium ${
                validation.isValid
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {validation.isValid
                ? 'Workflow valido'
                : `${validation.issues.length} errori strutturali`}
            </span>
          </div>
        </article>

        <article className="mt-4 rounded-2xl border border-white/[0.08] bg-surface-container p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle2 aria-hidden="true" className="size-4 text-secondary" />
              ) : (
                <AlertTriangle aria-hidden="true" className="size-4 text-primary" />
              )}
              <h3 className="text-sm font-semibold text-on-surface">
                Validazione DAG
              </h3>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-wide ${
                validation.isValid
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {validation.isValid ? 'OK' : 'Errori'}
            </span>
          </div>

          {validation.isValid ? (
            <p className="mt-4 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm leading-6 text-secondary">
              Nessun problema trovato: start/end, raggiungibilità, branch e
              campi obbligatori sono coerenti.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {validation.issues.map((issue, index) => {
                const focusNodeId = getIssueFocusNodeId(issue, draft.edges)

                return (
                  <div
                    className="rounded-xl border border-primary/20 bg-surface-lowest p-3"
                    key={`${issue.code}-${issue.nodeId ?? issue.edgeId ?? index}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-label text-[9px] font-semibold uppercase tracking-wide text-primary">
                            {issue.code}
                          </span>
                          <span className="font-label text-[10px] text-on-surface-muted">
                            {formatIssueReference(issue)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-on-surface">
                          {issue.message}
                        </p>
                      </div>

                      {focusNodeId && onFocusNode ? (
                        <button
                          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 font-label text-[10px] font-medium text-on-surface-muted transition-colors hover:border-secondary/35 hover:text-secondary"
                          onClick={() => onFocusNode(focusNodeId)}
                          type="button"
                        >
                          <LocateFixed aria-hidden="true" className="size-3" />
                          Vai
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

function getIssueFocusNodeId(
  issue: WorkflowValidationIssue,
  edges: WorkflowEdge[],
) {
  if (issue.nodeId) {
    return issue.nodeId
  }

  const edge = edges.find((candidate) => candidate.id === issue.edgeId)

  return edge?.source ?? edge?.target ?? null
}

function formatIssueReference(issue: WorkflowValidationIssue) {
  const references = [
    issue.nodeId ? `Nodo ${issue.nodeId}` : null,
    issue.edgeId ? `Arco ${issue.edgeId}` : null,
    issue.branchId ? `Branch ${issue.branchId}` : null,
    issue.field ? `Campo ${issue.field}` : null,
  ].filter(Boolean)

  return references.length > 0 ? references.join(' · ') : 'Workflow'
}
