import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getWorkflowResourceRecord,
  LAST_SAVED_WORKFLOW_KEY,
  persistLastSavedWorkflow,
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

  it('links the selected workflow directly to the studio route', async () => {
    stubWorkflowsResponse([createSavedWorkflowResource()])
    renderWorkflowsPage()

    expect(await screen.findByRole('link', { name: 'Apri nello studio' }))
      .toHaveAttribute('href', '/workflow/workflow-list-test')
  })

  it('deletes a saved workflow after confirmation and clears matching local restore state', async () => {
    const user = userEvent.setup()
    const workflow = createSavedWorkflowResource()
    const fetchMock = stubWorkflowsResponse([workflow])

    persistLastSavedWorkflow(
      getWorkflowResourceRecord(workflow),
      window.localStorage,
    )
    renderWorkflowsPage()

    await user.click(
      await screen.findByRole('button', {
        name: 'Elimina workflow Campagna Q3 — Sicurezza email',
      }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Elimina workflow' }),
    )

    expect(await screen.findByText('Nessun workflow salvato')).toBeVisible()
    expect(screen.queryByText('workflow-list-test')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(LAST_SAVED_WORKFLOW_KEY)).toBeNull()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/workflows/workflow-list-test',
      { method: 'DELETE' },
    )
  })

  it('keeps the workflow visible when deletion fails', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn(async (_: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === 'DELETE') {
          return new Response(
            JSON.stringify({ message: 'Eliminazione mock non riuscita.' }),
            { headers: { 'content-type': 'application/json' }, status: 503 },
          )
        }

        return new Response(JSON.stringify([createSavedWorkflowResource()]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        })
      }),
    )

    renderWorkflowsPage()

    await user.click(
      await screen.findByRole('button', {
        name: 'Elimina workflow Campagna Q3 — Sicurezza email',
      }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Elimina workflow' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Eliminazione mock non riuscita.',
    )
    expect(screen.getByText('workflow-list-test')).toBeVisible()
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
  const fetchMock = vi.fn(async (_: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'DELETE') {
      return new Response(JSON.stringify({}), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify(workflows), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    })
  })

  vi.stubGlobal(
    'fetch',
    fetchMock,
  )

  return fetchMock
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
