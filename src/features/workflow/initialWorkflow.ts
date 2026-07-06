import { MarkerType } from '@xyflow/react'
import { createWorkflowNode } from './catalog'
import type { WorkflowDraft, WorkflowEdge, WorkflowNode } from './types'

function requireInitialNode(
  templateId: string,
  id: string,
  position: { x: number; y: number },
): WorkflowNode {
  const node = createWorkflowNode(templateId, { id, position })

  if (!node) {
    throw new Error(`Missing workflow node template: ${templateId}`)
  }

  return node
}

const markerEnd = { type: MarkerType.ArrowClosed, color: '#4de082' }

const initialNodes: WorkflowNode[] = [
  requireInitialNode('workflow-start', 'targets', { x: 20, y: 230 }),
  requireInitialNode('start-osint-social', 'osint', { x: 270, y: 230 }),
  requireInitialNode('generate-scenario-osint', 'scenario', { x: 520, y: 230 }),
  requireInitialNode('create-campaign-email', 'email', { x: 770, y: 230 }),
  requireInitialNode('condition-email-opened', 'opened', { x: 1030, y: 230 }),
  requireInitialNode('create-campaign-sms', 'sms', { x: 1300, y: 80 }),
  requireInitialNode('add-target-high-risk', 'risk', { x: 1300, y: 380 }),
  requireInitialNode('start-awareness-basic', 'training', {
    x: 1560,
    y: 380,
  }),
  requireInitialNode('workflow-end', 'end', { x: 1820, y: 230 }),
]

const initialEdges: WorkflowEdge[] = [
  {
    id: 'targets-osint',
    source: 'targets',
    target: 'osint',
    markerEnd,
  },
  {
    id: 'osint-scenario',
    source: 'osint',
    target: 'scenario',
    markerEnd,
  },
  {
    id: 'scenario-email',
    source: 'scenario',
    target: 'email',
    markerEnd,
  },
  {
    id: 'email-opened',
    source: 'email',
    target: 'opened',
    markerEnd,
  },
  {
    id: 'opened-sms',
    source: 'opened',
    sourceHandle: 'no',
    target: 'sms',
    label: 'Non aperta',
    markerEnd,
    data: { branchId: 'no', branchType: 'else' },
  },
  {
    id: 'sms-end',
    source: 'sms',
    target: 'end',
    markerEnd,
  },
  {
    id: 'opened-risk',
    source: 'opened',
    sourceHandle: 'yes',
    target: 'risk',
    label: 'Aperta',
    markerEnd,
    data: { branchId: 'yes', branchType: 'rule' },
  },
  {
    id: 'risk-training',
    source: 'risk',
    target: 'training',
    markerEnd,
  },
  {
    id: 'training-end',
    source: 'training',
    target: 'end',
    markerEnd,
  },
]

export const exampleWorkflowDraft: WorkflowDraft = {
  id: 'workflow-phishing-q3',
  version: 1,
  status: 'draft',
  metadata: {
    name: 'Campagna Q3 — Sicurezza email',
    description: 'Simulazione multicanale per i target del terzo trimestre.',
    category: 'Simulazione phishing',
    targetGroupId: 'target-group-q3',
  },
  nodes: initialNodes,
  edges: initialEdges,
}

export const emptyWorkflowDraft: WorkflowDraft = {
  id: 'workflow-new',
  version: 1,
  status: 'draft',
  metadata: {
    name: '',
    description: '',
    category: 'Simulazione phishing',
  },
  nodes: [],
  edges: [],
}

let emptyWorkflowSequence = 0

export function createEmptyWorkflowDraft() {
  emptyWorkflowSequence += 1

  return {
    ...structuredClone(emptyWorkflowDraft),
    id: `workflow-new-${Date.now()}-${emptyWorkflowSequence}`,
  }
}
