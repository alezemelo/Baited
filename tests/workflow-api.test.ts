import assert from 'node:assert/strict'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { createWorkflowNode } from '../src/features/workflow/catalog'
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

let apiBaseUrl = ''
let apiProcess: ChildProcessWithoutNullStreams
let apiProcessOutput = ''
let temporaryDirectory = ''

before(async () => {
  temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'baited-api-test-'))
  const port = await getAvailablePort()
  apiBaseUrl = `http://127.0.0.1:${port}/api`
  apiProcess = spawn(
    process.execPath,
    [
      'mocks/server.cjs',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--db',
      path.join(temporaryDirectory, 'db.json'),
      '--reset',
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        MOCK_API_DELAY_MS: '0',
        NODE_ENV: 'test',
      },
      stdio: 'pipe',
    },
  )
  apiProcess.stdout.on('data', (chunk) => {
    apiProcessOutput += chunk.toString()
  })
  apiProcess.stderr.on('data', (chunk) => {
    apiProcessOutput += chunk.toString()
  })

  await waitForApi(`${apiBaseUrl}/health`)
})

after(async () => {
  if (apiProcess?.exitCode === null) {
    apiProcess.kill('SIGTERM')
    await new Promise<void>((resolve) => apiProcess.once('exit', () => resolve()))
  }

  if (temporaryDirectory) {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})

test('serializer creates a detached v1 payload without React Flow UI state', () => {
  const draft = createDraft()
  const condition = requiredNode('condition-email-opened', 'condition')
  const scenario = requiredNode('generate-scenario-osint', 'scenario')
  draft.nodes.push(condition, scenario)
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
  const serializedCondition = payload.nodes.find(
    (node) => node.id === 'condition',
  )
  assert.equal(
    serializedCondition?.data.kind === 'condition'
      ? serializedCondition.data.config.waitForMinutes
      : undefined,
    2880,
  )
  const serializedScenario = payload.nodes.find(
    (node) => node.id === 'scenario',
  )
  assert.deepEqual(
    serializedScenario?.data.kind === 'generate_scenario_from_osint'
      ? serializedScenario.data.config
      : undefined,
    {
      scenarioTemplate: 'credential_harvest',
      channel: 'email',
      evidenceStrategy: 'most_relevant',
    },
  )

  payload.metadata.name = 'Mutato'
  payload.nodes[0].data.label = 'Mutato'

  assert.equal(draft.metadata.name, 'Workflow API')
  assert.equal(draft.nodes[0].data.label, 'Target selezionati')
})

test('JSON Server API supports error, retry, persistence and success states', async () => {
  const request = serializeWorkflow(createDraft())
  let state = createInitialWorkflowSaveState(null)

  state = workflowSaveReducer(state, { type: 'save_started' })
  assert.equal(state.status, 'loading')

  await assert.rejects(
    saveWorkflow(request, {
      endpoint: `${apiBaseUrl}/workflows`,
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
  assert.deepEqual(await getPersistedWorkflows(), [])

  const response = await saveWorkflow(request, {
    endpoint: `${apiBaseUrl}/workflows`,
  })
  const record = { request, response }
  state = workflowSaveReducer(state, { type: 'save_succeeded', record })

  assert.equal(state.status, 'success')
  assert.match(response.id, /^workflow-/)
  assert.equal(response.version, 1)
  assert.equal(response.status, 'saved')
  assert.ok(!Number.isNaN(Date.parse(response.createdAt)))

  const persistedWorkflows = await getPersistedWorkflows()
  assert.equal(persistedWorkflows.length, 1)
  assert.deepEqual(persistedWorkflows[0], {
    ...request,
    ...response,
  })
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
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  }
}

async function getPersistedWorkflows(): Promise<unknown[]> {
  const response = await fetch(`${apiBaseUrl}/workflows`)
  assert.equal(response.status, 200)
  const body: unknown = await response.json()
  assert.ok(Array.isArray(body))
  return body
}

async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()

    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()

      if (typeof address !== 'object' || address === null) {
        server.close()
        reject(new Error('Unable to allocate a test port.'))
        return
      }

      const { port } = address
      server.close((error) => {
        if (error) reject(error)
        else resolve(port)
      })
    })
  })
}

async function waitForApi(url: string) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (apiProcess.exitCode !== null) {
      throw new Error(`Mock API exited early.\n${apiProcessOutput}`)
    }

    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The server may still be binding its port.
    }

    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  throw new Error(`Mock API did not become ready.\n${apiProcessOutput}`)
}
