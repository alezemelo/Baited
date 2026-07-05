import type { Edge, Node, XYPosition } from '@xyflow/react'

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
  | 'workflow_start'
  | 'create_campaign'
  | 'start_awareness_campaign'
  | 'add_target_to_group'
  | 'start_osint_on_targets'
  | 'condition'
  | 'workflow_end'

export type WorkflowNodeStatus = 'pronto' | 'attivo' | 'bozza'
export type CampaignChannel = 'email' | 'sms' | 'im'
export type OsintType = 'social' | 'company' | 'domain'
export type ConditionField =
  | 'email_opened'
  | 'link_clicked'
  | 'credentials_submitted'
  | 'campaign_status'
export type ConditionOperator = 'equals' | 'not_equals'

export interface WorkflowMetadata {
  name: string
  description: string
  category: string
  targetGroupId?: string
}

export interface ConditionRule {
  id: string
  label: string
  field: ConditionField
  operator: ConditionOperator
  value: boolean | string
}

export interface WorkflowStartConfig {
  targetsIncluded: string[]
}

export interface CreateCampaignConfig {
  campaignId: string
  channel: CampaignChannel
  elapsedTimeMinutes: number
  targetsIncluded: string[]
}

export interface StartAwarenessCampaignConfig {
  campaignId: string
  elapsedTimeMinutes: number
  targetsIncluded: string[]
}

export interface AddTargetToGroupConfig {
  groupId: string
  targets: string[]
}

export interface StartOsintOnTargetsConfig {
  targets: string[]
  type: OsintType
}

export interface ConditionConfig {
  rules: ConditionRule[]
  elseBranch: {
    id: string
    label: string
  }
}

export interface WorkflowEndConfig {
  outcome: 'completed' | 'high_risk' | 'stopped'
}

interface WorkflowNodeBase extends Record<string, unknown> {
  label: string
  subtitle: string
  category: string
  icon: WorkflowIconName
  status?: WorkflowNodeStatus
}

export interface WorkflowStartNodeData extends WorkflowNodeBase {
  kind: 'workflow_start'
  config: WorkflowStartConfig
}

export interface CreateCampaignNodeData extends WorkflowNodeBase {
  kind: 'create_campaign'
  config: CreateCampaignConfig
}

export interface StartAwarenessCampaignNodeData extends WorkflowNodeBase {
  kind: 'start_awareness_campaign'
  config: StartAwarenessCampaignConfig
}

export interface AddTargetToGroupNodeData extends WorkflowNodeBase {
  kind: 'add_target_to_group'
  config: AddTargetToGroupConfig
}

export interface StartOsintOnTargetsNodeData extends WorkflowNodeBase {
  kind: 'start_osint_on_targets'
  config: StartOsintOnTargetsConfig
}

export interface ConditionNodeData extends WorkflowNodeBase {
  kind: 'condition'
  config: ConditionConfig
}

export interface WorkflowEndNodeData extends WorkflowNodeBase {
  kind: 'workflow_end'
  config: WorkflowEndConfig
}

export type WorkflowNodeData =
  | WorkflowStartNodeData
  | CreateCampaignNodeData
  | StartAwarenessCampaignNodeData
  | AddTargetToGroupNodeData
  | StartOsintOnTargetsNodeData
  | ConditionNodeData
  | WorkflowEndNodeData

export interface WorkflowEdgeData extends Record<string, unknown> {
  branchId?: string
  branchType?: 'rule' | 'else'
}

export type WorkflowNode = Node<WorkflowNodeData, 'baitedWorkflow'>
export type WorkflowEdge = Edge<WorkflowEdgeData>

export interface WorkflowDraft {
  id: string
  version: 1
  status: 'draft'
  metadata: WorkflowMetadata
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface NodeLibraryBlock {
  id: string
  label: string
  description: string
  category: string
  icon: WorkflowIconName
  kind: WorkflowNodeKind
}

export interface NodeConnectionRules {
  allowIncoming: boolean
  allowOutgoing: boolean
  maxIncoming: number | null
  maxOutgoing: number | null
}

export type WorkflowNodeCatalogItem = {
  [Kind in WorkflowNodeKind]: {
    id: string
    kind: Kind
    label: string
    description: string
    category: string
    icon: WorkflowIconName
    availableInLibrary: boolean
    connectionRules: NodeConnectionRules
    defaultData: Extract<WorkflowNodeData, { kind: Kind }>
  }
}[WorkflowNodeKind]

export interface CreateWorkflowNodeOptions {
  id?: string
  position?: XYPosition
}
