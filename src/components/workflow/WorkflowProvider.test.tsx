import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { serializeWorkflow } from '../../features/workflow/api/workflows'
import { exampleWorkflowDraft } from '../../features/workflow/initialWorkflow'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { WorkflowProvider } from './WorkflowProvider'

describe('WorkflowProvider dirty state', () => {
  it('starts with an empty clean draft when storage is empty', () => {
    render(
      <WorkflowProvider>
        <DraftSummary />
      </WorkflowProvider>,
    )

    expect(screen.getByTestId('draft-summary')).toHaveTextContent(
      '0 nodi · 0 archi · nome vuoto · allineato',
    )
  })

  it('tracks changes and clears them when the current payload is marked saved', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <DirtyStateHarness />
      </WorkflowProvider>,
    )

    expect(screen.getByText('allineato')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Modifica' }))
    expect(screen.getByText('modificato')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Segna salvato' }))
    expect(screen.getByText('allineato')).toBeInTheDocument()
  })

  it('resets an edited example to a clean empty workflow', async () => {
    const user = userEvent.setup()

    window.localStorage.setItem('baited:last-saved-workflow', 'saved')
    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <DraftSummary />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Modifica draft' }))
    await user.click(screen.getByRole('button', { name: 'Nuovo draft' }))

    expect(screen.getByTestId('draft-summary')).toHaveTextContent(
      '0 nodi · 0 archi · nome vuoto · allineato',
    )
    expect(window.localStorage.getItem('baited:last-saved-workflow')).toBeNull()
  })
})

function DirtyStateHarness() {
  const {
    draft,
    hasUnsavedChanges,
    markWorkflowSaved,
    updateMetadata,
  } = useWorkflow()

  return (
    <>
      <span>{hasUnsavedChanges ? 'modificato' : 'allineato'}</span>
      <button
        onClick={() => updateMetadata({ description: 'Aggiornata' })}
        type="button"
      >
        Modifica
      </button>
      <button
        onClick={() => markWorkflowSaved(serializeWorkflow(draft))}
        type="button"
      >
        Segna salvato
      </button>
    </>
  )
}

function DraftSummary() {
  const {
    draft,
    hasUnsavedChanges,
    startNewWorkflow,
    updateMetadata,
  } = useWorkflow()

  return (
    <>
      <span data-testid="draft-summary">
        {draft.nodes.length} nodi · {draft.edges.length} archi ·{' '}
        {draft.metadata.name ? 'nome presente' : 'nome vuoto'} ·{' '}
        {hasUnsavedChanges ? 'modificato' : 'allineato'}
      </span>
      <button
        onClick={() => updateMetadata({ name: 'Modificato' })}
        type="button"
      >
        Modifica draft
      </button>
      <button onClick={startNewWorkflow} type="button">
        Nuovo draft
      </button>
    </>
  )
}
