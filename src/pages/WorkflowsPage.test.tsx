import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  LAST_SAVED_WORKFLOW_KEY,
  serializeWorkflow,
  type SavedWorkflowResource,
} from '../features/workflow/api/workflows'
import { exampleWorkflowDraft } from '../features/workflow/initialWorkflow'
import { WorkflowsPage } from './WorkflowsPage'

describe('WorkflowsPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders saved workflows from the API and marks the sidebar item active', async () => {
    stubWorkflowsResponse([createSavedWorkflowResource()])

    renderWorkflowsPage()

    expect(await screen.findByText('Campagna Q3 — Sicurezza email')).toBeVisible()
    expect(screen.getByText('workflow-list-test')).toBeVisible()
    expect(screen.getByText('9 nodi')).toBeVisible()
    expect(screen.getByText('9 connessioni')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Workflow salvati' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('stores the selected workflow before opening it in the studio', async () => {
    const user = userEvent.setup()

    stubWorkflowsResponse([createSavedWorkflowResource()])
    renderWorkflowsPage()

    await user.click(await screen.findByRole('link', { name: 'Apri nello studio' }))

    expect(window.localStorage.getItem(LAST_SAVED_WORKFLOW_KEY)).toContain(
      'workflow-list-test',
    )
  })

  it('shows an empty state when no workflows exist', async () => {
    stubWorkflowsResponse([])

    renderWorkflowsPage()

    expect(await screen.findByText('Nessun workflow salvato')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Apri Workflow Studio' })).toHaveAttribute(
      'href',
      '/workflow',
    )
  })

  it('shows an error state when the API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(
        JSON.stringify({ message: 'Archivio mock non raggiungibile.' }),
        { headers: { 'content-type': 'application/json' }, status: 503 },
      )),
    )

    renderWorkflowsPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Archivio mock non raggiungibile.',
    )
  })
})

function renderWorkflowsPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <WorkflowsPage />
    </MemoryRouter>,
  )
}

function stubWorkflowsResponse(workflows: SavedWorkflowResource[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(workflows), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    })),
  )
}

function createSavedWorkflowResource(): SavedWorkflowResource {
  const request = serializeWorkflow(exampleWorkflowDraft)

  return {
    ...request,
    id: 'workflow-list-test',
    status: 'saved',
    createdAt: '2026-07-06T12:00:00.000Z',
  }
}
