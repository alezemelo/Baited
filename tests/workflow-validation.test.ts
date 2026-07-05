import assert from 'node:assert/strict'
import test from 'node:test'
import { createWorkflowNode } from '../src/features/workflow/catalog'
import type {
  WorkflowDraft,
  WorkflowEdge,
  WorkflowNode,
} from '../src/features/workflow/types'
import {
  validateWorkflow,
  type WorkflowValidationCode,
} from '../src/features/workflow/validation/validateWorkflow'
import {
  getNodeIdsThatCanReachTargets,
  wouldCreateCycle,
} from '../src/features/workflow/validation/graph'

test('valid workflow returns no validation issues and is not mutated', () => {
  const draft = createValidDraft()
  const beforeValidation = JSON.stringify(draft)
  const result = validateWorkflow(draft)

  assert.equal(result.isValid, true)
  assert.deepEqual(codes(result), [])
  assert.equal(JSON.stringify(draft), beforeValidation)
})

test('cycle detection flags existing cycles and prevents new cycle connections', () => {
  const draft = createValidDraft()
  const connection = {
    source: 'training',
    target: 'email',
  }

  assert.equal(wouldCreateCycle(draft.nodes, draft.edges, connection), true)

  draft.edges.push(edge('training-email', 'training', 'email'))
  assert.ok(codes(validateWorkflow(draft)).includes('cycle_detected'))
})

test('orphan and unreachable nodes are reported', () => {
  const draft = createValidDraft()
  const orphan = requiredNode('start-osint-social', 'osint')

  if (orphan.data.kind === 'start_osint_on_targets') {
    orphan.data = {
      ...orphan.data,
      config: {
        ...orphan.data.config,
        targets: ['target-group-q3'],
      },
    }
  }

  draft.nodes.push(orphan)
  assert.ok(codes(validateWorkflow(draft)).includes('orphan_node'))
  assert.ok(codes(validateWorkflow(draft)).includes('unreachable_node'))
})

test('start and end structural rules are enforced', () => {
  const missingStartDraft = createValidDraft()
  missingStartDraft.nodes = missingStartDraft.nodes.filter(
    (node) => node.data.kind !== 'workflow_start',
  )

  assert.ok(codes(validateWorkflow(missingStartDraft)).includes('missing_start'))

  const multipleStartDraft = createValidDraft()
  multipleStartDraft.nodes.push(requiredNode('workflow-start', 'targets-2'))

  assert.ok(
    codes(validateWorkflow(multipleStartDraft)).includes('multiple_start'),
  )

  const missingEndDraft = createValidDraft()
  missingEndDraft.nodes = missingEndDraft.nodes.filter(
    (node) => node.data.kind !== 'workflow_end',
  )

  assert.ok(codes(validateWorkflow(missingEndDraft)).includes('missing_end'))
})

test('condition branches require one stable outgoing edge including else', () => {
  const missingElseDraft = createValidDraft()
  missingElseDraft.edges = missingElseDraft.edges.filter(
    (candidate) => candidate.id !== 'opened-sms',
  )

  assert.ok(
    codes(validateWorkflow(missingElseDraft)).includes(
      'missing_condition_branch',
    ),
  )

  const danglingBranchDraft = createValidDraft()
  danglingBranchDraft.edges.push(edge('opened-ghost', 'opened', 'end', 'ghost'))

  assert.ok(
    codes(validateWorkflow(danglingBranchDraft)).includes(
      'dangling_condition_branch',
    ),
  )
})

test('self-loop, duplicate edges and required fields are reported', () => {
  const draft = createValidDraft()

  draft.edges.push(edge('email-self', 'email', 'email'))
  draft.edges.push(edge('targets-email-duplicate', 'targets', 'email'))

  const training = draft.nodes.find((node) => node.id === 'training')

  if (training?.data.kind === 'start_awareness_campaign') {
    training.data = {
      ...training.data,
      config: {
        ...training.data.config,
        targetsIncluded: [],
      },
    }
  }

  const validationCodes = codes(validateWorkflow(draft))

  assert.ok(validationCodes.includes('self_loop'))
  assert.ok(validationCodes.includes('duplicate_edge'))
  assert.ok(validationCodes.includes('missing_required_field'))
})

test('reachable paths that cannot reach an end are reported', () => {
  const draft = createValidDraft()
  draft.edges = draft.edges.filter(
    (candidate) => candidate.id !== 'training-end',
  )

  const result = validateWorkflow(draft)
  const unterminatedNodeIds = result.issues
    .filter((issue) => issue.code === 'unterminated_path')
    .map((issue) => issue.nodeId)
    .sort()

  assert.deepEqual(unterminatedNodeIds, ['risk', 'training'])
  assert.ok(result.issues.some(
    (issue) =>
      issue.code === 'unterminated_path' &&
      issue.message === 'Training di base non conduce ad alcun nodo end.',
  ))
})

test('reverse reachability supports multiple ends and converging branches', () => {
  const draft = createValidDraft()
  const secondEnd = requiredNode('workflow-end', 'end-training')
  const trainingEdge = draft.edges.find(
    (candidate) => candidate.id === 'training-end',
  )

  assert.ok(trainingEdge)
  trainingEdge.target = secondEnd.id
  draft.nodes.push(secondEnd)

  const nodeIdsThatCanReachEnd = getNodeIdsThatCanReachTargets(
    draft.nodes,
    draft.edges,
    ['end', 'end-training'],
  )

  assert.equal(nodeIdsThatCanReachEnd.size, draft.nodes.length)
  assert.equal(validateWorkflow(draft).isValid, true)
})

function createValidDraft(): WorkflowDraft {
  const start = requiredNode('workflow-start', 'targets')
  const email = requiredNode('create-campaign-email', 'email')
  const opened = requiredNode('condition-email-opened', 'opened')
  const sms = requiredNode('create-campaign-sms', 'sms')
  const risk = requiredNode('add-target-high-risk', 'risk')
  const training = requiredNode('start-awareness-basic', 'training')
  const end = requiredNode('workflow-end', 'end')

  if (training.data.kind === 'start_awareness_campaign') {
    training.data = {
      ...training.data,
      status: 'pronto',
      config: {
        ...training.data.config,
        targetsIncluded: ['target-group-q3'],
      },
    }
  }

  return {
    id: 'workflow-test',
    version: 1,
    status: 'draft',
    metadata: {
      category: 'Test',
      description: 'Fixture completa per validazione.',
      name: 'Workflow valido',
      targetGroupId: 'target-group-q3',
    },
    nodes: [start, email, opened, sms, risk, training, end],
    edges: [
      edge('targets-email', 'targets', 'email'),
      edge('email-opened', 'email', 'opened'),
      edge('opened-sms', 'opened', 'sms', 'no', {
        branchId: 'no',
        branchType: 'else',
      }),
      edge('sms-end', 'sms', 'end'),
      edge('opened-risk', 'opened', 'risk', 'yes', {
        branchId: 'yes',
        branchType: 'rule',
      }),
      edge('risk-training', 'risk', 'training'),
      edge('training-end', 'training', 'end'),
    ],
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

function edge(
  id: string,
  source: string,
  target: string,
  sourceHandle?: string,
  data?: WorkflowEdge['data'],
): WorkflowEdge {
  return {
    id,
    source,
    sourceHandle,
    target,
    data,
  }
}

function codes(result: ReturnType<typeof validateWorkflow>) {
  return result.issues.map((issue) => issue.code).sort() satisfies WorkflowValidationCode[]
}
