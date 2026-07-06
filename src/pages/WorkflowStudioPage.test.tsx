import { render, screen } from '@testing-library/react'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import {
  getWorkflowResourceRecord,
  LAST_SAVED_WORKFLOW_KEY,
  persistLastSavedWorkflow,
  serializeWorkflow,
  type SavedWorkflowResource,
} from '../features/workflow/api/workflows'
import { exampleWorkflowDraft } from '../features/workflow/initialWorkflow'
import { WorkflowStudioPage } from './WorkflowStudioPage'

vi.mock('../components/wizard/WorkflowWizard', async () => {
  const { useWorkflow } = await import('../features/workflow/WorkflowContext')

  return {
    WorkflowWizard: () => {
      const { draft } = useWorkflow()
      const workflowName = draft.metadata.name || 'nome vuoto'

      return (
        <section aria-label="Workflow test summary">
          <p data-testid="studio-draft-id">{draft.id}</p>
          <p data-testid="studio-draft-summary">
            {draft.nodes.length} nodi · {draft.edges.length} connessioni ·{' '}
            {workflowName}
          </p>
        </section>
      )
    },
  }
})

describe('WorkflowStudioPage route initialization', () => {
  it('opens an explicit empty draft from /workflow?new=true without clearing localStorage', async () => {
    const savedWorkflow = createSavedWorkflowResource({
      id: 'workflow-local-restore',
      name: 'Workflow locale salvato',
    })
    persistLastSavedWorkflow(
      getWorkflowResourceRecord(savedWorkflow),
      window.localStorage,
    )

    renderStudio('/workflow?new=true')

    expect(await screen.findByTestId('studio-draft-summary')).toHaveTextContent(
      '0 nodi · 0 connessioni · nome vuoto',
    )
    expect(screen.getByTestId('studio-draft-id')).toHaveTextContent(
      /^workflow-new-/,
    )
    expect(window.localStorage.getItem(LAST_SAVED_WORKFLOW_KEY)).not.toBeNull()
  })

  it('keeps the existing localStorage restore behavior on /workflow', async () => {
    const savedWorkflow = createSavedWorkflowResource({
      id: 'workflow-local-restore',
      name: 'Workflow locale salvato',
    })
    persistLastSavedWorkflow(
      getWorkflowResourceRecord(savedWorkflow),
      window.localStorage,
    )

    renderStudio('/workflow')

    expect(await screen.findByTestId('studio-draft-id')).toHaveTextContent(
      'workflow-local-restore',
    )
    expect(screen.getByTestId('studio-draft-summary')).toHaveTextContent(
      '9 nodi · 9 connessioni · Workflow locale salvato',
    )
  })
})

function renderStudio(initialEntry: string) {
  const router = createMemoryRouter(
    [
      { path: '/workflow', element: <WorkflowStudioPage /> },
      { path: '/workflow/:workflowId', element: <WorkflowStudioPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

function createSavedWorkflowResource({
  id,
  name,
}: {
  id: string
  name: string
}): SavedWorkflowResource {
  const request = serializeWorkflow(exampleWorkflowDraft)

  return {
    ...request,
    id,
    metadata: {
      ...request.metadata,
      name,
    },
    status: 'saved',
    createdAt: '2026-07-07T08:00:00.000Z',
  }
}
