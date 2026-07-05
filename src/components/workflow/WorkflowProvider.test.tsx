import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { serializeWorkflow } from '../../features/workflow/api/workflows'
import { initialWorkflowDraft } from '../../features/workflow/initialWorkflow'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { WorkflowProvider } from './WorkflowProvider'

describe('WorkflowProvider dirty state', () => {
  it('tracks changes and clears them when the current payload is marked saved', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={initialWorkflowDraft}>
        <DirtyStateHarness />
      </WorkflowProvider>,
    )

    expect(screen.getByText('allineato')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Modifica' }))
    expect(screen.getByText('modificato')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Segna salvato' }))
    expect(screen.getByText('allineato')).toBeInTheDocument()
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
