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

  it('keeps node and edge selection mutually exclusive', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectionHarness />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Seleziona edge' }))
    expect(screen.getByTestId('selection-summary')).toHaveTextContent(
      'nodo: nessuno · edge: targets-osint',
    )

    await user.click(screen.getByRole('button', { name: 'Seleziona nodo' }))
    expect(screen.getByTestId('selection-summary')).toHaveTextContent(
      'nodo: end · edge: nessuno',
    )
  })

  it('removes a selected edge and marks the draft dirty', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectionHarness />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Seleziona edge' }))
    await user.click(screen.getByRole('button', { name: 'Elimina edge' }))

    expect(screen.getByTestId('selection-summary')).toHaveTextContent(
      'nodo: nessuno · edge: nessuno',
    )
    expect(screen.getByTestId('edge-summary')).toHaveTextContent(
      '8 archi · targets-osint assente · modificato',
    )
  })

  it('clears a selected edge when deleting one of its nodes', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <SelectionHarness />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Seleziona edge' }))
    await user.click(screen.getByRole('button', { name: 'Elimina nodo OSINT' }))

    expect(screen.getByTestId('selection-summary')).toHaveTextContent(
      'nodo: nessuno · edge: nessuno',
    )
    expect(screen.getByTestId('edge-summary')).toHaveTextContent(
      '7 archi · targets-osint assente · modificato',
    )
  })

  it('reconnects a valid edge target while preserving its id', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <ReconnectHarness edgeId="risk-training" />
      </WorkflowProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Riconnetti a end' }))

    expect(screen.getByTestId('reconnect-summary')).toHaveTextContent(
      'risk-training: risk → end · label: nessuna · data: nessuna · selezione: risk-training · modificato',
    )
  })

  it('does not mutate edges when reconnection violates connection rules', async () => {
    const user = userEvent.setup()

    render(
      <WorkflowProvider initialDraft={exampleWorkflowDraft}>
        <ReconnectHarness edgeId="targets-osint" />
      </WorkflowProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Riconnetti target non valido' }),
    )

    expect(screen.getByTestId('reconnect-summary')).toHaveTextContent(
      'targets-osint: targets → osint · label: nessuna · data: nessuna · selezione: nessuna · allineato',
    )
  })

  it('updates condition branch labels and metadata when reconnecting handles', async () => {
    const user = userEvent.setup()
    const draft = structuredClone(exampleWorkflowDraft)

    draft.edges = draft.edges.filter((edge) => edge.id !== 'opened-sms')

    render(
      <WorkflowProvider initialDraft={draft}>
        <ReconnectHarness edgeId="opened-risk" />
      </WorkflowProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Riconnetti a branch else' }),
    )

    expect(screen.getByTestId('reconnect-summary')).toHaveTextContent(
      'opened-risk: opened → sms · label: Non aperta · data: no/else · selezione: opened-risk · modificato',
    )
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

function SelectionHarness() {
  const {
    draft,
    hasUnsavedChanges,
    removeEdge,
    removeNode,
    selectEdge,
    selectNode,
    selectedEdgeId,
    selectedNodeId,
  } = useWorkflow()
  const hasTargetsOsint = draft.edges.some((edge) => edge.id === 'targets-osint')

  return (
    <>
      <span data-testid="selection-summary">
        nodo: {selectedNodeId ?? 'nessuno'} · edge:{' '}
        {selectedEdgeId ?? 'nessuno'}
      </span>
      <span data-testid="edge-summary">
        {draft.edges.length} archi · targets-osint{' '}
        {hasTargetsOsint ? 'presente' : 'assente'} ·{' '}
        {hasUnsavedChanges ? 'modificato' : 'allineato'}
      </span>
      <button onClick={() => selectEdge('targets-osint')} type="button">
        Seleziona edge
      </button>
      <button onClick={() => selectNode('end')} type="button">
        Seleziona nodo
      </button>
      <button onClick={() => removeEdge('targets-osint')} type="button">
        Elimina edge
      </button>
      <button onClick={() => removeNode('osint')} type="button">
        Elimina nodo OSINT
      </button>
    </>
  )
}

function ReconnectHarness({ edgeId }: { edgeId: string }) {
  const {
    draft,
    hasUnsavedChanges,
    reconnectEdge,
    selectedEdgeId,
  } = useWorkflow()
  const edge = draft.edges.find((candidate) => candidate.id === edgeId)

  if (!edge) {
    return <span data-testid="reconnect-summary">edge mancante</span>
  }

  const edgeData = edge.data
    ? `${edge.data.branchId ?? 'nessun-branch'}/${edge.data.branchType ?? 'nessun-tipo'}`
    : 'nessuna'

  return (
    <>
      <span data-testid="reconnect-summary">
        {edge.id}: {edge.source} → {edge.target} · label:{' '}
        {edge.label ? String(edge.label) : 'nessuna'} · data: {edgeData} ·
        selezione: {selectedEdgeId ?? 'nessuna'} ·{' '}
        {hasUnsavedChanges ? 'modificato' : 'allineato'}
      </span>
      <button
        onClick={() =>
          reconnectEdge(edge, {
            source: edge.source,
            sourceHandle: edge.sourceHandle ?? null,
            target: 'end',
            targetHandle: null,
          })
        }
        type="button"
      >
        Riconnetti a end
      </button>
      <button
        onClick={() =>
          reconnectEdge(edge, {
            source: edge.source,
            sourceHandle: edge.sourceHandle ?? null,
            target: 'scenario',
            targetHandle: null,
          })
        }
        type="button"
      >
        Riconnetti target non valido
      </button>
      <button
        onClick={() =>
          reconnectEdge(edge, {
            source: 'opened',
            sourceHandle: 'no',
            target: 'sms',
            targetHandle: null,
          })
        }
        type="button"
      >
        Riconnetti a branch else
      </button>
    </>
  )
}
