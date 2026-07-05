import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createWorkflowNode } from '../../features/workflow/catalog'
import type { WorkflowNodeData } from '../../features/workflow/types'
import { NodeInspector } from './NodeInspector'

describe('NodeInspector', () => {
  it('updates an incomplete awareness node through accessible controls', async () => {
    const user = userEvent.setup()
    const node = createWorkflowNode('start-awareness-basic', {
      id: 'training-test',
    })
    let updatedData: WorkflowNodeData | null = null

    expect(node).not.toBeNull()
    render(
      <NodeInspector
        node={node!}
        onUpdate={(updater) => {
          updatedData = updater(node!.data)
        }}
      />,
    )

    expect(screen.getByText('Incompleto')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Target campagna Q3'))

    expect(updatedData).toMatchObject({
      kind: 'start_awareness_campaign',
      status: 'pronto',
      config: { targetsIncluded: ['target-group-q3'] },
    })
  })
})
