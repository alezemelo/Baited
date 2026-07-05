import { useState } from 'react'
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

  it('updates the explicit condition timeout from the keyboard', async () => {
    const user = userEvent.setup()
    const node = createWorkflowNode('condition-email-opened', {
      id: 'condition-test',
    })
    let updatedData: WorkflowNodeData | null = null

    expect(node).not.toBeNull()
    render(<ControlledInspector node={node!} onUpdate={(data) => {
      updatedData = data
    }} />)

    const timeout = screen.getByLabelText('Timeout valutazione (minuti)', {
      exact: false,
    })
    await user.clear(timeout)
    await user.type(timeout, '60')

    expect(updatedData).toMatchObject({
      kind: 'condition',
      subtitle: 'Attesa 1 ora · 1 regole + else',
      config: { waitForMinutes: 60 },
    })
  })

  it('configures a generated OSINT scenario with accessible selects', async () => {
    const user = userEvent.setup()
    const node = createWorkflowNode('generate-scenario-osint', {
      id: 'scenario-test',
    })
    let updatedData: WorkflowNodeData | null = null

    expect(node).not.toBeNull()
    render(
      <ControlledInspector
        node={node!}
        onUpdate={(data) => {
          updatedData = data
        }}
      />,
    )

    await user.selectOptions(
      screen.getByLabelText('Scenario predefinito', { exact: false }),
      'supplier_fraud',
    )
    await user.selectOptions(
      screen.getByLabelText('Canale risultante', { exact: false }),
      'im',
    )
    await user.selectOptions(
      screen.getByLabelText('Strategia evidenze OSINT', { exact: false }),
      'recent',
    )

    expect(updatedData).toMatchObject({
      kind: 'generate_scenario_from_osint',
      subtitle: 'Frode fornitore · Instant message',
      config: {
        scenarioTemplate: 'supplier_fraud',
        channel: 'im',
        evidenceStrategy: 'recent',
      },
    })
  })
})

function ControlledInspector({
  node,
  onUpdate,
}: {
  node: NonNullable<ReturnType<typeof createWorkflowNode>>
  onUpdate: (data: WorkflowNodeData) => void
}) {
  const [currentNode, setCurrentNode] = useState(node)

  return (
    <NodeInspector
      node={currentNode}
      onUpdate={(updater) => {
        setCurrentNode((current) => {
          const data = updater(current.data)
          onUpdate(data)
          return { ...current, data }
        })
      }}
    />
  )
}
