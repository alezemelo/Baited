import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { setupServer } from 'msw/node'
import { createWorkflowNode } from '../src/features/workflow/catalog'
import { workflowHandlers } from '../src/features/workflow/api/mock'
import {
  LAST_SAVED_WORKFLOW_KEY,
  createInitialWorkflowSaveState,
  loadLastSavedWorkflow,
  persistLastSavedWorkflow,
  restoreWorkflowDraft,
  saveWorkflow,
  serializeWorkflow,
  workflowSaveReducer,
  WorkflowApiError,
  type SavedWorkflowRecord,
  type WorkflowStorage,
} from '../src/features/workflow/api/workflows'
import type {
  WorkflowDraft,
  WorkflowEdge,
  WorkflowNode,
} from '../src/features/workflow/types'

const server = setupServer(...workflowHandlers)

before(() => server.listen({ onUnhandledRequest: 'error' }))
after(() => server.close())

test('serializer creates a detached v1 payload without React Flow UI state', () => {
  const draft = createDraft()
  draft.nodes[0].selected = true
  draft.nodes[0].className = 'workflow-node-error'
  draft.edges[0].selected = true

  const payload = serializeWorkflow(draft)

  assert.equal(payload.version, 1)
  assert.deepEqual(payload.metadata, draft.metadata)
  assert.deepEqual(payload.nodes[0], {
    id: 'targets',
    type: 'baitedWorkflow',
    position: { x: 0, y: 0 },
    data: draft.nodes[0].data,
  })
  assert.deepEqual(payload.edges[0], {
    id: 'targets-end',
    source: 'targets',
    target: 'end',
  })

  payload.metadata.name = 'Mutato'
  payload.nodes[0].data.label = 'Mutato'

  assert.equal(draft.metadata.name, 'Workflow API')
  assert.equal(draft.nodes[0].data.label, 'Target selezionati')
})

test('mock API supports loading, error, retry and success states', async () => {
  const request = serializeWorkflow(createDraft())
  let state = createInitialWorkflowSaveState(null)

  state = workflowSaveReducer(state, { type: 'save_started' })
  assert.equal(state.status, 'loading')

  await assert.rejects(
    saveWorkflow(request, {
      endpoint: 'http://localhost/api/workflows',
      simulateError: true,
    }),
    (error: unknown) => {
      assert.ok(error instanceof WorkflowApiError)
      assert.equal(error.status, 503)
      return true
    },
  )

  state = workflowSaveReducer(state, {
    type: 'save_failed',
    message: 'Errore mock',
  })
  assert.equal(state.status, 'error')

  state = workflowSaveReducer(state, { type: 'save_started' })
  const response = await saveWorkflow(request, {
    endpoint: 'http://localhost/api/workflows',
  })
  const record = { request, response }
  state = workflowSaveReducer(state, { type: 'save_succeeded', record })

  assert.equal(state.status, 'success')
  assert.match(response.id, /^workflow-/)
  assert.equal(response.version, 1)
  assert.equal(response.status, 'saved')
  assert.ok(!Number.isNaN(Date.parse(response.createdAt)))
})

test('saved workflow persists and restores from local storage', () => {
  const storage = createMemoryStorage()
  const request = serializeWorkflow(createDraft())
  const record: SavedWorkflowRecord = {
    request,
    response: {
      id: 'workflow-restored',
      version: 1,
      status: 'saved',
      createdAt: '2026-07-05T12:00:00.000Z',
    },
  }

  persistLastSavedWorkflow(record, storage)

  assert.ok(storage.getItem(LAST_SAVED_WORKFLOW_KEY))
  assert.deepEqual(loadLastSavedWorkflow(storage), record)
  assert.deepEqual(restoreWorkflowDraft(record), {
    id: 'workflow-restored',
    version: 1,
    status: 'draft',
    metadata: request.metadata,
    nodes: request.nodes,
    edges: request.edges,
  })
})

function createDraft(): WorkflowDraft {
  return {
    id: 'workflow-api',
    version: 1,
    status: 'draft',
    metadata: {
      category: 'Test',
      description: 'Fixture API.',
      name: 'Workflow API',
      targetGroupId: 'target-group-q3',
    },
    nodes: [
      requiredNode('workflow-start', 'targets'),
      requiredNode('workflow-end', 'end'),
    ],
    edges: [edge('targets-end', 'targets', 'end')],
  }
}

function requiredNode(templateId: string, id: string): WorkflowNode {
  const node = createWorkflowNode(templateId, {
    id,
    position: { x: 0, y: 0 },
  })

  assert.ok(node, `Missing template ${templateId}`)

  return node
}

function edge(id: string, source: string, target: string): WorkflowEdge {
  return { id, source, target }
}

function createMemoryStorage(): WorkflowStorage {
  const values = new Map<string, string>()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}
