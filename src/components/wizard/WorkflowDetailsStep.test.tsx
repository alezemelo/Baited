import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WorkflowProvider } from '../workflow/WorkflowProvider'
import { emptyWorkflowDraft } from '../../features/workflow/initialWorkflow'
import { WorkflowDetailsStep } from './WorkflowDetailsStep'

describe('WorkflowDetailsStep', () => {
  it('announces the name error and moves focus to the invalid field', () => {
    const initialDraft = structuredClone(emptyWorkflowDraft)
    initialDraft.metadata.name = ''

    render(
      <WorkflowProvider initialDraft={initialDraft}>
        <WorkflowDetailsStep
          nameError="Inserisci un nome per continuare al workflow."
          onNameInput={vi.fn()}
        />
      </WorkflowProvider>,
    )

    const input = screen.getByRole('textbox', { name: 'Nome workflow' })

    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Inserisci un nome')
  })
})
