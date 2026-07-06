import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  persistLastSavedWorkflow,
  serializeWorkflow,
} from '../features/workflow/api/workflows'
import { exampleWorkflowDraft } from '../features/workflow/initialWorkflow'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('shows the empty state and route-aware navigation', () => {
    renderHome()

    expect(
      screen.getByRole('heading', {
        name: 'Progetta ogni risposta, dal primo segnale alla formazione.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Nessun workflow salvato')).toBeInTheDocument()
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

  it('summarizes the last valid saved workflow', () => {
    const request = serializeWorkflow(exampleWorkflowDraft)

    persistLastSavedWorkflow(
      {
        request,
        response: {
          id: 'workflow-home-test',
          version: 1,
          status: 'saved',
          createdAt: '2026-07-06T12:00:00.000Z',
        },
      },
      window.localStorage,
    )

    renderHome()

    expect(
      screen.getByText('Campagna Q3 — Sicurezza email'),
    ).toBeInTheDocument()
    expect(screen.getByText('9 nodi')).toBeInTheDocument()
    expect(screen.getByText('9 connessioni')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Apri workflow' })).toHaveAttribute(
      'href',
      '/workflow',
    )
  })

  it('falls back to the empty state for malformed storage', () => {
    window.localStorage.setItem(
      'baited:last-saved-workflow',
      '{"request":"invalid"}',
    )

    renderHome()

    expect(screen.getByText('Nessun workflow salvato')).toBeInTheDocument()
  })
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
    </MemoryRouter>,
  )
}
