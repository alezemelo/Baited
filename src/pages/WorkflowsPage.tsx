import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Database,
  GitBranch,
  LoaderCircle,
  Plus,
  RefreshCw,
  Target,
  Trash2,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SideNavigation } from '../components/layout/SideNavigation'
import {
  clearLastSavedWorkflow,
  deleteSavedWorkflow,
  listSavedWorkflows,
  loadLastSavedWorkflow,
  type SavedWorkflowResource,
} from '../features/workflow/api/workflows'

type WorkflowsLoadState =
  | { status: 'loading'; workflows: SavedWorkflowResource[] }
  | { status: 'success'; workflows: SavedWorkflowResource[] }
  | { message: string; status: 'error'; workflows: SavedWorkflowResource[] }

export function WorkflowsPage() {
  const [loadState, setLoadState] = useState<WorkflowsLoadState>({
    status: 'loading',
    workflows: [],
  })
  const [confirmDeleteWorkflowId, setConfirmDeleteWorkflowId] =
    useState<string | null>(null)
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(
    null,
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadWorkflows = () => {
    const controller = new AbortController()

    setLoadState((currentState) => ({
      status: 'loading',
      workflows: currentState.workflows,
    }))
    void listSavedWorkflows({ signal: controller.signal })
      .then((workflows) => {
        setLoadState({ status: 'success', workflows })
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setLoadState((currentState) => ({
          message:
            error instanceof Error
              ? error.message
              : 'Non è stato possibile leggere i workflow salvati.',
          status: 'error',
          workflows: currentState.workflows,
        }))
      })

    return () => controller.abort()
  }

  useEffect(loadWorkflows, [])

  const workflows = loadState.workflows
  const totalNodes = workflows.reduce(
    (total, workflow) => total + workflow.nodes.length,
    0,
  )
  const totalEdges = workflows.reduce(
    (total, workflow) => total + workflow.edges.length,
    0,
  )

  const confirmDeleteWorkflow = async (workflowId: string) => {
    setDeletingWorkflowId(workflowId)
    setDeleteError(null)

    try {
      await deleteSavedWorkflow(workflowId)
      setLoadState((currentState) => ({
        status: 'success',
        workflows: currentState.workflows.filter(
          (workflow) => workflow.id !== workflowId,
        ),
      }))
      setConfirmDeleteWorkflowId(null)

      if (loadLastSavedWorkflow(window.localStorage)?.response.id === workflowId) {
        clearLastSavedWorkflow(window.localStorage)
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Non è stato possibile eliminare il workflow.',
      )
    } finally {
      setDeletingWorkflowId(null)
    }
  }

  return (
    <div className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-surface/90 px-4 backdrop-blur-xl">
        <img
          alt="Baited"
          className="h-[34px] w-[118px]"
          height="34"
          src="/baited-logo.svg"
          width="118"
        />
        <NavLink
          className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-3 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
          to="/workflow"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Nuovo workflow
        </NavLink>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />

        <main className="stealth-scroll min-w-0 flex-1 overflow-y-auto bg-surface-lowest">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                  Archivio
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-on-surface">
                  Workflow salvati
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-muted">
                  Consulta tutti i workflow creati e persistiti dal mock API.
                </p>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={loadState.status === 'loading'}
                onClick={loadWorkflows}
                type="button"
              >
                {loadState.status === 'loading' ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-3.5 animate-spin"
                  />
                ) : (
                  <RefreshCw aria-hidden="true" className="size-3.5" />
                )}
                Aggiorna
              </button>
            </div>

            <section
              aria-label="Riepilogo workflow salvati"
              className="mt-6 grid gap-3 sm:grid-cols-3"
            >
              <MetricCard
                icon={Database}
                label="Workflow"
                value={String(workflows.length)}
              />
              <MetricCard
                icon={Workflow}
                label="Nodi totali"
                value={String(totalNodes)}
              />
              <MetricCard
                icon={GitBranch}
                label="Connessioni totali"
                value={String(totalEdges)}
              />
            </section>

            {loadState.status === 'error' ? (
              <div
                className="mt-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Archivio non disponibile
                    </p>
                    <p className="mt-1 text-sm leading-5 text-on-surface-muted">
                      {loadState.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {deleteError ? (
              <div
                className="mt-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Eliminazione non riuscita
                    </p>
                    <p className="mt-1 text-sm leading-5 text-on-surface-muted">
                      {deleteError}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {loadState.status === 'loading' && workflows.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-surface-container p-6">
                <div className="flex items-center gap-3 text-on-surface-muted">
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  <p className="font-label text-xs">Caricamento workflow…</p>
                </div>
              </div>
            ) : null}

            {loadState.status === 'success' && workflows.length === 0 ? (
              <section className="mt-6 rounded-xl border border-dashed border-white/12 bg-surface-container/70 p-6">
                <p className="text-sm font-semibold text-on-surface">
                  Nessun workflow salvato
                </p>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-on-surface-muted">
                  Crea e salva un workflow dallo studio per vederlo comparire
                  in questo archivio.
                </p>
                <NavLink
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-container px-3 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
                  to="/workflow"
                >
                  Apri Workflow Studio
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </NavLink>
              </section>
            ) : null}

            {workflows.length > 0 ? (
              <section
                aria-label="Lista workflow salvati"
                className="mt-6 grid gap-4 xl:grid-cols-2"
              >
                {workflows.map((workflow) => (
                  <WorkflowArchiveCard
                    confirmDeleteWorkflowId={confirmDeleteWorkflowId}
                    deletingWorkflowId={deletingWorkflowId}
                    key={workflow.id}
                    onCancelDelete={() => setConfirmDeleteWorkflowId(null)}
                    onConfirmDelete={confirmDeleteWorkflow}
                    onRequestDelete={(workflowId) => {
                      setConfirmDeleteWorkflowId(workflowId)
                      setDeleteError(null)
                    }}
                    workflow={workflow}
                  />
                ))}
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <article className="rounded-xl border border-white/[0.08] bg-surface-container p-4">
      <div className="flex items-center gap-2 text-secondary">
        <Icon aria-hidden="true" className="size-4" />
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-on-surface">
        {value}
      </p>
    </article>
  )
}

function WorkflowArchiveCard({
  confirmDeleteWorkflowId,
  deletingWorkflowId,
  onCancelDelete,
  onConfirmDelete,
  onRequestDelete,
  workflow,
}: {
  confirmDeleteWorkflowId: string | null
  deletingWorkflowId: string | null
  onCancelDelete: () => void
  onConfirmDelete: (workflowId: string) => void
  onRequestDelete: (workflowId: string) => void
  workflow: SavedWorkflowResource
}) {
  const isConfirmingDelete = confirmDeleteWorkflowId === workflow.id
  const isDeleting = deletingWorkflowId === workflow.id
  const workflowName = workflow.metadata.name || 'Workflow senza nome'

  return (
    <article className="rounded-xl border border-white/[0.08] bg-surface-container p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            {workflow.metadata.category || 'Senza categoria'}
          </p>
          <h2 className="mt-2 truncate text-lg font-semibold text-on-surface">
            {workflowName}
          </h2>
          <p className="mt-1 break-all font-label text-[10px] text-on-surface-muted">
            {workflow.id}
          </p>
        </div>
        <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-wide text-secondary">
          {workflow.status}
        </span>
      </div>

      {workflow.metadata.description ? (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-on-surface-muted">
          {workflow.metadata.description}
        </p>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <WorkflowDatum
          icon={Workflow}
          label={`${workflow.nodes.length} nodi`}
        />
        <WorkflowDatum
          icon={GitBranch}
          label={`${workflow.edges.length} connessioni`}
        />
        <WorkflowDatum
          icon={Target}
          label={workflow.metadata.targetGroupId || 'Target non selezionato'}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
        <p className="inline-flex items-center gap-2 font-label text-[10px] text-on-surface-muted">
          <CalendarClock aria-hidden="true" className="size-3.5" />
          Salvato {formatSavedAt(workflow.createdAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            aria-label={`Elimina workflow ${workflowName}`}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 font-label text-xs font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={isDeleting}
            onClick={() => onRequestDelete(workflow.id)}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            Elimina
          </button>
          <NavLink
            aria-disabled={isDeleting}
            className={`inline-flex items-center gap-2 rounded-lg border border-secondary/25 bg-secondary/10 px-3 py-2 font-label text-xs font-semibold text-secondary transition-colors hover:border-secondary/50 hover:bg-secondary/15 ${
              isDeleting ? 'pointer-events-none opacity-45' : ''
            }`}
            to={`/workflow/${workflow.id}`}
          >
            Apri nello studio
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </NavLink>
        </div>
      </div>

      {isConfirmingDelete ? (
        <div
          aria-label={`Conferma eliminazione ${workflowName}`}
          className="mt-4 rounded-xl border border-primary/30 bg-surface-lowest p-3"
          role="alertdialog"
        >
          <p className="text-xs leading-5 text-on-surface">
            Eliminare questo workflow salvato?
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              className="flex min-h-9 w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-center font-label text-xs leading-4 text-on-surface-muted transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={isDeleting}
              onClick={onCancelDelete}
              type="button"
            >
              Annulla
            </button>
            <button
              className="flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-3 py-2 text-center font-label text-xs font-semibold leading-4 text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={isDeleting}
              onClick={() => void onConfirmDelete(workflow.id)}
              type="button"
            >
              {isDeleting ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-3.5 animate-spin"
                />
              ) : (
                <Trash2 aria-hidden="true" className="size-3.5" />
              )}
              Elimina workflow
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
}

function WorkflowDatum({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-surface-lowest px-2.5 py-2 font-label text-[10px] text-on-surface-muted">
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-on-surface" />
      <span className="truncate">{label}</span>
    </span>
  )
}

function formatSavedAt(createdAt: string) {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}
