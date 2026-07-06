import { AlertTriangle, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  NavLink,
  useBlocker,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader'
import { SideNavigation } from '../components/layout/SideNavigation'
import { WorkflowProvider } from '../components/workflow/WorkflowProvider'
import { WorkflowWizard } from '../components/wizard/WorkflowWizard'
import {
  getSavedWorkflow,
  getWorkflowResourceRecord,
  restoreWorkflowDraft,
} from '../features/workflow/api/workflows'
import { createEmptyWorkflowDraft } from '../features/workflow/initialWorkflow'
import { useWorkflow } from '../features/workflow/WorkflowContext'
import type { WorkflowDraft } from '../features/workflow/types'

type WorkflowRouteState =
  | { draft: null; message: string; status: 'error' }
  | { draft: null; status: 'loading' }
  | { draft: WorkflowDraft | null; status: 'ready' }

export function WorkflowStudioPage() {
  const { workflowId } = useParams()
  const [searchParams] = useSearchParams()
  const shouldStartEmpty = !workflowId && searchParams.get('new') === 'true'
  const explicitEmptyDraft = useMemo(
    () => (shouldStartEmpty ? createEmptyWorkflowDraft() : null),
    [shouldStartEmpty],
  )
  const [routeState, setRouteState] = useState<WorkflowRouteState>({
    draft: null,
    status: workflowId ? 'loading' : 'ready',
  })

  useEffect(() => {
    if (!workflowId) {
      setRouteState({ draft: null, status: 'ready' })
      return
    }

    const controller = new AbortController()

    setRouteState({ draft: null, status: 'loading' })
    void getSavedWorkflow(workflowId, { signal: controller.signal })
      .then((workflow) => {
        setRouteState({
          draft: restoreWorkflowDraft(getWorkflowResourceRecord(workflow)),
          status: 'ready',
        })
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setRouteState({
          draft: null,
          message:
            error instanceof Error
              ? error.message
              : 'Non è stato possibile aprire il workflow richiesto.',
          status: 'error',
        })
      })

    return () => controller.abort()
  }, [workflowId])

  if (routeState.status === 'loading') {
    return <WorkflowRouteShell status="Caricamento workflow…" />
  }

  if (routeState.status === 'error') {
    return <WorkflowRouteShell error={routeState.message} />
  }

  const initialDraft = routeState.draft ?? explicitEmptyDraft ?? undefined

  return (
    <WorkflowProvider
      initialDraft={initialDraft}
      key={initialDraft?.id ?? 'local-draft'}
    >
      <WorkflowStudioContent />
    </WorkflowProvider>
  )
}

function WorkflowRouteShell({
  error,
  status,
}: {
  error?: string
  status?: string
}) {
  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category="Workflow"
        hasUnsavedChanges={false}
        onNewWorkflow={() => {}}
        status={error ? 'Apertura non riuscita' : 'Caricamento'}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <section className="flex min-w-0 flex-1 items-center justify-center bg-surface-lowest p-6">
          {error ? (
            <div
              className="max-w-md rounded-xl border border-primary/20 bg-primary/10 p-5"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <div>
                  <h1 className="text-sm font-semibold text-primary">
                    Workflow non disponibile
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-on-surface-muted">
                    {error}
                  </p>
                  <NavLink
                    className="mt-4 inline-flex items-center rounded-lg border border-white/10 px-3 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:bg-white/5"
                    to="/workflows"
                  >
                    Torna ai workflow salvati
                  </NavLink>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-surface-container p-5 text-on-surface-muted">
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
              <p className="font-label text-xs">
                {status ?? 'Caricamento workflow…'}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function WorkflowStudioContent() {
  const { draft, hasUnsavedChanges, startNewWorkflow } = useWorkflow()
  const navigationBlocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  const handleNewWorkflow = () => {
    if (
      hasUnsavedChanges &&
      !window.confirm('Creare un nuovo workflow? Le modifiche non salvate andranno perse.')
    ) {
      return
    }

    startNewWorkflow()
  }

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnAboutUnsavedChanges)

    return () => {
      window.removeEventListener('beforeunload', warnAboutUnsavedChanges)
    }
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (navigationBlocker.state !== 'blocked') {
      return
    }

    if (
      window.confirm(
        'Uscire dal workflow? Le modifiche non salvate andranno perse.',
      )
    ) {
      navigationBlocker.proceed()
    } else {
      navigationBlocker.reset()
    }
  }, [navigationBlocker])

  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category={draft.metadata.category}
        hasUnsavedChanges={hasUnsavedChanges}
        onNewWorkflow={handleNewWorkflow}
        status={hasUnsavedChanges ? 'Modifiche non salvate' : 'Draft allineato'}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <WorkflowWizard key={draft.id} />
      </div>
    </main>
  )
}
