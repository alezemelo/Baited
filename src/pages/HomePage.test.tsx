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
import { HomePage } from './HomePage'

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the empty state and route-aware navigation', async () => {
    stubWorkflowsResponse([])

    renderHome()

    expect(
      screen.getByRole('heading', {
        name: 'Progetta ogni risposta, dal primo segnale alla formazione.',
      }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Nessun workflow salvato')).toBeVisible()
    expect(screen.getByRole('img', { name: 'Baited' })).toHaveAttribute(
      'src',
      '/baited-logo.svg',
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Workflow' })).toHaveAttribute(
      'href',
      '/workflow',
    )
    expect(screen.getByRole('button', { name: 'Target' })).toBeDisabled()
  })

  it('summarizes the newest workflow from the database', async () => {
    stubWorkflowsResponse([
      createSavedWorkflowResource({
        createdAt: '2026-07-06T12:00:00.000Z',
        id: 'workflow-home-latest',
        name: 'Workflow piu recente',
      }),
      createSavedWorkflowResource({
        createdAt: '2026-07-05T12:00:00.000Z',
        id: 'workflow-home-older',
        name: 'Workflow precedente',
      }),
    ])

    renderHome()

    expect(await screen.findByText('Workflow piu recente')).toBeVisible()
    expect(screen.queryByText('Workflow precedente')).not.toBeInTheDocument()
    expect(screen.getByText('9 nodi')).toBeVisible()
    expect(screen.getByText('9 connessioni')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Apri workflow' })).toHaveAttribute(
      'href',
      '/workflow',
    )
  })

  it('stages the latest database workflow before opening the studio', async () => {
    const user = userEvent.setup()

    stubWorkflowsResponse([
      createSavedWorkflowResource({
        createdAt: '2026-07-06T12:00:00.000Z',
        id: 'workflow-home-open',
        name: 'Workflow da aprire',
      }),
    ])
    renderHome()

    await user.click(await screen.findByRole('link', { name: 'Apri workflow' }))

    expect(window.localStorage.getItem(LAST_SAVED_WORKFLOW_KEY)).toContain(
      'workflow-home-open',
    )
  })

  it('shows an error state when the database request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(
        JSON.stringify({ message: 'Archivio non raggiungibile.' }),
        { headers: { 'content-type': 'application/json' }, status: 503 },
      )),
    )

    renderHome()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Archivio non raggiungibile.',
    )
  })
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
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

function createSavedWorkflowResource({
  createdAt,
  id,
  name,
}: {
  createdAt: string
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
    createdAt,
  }
}
