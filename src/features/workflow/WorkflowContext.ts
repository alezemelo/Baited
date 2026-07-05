import {
  createContext,
  useContext,
} from 'react'
import type {
  Connection,
  EdgeChange,
  NodeChange,
  XYPosition,
} from '@xyflow/react'
import type {
  WorkflowDraft,
  WorkflowEdge,
  WorkflowMetadata,
  WorkflowNode,
  WorkflowNodeData,
} from './types'
import type {
  WorkflowValidationResult,
} from './validation/validateWorkflow'
import type { CreateWorkflowRequest } from './api/workflows'

export interface WorkflowContextValue {
  draft: WorkflowDraft
  validation: WorkflowValidationResult
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  selectedNode: WorkflowNode | null
  hasUnsavedChanges: boolean
  updateMetadata: (patch: Partial<WorkflowMetadata>) => void
  addNode: (templateId: string, position: XYPosition) => string | null
  updateNodeData: (
    nodeId: string,
    updater: (currentData: WorkflowNodeData) => WorkflowNodeData,
  ) => void
  removeNode: (nodeId: string) => void
  duplicateNode: (nodeId: string) => string | null
  connectNodes: (connection: Connection) => void
  applyNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  applyEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void
  selectNode: (nodeId: string | null) => void
  markWorkflowSaved: (request: CreateWorkflowRequest) => void
}

export const WorkflowContext = createContext<WorkflowContextValue | null>(null)

export function useWorkflow() {
  const context = useContext(WorkflowContext)

  if (!context) {
    throw new Error('useWorkflow must be used inside WorkflowProvider')
  }

  return context
}
