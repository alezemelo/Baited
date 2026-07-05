export type WorkflowIconName =
  | 'users'
  | 'mail'
  | 'branch'
  | 'message'
  | 'shield'
  | 'training'
  | 'flag'
  | 'search'

export type WorkflowNodeKind =
  | 'trigger'
  | 'campaign'
  | 'condition'
  | 'action'
  | 'training'
  | 'end'

export type WorkflowNodeStatus = 'pronto' | 'attivo' | 'bozza'

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string
  subtitle: string
  category: string
  icon: WorkflowIconName
  kind: WorkflowNodeKind
  status?: WorkflowNodeStatus
}

export interface NodeLibraryBlock {
  id: string
  label: string
  description: string
  category: string
  icon: WorkflowIconName
  kind: WorkflowNodeKind
}
