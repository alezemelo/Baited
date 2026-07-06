import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  LoaderCircle,
  LocateFixed,
  RotateCcw,
  Save,
  Target,
  Workflow,
} from 'lucide-react'
import { useMemo, useReducer, useState } from 'react'
import {
  createInitialWorkflowSaveState,
  loadLastSavedWorkflow,
  persistLastSavedWorkflow,
  saveWorkflow,
  serializeWorkflow,
  workflowSaveReducer,
} from '../../features/workflow/api/workflows'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import type {
  WorkflowEdge,
} from '../../features/workflow/types'
import type {
  WorkflowValidationIssue,
} from '../../features/workflow/validation/validateWorkflow'

interface WorkflowReviewStepProps {
  onNavigateToIssue?: (target: ValidationIssueNavigationTarget) => void
}

export type ValidationIssueNavigationTarget =
  | { id: string; type: 'edge' }
  | { id: string; type: 'node' }

export function WorkflowReviewStep({
  onNavigateToIssue,
}: WorkflowReviewStepProps) {
  const { draft, markWorkflowSaved, validation } = useWorkflow()
  const [simulateError, setSimulateError] = useState(false)
  const [saveState, dispatchSave] = useReducer(
    workflowSaveReducer,
    loadLastSavedWorkflow(window.localStorage),
    createInitialWorkflowSaveState,
  )
  const branchSummaries = useMemo(
    () => getBranchSummaries(draft.nodes, draft.edges),
    [draft.edges, draft.nodes],
  )
  const branchCount = branchSummaries.reduce(
    (total, summary) => total + summary.branches.length,
    0,
  )
  const isSaving = saveState.status === 'loading'

  const handleSave = async () => {
    if (!validation.isValid || isSaving) {
      return
    }

    const request = serializeWorkflow(draft)
    const shouldSimulateError = simulateError

    setSimulateError(false)
    dispatchSave({ type: 'save_started' })

    try {
      const response = await saveWorkflow(request, {
        simulateError: shouldSimulateError,
      })
      const record = { request, response }

      persistLastSavedWorkflow(record, window.localStorage)
      markWorkflowSaved(request)
      dispatchSave({ type: 'save_succeeded', record })
    } catch (error) {
      dispatchSave({
        type: 'save_failed',
        message:
          error instanceof Error
            ? error.message
            : 'Non è stato possibile salvare il workflow.',
      })
    }
  }

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
            <span className="rounded-lg bg-surface-lowest px-3 py-2 font-label text-xs text-on-surface">
              {branchCount} branch
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

        {branchSummaries.length > 0 ? (
          <article className="mt-4 rounded-2xl border border-white/[0.08] bg-surface-container p-5">
            <div className="flex items-center gap-2 text-secondary">
              <GitBranch aria-hidden="true" className="size-4" />
              <h3 className="text-sm font-semibold text-on-surface">
                Riepilogo branch
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {branchSummaries.map((summary) => (
                <div
                  className="rounded-xl border border-white/[0.07] bg-surface-lowest p-4"
                  key={summary.nodeId}
                >
                  <p className="text-sm font-semibold text-on-surface">
                    {summary.label}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {summary.branches.map((branch) => (
                      <span
                        className="rounded-lg border border-white/[0.08] bg-surface-container px-2.5 py-1.5 font-label text-[10px] text-on-surface-muted"
                        key={branch.id}
                      >
                        <strong className="font-semibold text-on-surface">
                          {branch.label}
                        </strong>{' '}
                        → {branch.targetLabel ?? 'Non collegato'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ) : null}

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
                const navigationTarget = getIssueNavigationTarget(
                  issue,
                  draft.edges,
                )

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

                      {navigationTarget && onNavigateToIssue ? (
                        <button
                          aria-label={`Vai a ${formatNavigationTarget(navigationTarget)}: ${issue.message}`}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 font-label text-[10px] font-medium text-on-surface-muted transition-colors hover:border-secondary/35 hover:text-secondary focus-visible:border-secondary focus-visible:text-secondary focus-visible:outline-none"
                          onClick={() => onNavigateToIssue(navigationTarget)}
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

        <article className="mt-4 rounded-2xl border border-white/[0.08] bg-surface-container p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Save aria-hidden="true" className="size-4" />
                <h3 className="text-sm font-semibold text-on-surface">
                  Salvataggio mock
                </h3>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-6 text-on-surface-muted">
                Invia il payload v1 a <code>POST /api/workflows</code> e conserva
                localmente l’ultimo workflow salvato.
              </p>
            </div>

            <button
              className="flex min-w-40 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!validation.isValid || isSaving}
              onClick={() => void handleSave()}
              type="button"
            >
              {isSaving ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : saveState.status === 'error' ? (
                <RotateCcw aria-hidden="true" className="size-4" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              {isSaving
                ? 'Salvataggio…'
                : saveState.status === 'error'
                  ? 'Riprova'
                  : 'Salva workflow'}
            </button>
          </div>

          {!validation.isValid ? (
            <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm leading-6 text-primary">
              Correggi tutti gli errori di validazione prima di salvare.
            </p>
          ) : null}

          {saveState.status === 'success' ? (
            <div
              aria-live="polite"
              className="mt-4 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-secondary"
                />
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    Workflow salvato
                  </p>
                  <p className="mt-1 break-all font-label text-xs text-on-surface">
                    ID: {saveState.savedWorkflow.response.id}
                  </p>
                  <p className="mt-1 font-label text-[10px] text-on-surface-muted">
                    Versione {saveState.savedWorkflow.response.version} ·{' '}
                    {formatSavedAt(
                      saveState.savedWorkflow.response.createdAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {saveState.status === 'error' ? (
            <div
              aria-live="assertive"
              className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Salvataggio non riuscito
                  </p>
                  <p className="mt-1 text-sm leading-5 text-on-surface-muted">
                    {saveState.message} Il draft è ancora disponibile.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 font-label text-[10px] text-on-surface-muted">
            <input
              checked={simulateError}
              className="size-3.5 accent-primary-container"
              disabled={isSaving}
              onChange={(event) => setSimulateError(event.target.checked)}
              type="checkbox"
            />
            Simula un errore al prossimo tentativo
          </label>
        </article>
      </div>
    </section>
  )
}

function getBranchSummaries(
  nodes: ReturnType<typeof useWorkflow>['draft']['nodes'],
  edges: WorkflowEdge[],
) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]))

  return nodes.flatMap((node) => {
    if (node.data.kind !== 'condition') {
      return []
    }

    const branches = [
      ...node.data.config.rules.map((rule) => ({
        id: rule.id,
        label: rule.label,
      })),
      node.data.config.elseBranch,
    ].map((branch) => {
      const edge = edges.find(
        (candidate) =>
          candidate.source === node.id &&
          candidate.sourceHandle === branch.id,
      )

      return {
        ...branch,
        targetLabel: edge
          ? nodesById.get(edge.target)?.data.label
          : undefined,
      }
    })

    return [{ nodeId: node.id, label: node.data.label, branches }]
  })
}

function formatSavedAt(createdAt: string) {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

function getIssueNavigationTarget(
  issue: WorkflowValidationIssue,
  edges: WorkflowEdge[],
) {
  if (issue.edgeId && edges.some((edge) => edge.id === issue.edgeId)) {
    return { id: issue.edgeId, type: 'edge' } as const
  }

  if (issue.nodeId) {
    return { id: issue.nodeId, type: 'node' } as const
  }

  return null
}

function formatNavigationTarget(target: ValidationIssueNavigationTarget) {
  return target.type === 'edge'
    ? `connessione ${target.id}`
    : `nodo ${target.id}`
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
