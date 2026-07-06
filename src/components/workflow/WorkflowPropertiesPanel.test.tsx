import { render, screen } from '@testing-library/react'
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
})

function SelectEndNode() {
  const { selectNode } = useWorkflow()

  return (
    <button onClick={() => selectNode('end')} type="button">
      Seleziona end
    </button>
  )
}
