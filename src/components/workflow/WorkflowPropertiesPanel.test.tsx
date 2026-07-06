import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { exampleWorkflowDraft } from '../../features/workflow/initialWorkflow'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { WorkflowProvider } from './WorkflowProvider'
import { WorkflowPropertiesPanel } from './WorkflowPropertiesPanel'

describe('WorkflowPropertiesPanel', () => {
  it('asks for confirmation before deleting any node and focuses cancel', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectEndNode />
        <WorkflowPropertiesPanel />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Seleziona end' }))
    await user.click(
      await screen.findByRole('button', { name: 'Elimina selezione' }),
    )

    expect(
      screen.getByRole('alertdialog', { name: 'Conferma eliminazione nodo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annulla' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('shows selected connection details including condition branch metadata', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectRiskEdge />
        <WorkflowPropertiesPanel />
      </WorkflowProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Seleziona connessione risk' }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Email aperta? → Gruppo alto rischio',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Aperta')).toBeInTheDocument()
    expect(screen.getByText('Regola')).toBeInTheDocument()
  })

  it('asks for confirmation before deleting a selected connection', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectRiskEdge />
        <EdgeCount />
        <WorkflowPropertiesPanel />
      </WorkflowProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Seleziona connessione risk' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Elimina connessione' }),
    )

    const dialog = screen.getByRole('alertdialog', {
      name: 'Conferma eliminazione connessione',
    })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annulla' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Elimina connessione' }),
    )
    await user.click(
      within(
        screen.getByRole('alertdialog', {
          name: 'Conferma eliminazione connessione',
        }),
      ).getByRole('button', { name: 'Elimina connessione' }),
    )

    expect(screen.getByTestId('edge-count')).toHaveTextContent(
      '8 archi · nessuna connessione selezionata',
    )
  })
})

function SelectEndNode() {
  const { selectNode } = useWorkflow()

  return (
    <button onClick={() => selectNode('end')} type="button">
      Seleziona end
    </button>
  )
}

function SelectRiskEdge() {
  const { selectEdge } = useWorkflow()

  return (
    <button onClick={() => selectEdge('opened-risk')} type="button">
      Seleziona connessione risk
    </button>
  )
}

function EdgeCount() {
  const { draft, selectedEdgeId } = useWorkflow()

  return (
    <span data-testid="edge-count">
      {draft.edges.length} archi ·{' '}
      {selectedEdgeId
        ? `${selectedEdgeId} selezionata`
        : 'nessuna connessione selezionata'}
    </span>
  )
}
