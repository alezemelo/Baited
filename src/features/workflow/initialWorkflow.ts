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
  requireInitialNode('create-campaign-email', 'email', { x: 270, y: 230 }),
  requireInitialNode('condition-email-opened', 'opened', { x: 530, y: 230 }),
  requireInitialNode('create-campaign-sms', 'sms', { x: 800, y: 80 }),
  requireInitialNode('add-target-high-risk', 'risk', { x: 800, y: 380 }),
  requireInitialNode('start-awareness-basic', 'training', {
    x: 1060,
    y: 380,
  }),
  requireInitialNode('workflow-end', 'end', { x: 1320, y: 230 }),
]

const initialEdges: WorkflowEdge[] = [
  {
    id: 'targets-email',
    source: 'targets',
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

export const initialWorkflowDraft: WorkflowDraft = {
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
