import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  emptyWorkflowDraft,
  exampleWorkflowDraft,
} from '../../features/workflow/initialWorkflow'
import type { WorkflowDraft } from '../../features/workflow/types'
import { WorkflowProvider } from '../workflow/WorkflowProvider'
import { WorkflowReviewStep } from './WorkflowReviewStep'

describe('WorkflowReviewStep validation navigation', () => {
  it('navigates node validation issues to the referenced node', async () => {
    const user = userEvent.setup()
    const onNavigateToIssue = vi.fn()

    renderReview(exampleWorkflowDraft, onNavigateToIssue)

    await user.click(
      screen.getByRole('button', {
        name: /Vai a nodo training: Seleziona almeno un gruppo target per il training\./,
      }),
    )

    expect(onNavigateToIssue).toHaveBeenCalledWith({
      id: 'training',
      type: 'node',
    })
  })

  it('navigates edge validation issues to the referenced connection', async () => {
    const user = userEvent.setup()
    const draft = structuredClone(exampleWorkflowDraft)
    const duplicateEdge = {
      ...draft.edges.find((edge) => edge.id === 'targets-osint')!,
      id: 'targets-osint-duplicate',
    }
    const onNavigateToIssue = vi.fn()

    draft.edges.push(duplicateEdge)
    renderReview(draft, onNavigateToIssue)

    await user.click(
      screen.getByRole('button', {
        name: /Vai a connessione targets-osint-duplicate: Questa connessione è duplicata\./,
      }),
    )

    expect(onNavigateToIssue).toHaveBeenCalledWith({
      id: 'targets-osint-duplicate',
      type: 'edge',
    })
  })

  it('leaves workflow-level validation issues informational', () => {
    const onNavigateToIssue = vi.fn()

    renderReview(emptyWorkflowDraft, onNavigateToIssue)

    expect(screen.getByText('Il workflow deve avere un nodo start.')).toBeVisible()
    expect(screen.queryByRole('button', { name: /^Vai a / })).not.toBeInTheDocument()
    expect(onNavigateToIssue).not.toHaveBeenCalled()
  })
})

function renderReview(
  draft: WorkflowDraft,
  onNavigateToIssue: (target: { id: string; type: 'edge' | 'node' }) => void,
) {
  render(
    <WorkflowProvider initialDraft={draft}>
      <WorkflowReviewStep onNavigateToIssue={onNavigateToIssue} />
    </WorkflowProvider>,
  )
}
