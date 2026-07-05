import { getWorkflowNodeConnectionRules } from '../catalog'
import type {
  ConditionNodeData,
  WorkflowDraft,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from '../types'
import {
  findCycleNodeIds,
  getNodeIdsThatCanReachTargets,
  getReachableNodeIds,
} from './graph'

export type WorkflowValidationCode =
  | 'cycle_detected'
  | 'dangling_condition_branch'
  | 'duplicate_edge'
  | 'invalid_connection'
  | 'missing_condition_branch'
  | 'missing_end'
  | 'missing_required_field'
  | 'missing_start'
  | 'multiple_start'
  | 'orphan_node'
  | 'self_loop'
  | 'unterminated_path'
  | 'unreachable_node'

export interface WorkflowValidationIssue {
  code: WorkflowValidationCode
  message: string
  severity: 'error'
  nodeId?: string
  edgeId?: string
  branchId?: string
  field?: string
}

export interface WorkflowValidationResult {
  isValid: boolean
  issues: WorkflowValidationIssue[]
}

interface RequiredFieldError {
  field: string
  message: string
  branchId?: string
}

export function validateWorkflow(
  draft: WorkflowDraft,
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = []
  const nodesById = new Map(draft.nodes.map((node) => [node.id, node]))
  const incomingCounts = new Map<string, number>()
  const outgoingCounts = new Map<string, number>()
  const startNodes = draft.nodes.filter(
    (node) => node.data.kind === 'workflow_start',
  )
  const endNodes = draft.nodes.filter(
    (node) => node.data.kind === 'workflow_end',
  )

  draft.nodes.forEach((node) => {
    incomingCounts.set(node.id, 0)
    outgoingCounts.set(node.id, 0)
  })

  draft.edges.forEach((edge) => {
    if (nodesById.has(edge.target)) {
      incomingCounts.set(edge.target, (incomingCounts.get(edge.target) ?? 0) + 1)
    }

    if (nodesById.has(edge.source)) {
      outgoingCounts.set(edge.source, (outgoingCounts.get(edge.source) ?? 0) + 1)
    }
  })

  validateStartAndEnd(startNodes, endNodes, issues)
  validateEdges(draft.edges, nodesById, issues)
  validateConnectionLimits(draft.nodes, incomingCounts, outgoingCounts, issues)
  validateConditionBranches(draft.nodes, draft.edges, issues)
  validateReachability(draft.nodes, draft.edges, startNodes, incomingCounts, issues)
  validateTerminalPaths(draft.nodes, draft.edges, startNodes, endNodes, issues)
  validateCycles(draft.nodes, draft.edges, issues)
  validateRequiredFields(draft.nodes, issues)

  return {
    isValid: issues.length === 0,
    issues,
  }
}

function validateTerminalPaths(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  startNodes: WorkflowNode[],
  endNodes: WorkflowNode[],
  issues: WorkflowValidationIssue[],
) {
  if (startNodes.length !== 1 || endNodes.length === 0) {
    return
  }

  const reachableNodeIds = getReachableNodeIds(
    nodes,
    edges,
    startNodes.map((node) => node.id),
  )
  const nodeIdsThatCanReachEnd = getNodeIdsThatCanReachTargets(
    nodes,
    edges,
    endNodes.map((node) => node.id),
  )

  nodes.forEach((node) => {
    if (
      node.data.kind !== 'workflow_end' &&
      reachableNodeIds.has(node.id) &&
      !nodeIdsThatCanReachEnd.has(node.id)
    ) {
      issues.push({
        code: 'unterminated_path',
        message: `${node.data.label} non conduce ad alcun nodo end.`,
        nodeId: node.id,
        severity: 'error',
      })
    }
  })
}

function validateStartAndEnd(
  startNodes: WorkflowNode[],
  endNodes: WorkflowNode[],
  issues: WorkflowValidationIssue[],
) {
  if (startNodes.length === 0) {
    issues.push({
      code: 'missing_start',
      message: 'Il workflow deve avere un nodo start.',
      severity: 'error',
    })
  }

  if (startNodes.length > 1) {
    startNodes.forEach((node) => {
      issues.push({
        code: 'multiple_start',
        message: 'È consentito un solo nodo start nel workflow.',
        nodeId: node.id,
        severity: 'error',
      })
    })
  }

  if (endNodes.length === 0) {
    issues.push({
      code: 'missing_end',
      message: 'Il workflow deve avere almeno un nodo end.',
      severity: 'error',
    })
  }
}

function validateEdges(
  edges: WorkflowEdge[],
  nodesById: Map<string, WorkflowNode>,
  issues: WorkflowValidationIssue[],
) {
  const edgeKeys = new Map<string, WorkflowEdge>()

  edges.forEach((edge) => {
    const sourceNode = nodesById.get(edge.source)
    const targetNode = nodesById.get(edge.target)

    if (!sourceNode || !targetNode) {
      issues.push({
        code: 'invalid_connection',
        edgeId: edge.id,
        message: 'La connessione punta a un nodo non presente nel workflow.',
        severity: 'error',
      })
      return
    }

    if (edge.source === edge.target) {
      issues.push({
        code: 'self_loop',
        edgeId: edge.id,
        message: 'Un nodo non può essere collegato a sé stesso.',
        nodeId: edge.source,
        severity: 'error',
      })
    }

    const sourceRules = getWorkflowNodeConnectionRules(sourceNode.data.kind)
    const targetRules = getWorkflowNodeConnectionRules(targetNode.data.kind)

    if (!sourceRules?.allowOutgoing || !targetRules?.allowIncoming) {
      issues.push({
        code: 'invalid_connection',
        edgeId: edge.id,
        message: 'La connessione viola le regole di ingresso/uscita dei nodi.',
        nodeId: !sourceRules?.allowOutgoing ? sourceNode.id : targetNode.id,
        severity: 'error',
      })
    }

    const edgeKey = [
      edge.source,
      edge.sourceHandle ?? '',
      edge.target,
      edge.targetHandle ?? '',
    ].join('::')
    const duplicateEdge = edgeKeys.get(edgeKey)

    if (duplicateEdge) {
      issues.push({
        code: 'duplicate_edge',
        edgeId: edge.id,
        message: 'Questa connessione è duplicata.',
        nodeId: edge.source,
        severity: 'error',
      })
    } else {
      edgeKeys.set(edgeKey, edge)
    }
  })
}

function validateConnectionLimits(
  nodes: WorkflowNode[],
  incomingCounts: Map<string, number>,
  outgoingCounts: Map<string, number>,
  issues: WorkflowValidationIssue[],
) {
  nodes.forEach((node) => {
    const rules = getWorkflowNodeConnectionRules(node.data.kind)

    if (!rules) {
      return
    }

    const incomingCount = incomingCounts.get(node.id) ?? 0
    const outgoingCount = outgoingCounts.get(node.id) ?? 0

    if (rules.maxIncoming !== null && incomingCount > rules.maxIncoming) {
      issues.push({
        code: 'invalid_connection',
        message: `${node.data.label} accetta al massimo ${rules.maxIncoming} connessioni in ingresso.`,
        nodeId: node.id,
        severity: 'error',
      })
    }

    if (rules.maxOutgoing !== null && outgoingCount > rules.maxOutgoing) {
      issues.push({
        code: 'invalid_connection',
        message: `${node.data.label} accetta al massimo ${rules.maxOutgoing} connessioni in uscita.`,
        nodeId: node.id,
        severity: 'error',
      })
    }
  })
}

function validateConditionBranches(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  issues: WorkflowValidationIssue[],
) {
  nodes.forEach((node) => {
    if (node.data.kind !== 'condition') {
      return
    }

    const branches = getConditionBranches(node.data)
    const branchIds = new Set(branches.map((branch) => branch.id))
    const conditionEdges = edges.filter((edge) => edge.source === node.id)

    conditionEdges.forEach((edge) => {
      if (!edge.sourceHandle || !branchIds.has(edge.sourceHandle)) {
        issues.push({
          branchId: edge.sourceHandle ?? undefined,
          code: 'dangling_condition_branch',
          edgeId: edge.id,
          message: 'La connessione usa un branch non più presente nella condizione.',
          nodeId: node.id,
          severity: 'error',
        })
        return
      }

      if (
        edge.data?.branchId &&
        edge.data.branchId !== edge.sourceHandle
      ) {
        issues.push({
          branchId: edge.sourceHandle,
          code: 'dangling_condition_branch',
          edgeId: edge.id,
          message: 'La connessione ha metadati branch non allineati al suo handle.',
          nodeId: node.id,
          severity: 'error',
        })
      }
    })

    branches.forEach((branch) => {
      const branchEdges = conditionEdges.filter(
        (edge) => edge.sourceHandle === branch.id,
      )

      if (branchEdges.length === 0) {
        issues.push({
          branchId: branch.id,
          code: 'missing_condition_branch',
          message: `Il branch "${branch.label || branch.id}" non ha una connessione in uscita.`,
          nodeId: node.id,
          severity: 'error',
        })
      }

      if (branchEdges.length > 1) {
        issues.push({
          branchId: branch.id,
          code: 'invalid_connection',
          edgeId: branchEdges[1].id,
          message: `Il branch "${branch.label || branch.id}" ha più connessioni in uscita.`,
          nodeId: node.id,
          severity: 'error',
        })
      }
    })
  })
}

function validateReachability(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  startNodes: WorkflowNode[],
  incomingCounts: Map<string, number>,
  issues: WorkflowValidationIssue[],
) {
  nodes.forEach((node) => {
    const incomingCount = incomingCounts.get(node.id) ?? 0

    if (node.data.kind !== 'workflow_start' && incomingCount === 0) {
      issues.push({
        code: 'orphan_node',
        message: `${node.data.label} non ha connessioni in ingresso.`,
        nodeId: node.id,
        severity: 'error',
      })
    }
  })

  if (startNodes.length !== 1) {
    return
  }

  const reachableNodeIds = getReachableNodeIds(
    nodes,
    edges,
    startNodes.map((node) => node.id),
  )

  nodes.forEach((node) => {
    if (!reachableNodeIds.has(node.id)) {
      issues.push({
        code: 'unreachable_node',
        message: `${node.data.label} non è raggiungibile dallo start.`,
        nodeId: node.id,
        severity: 'error',
      })
    }
  })
}

function validateCycles(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  issues: WorkflowValidationIssue[],
) {
  findCycleNodeIds(nodes, edges).forEach((nodeId) => {
    issues.push({
      code: 'cycle_detected',
      message: 'Il workflow deve restare aciclico: questo nodo partecipa a un ciclo.',
      nodeId,
      severity: 'error',
    })
  })
}

function validateRequiredFields(
  nodes: WorkflowNode[],
  issues: WorkflowValidationIssue[],
) {
  nodes.forEach((node) => {
    validateWorkflowNodeData(node.data).forEach((error) => {
      issues.push({
        branchId: error.branchId,
        code: 'missing_required_field',
        field: error.field,
        message: error.message,
        nodeId: node.id,
        severity: 'error',
      })
    })
  })
}

export function validateWorkflowNodeData(
  data: WorkflowNodeData,
): RequiredFieldError[] {
  const errors: RequiredFieldError[] = []

  if (!data.label.trim()) {
    errors.push({
      field: 'label',
      message: 'Etichetta nodo obbligatoria.',
    })
  }

  if (
    data.kind === 'workflow_start' &&
    data.config.targetsIncluded.length === 0
  ) {
    errors.push({
      field: 'targetsIncluded',
      message: 'Seleziona almeno un gruppo target per lo start.',
    })
  }

  if (data.kind === 'create_campaign') {
    if (!data.config.campaignId) {
      errors.push({
        field: 'campaignId',
        message: 'Seleziona una campagna.',
      })
    }

    if (data.config.targetsIncluded.length === 0) {
      errors.push({
        field: 'targetsIncluded',
        message: 'Seleziona almeno un gruppo target per la campagna.',
      })
    }
  }

  if (data.kind === 'start_awareness_campaign') {
    if (!data.config.campaignId) {
      errors.push({
        field: 'campaignId',
        message: 'Seleziona un percorso awareness.',
      })
    }

    if (data.config.targetsIncluded.length === 0) {
      errors.push({
        field: 'targetsIncluded',
        message: 'Seleziona almeno un gruppo target per il training.',
      })
    }
  }

  if (data.kind === 'add_target_to_group' && !data.config.groupId) {
    errors.push({
      field: 'groupId',
      message: 'Seleziona il gruppo destinazione.',
    })
  }

  if (
    data.kind === 'start_osint_on_targets' &&
    data.config.targets.length === 0
  ) {
    errors.push({
      field: 'targets',
      message: 'Seleziona almeno un target da analizzare.',
    })
  }

  if (data.kind === 'condition') {
    if (data.config.rules.length === 0) {
      errors.push({
        field: 'rules',
        message: 'La condizione deve avere almeno un branch if.',
      })
    }

    data.config.rules.forEach((rule) => {
      if (!rule.label.trim()) {
        errors.push({
          branchId: rule.id,
          field: `rule.${rule.id}.label`,
          message: 'Ogni branch condizionale deve avere una label.',
        })
      }
    })

    if (!data.config.elseBranch.label.trim()) {
      errors.push({
        branchId: data.config.elseBranch.id,
        field: 'elseBranch.label',
        message: 'Il branch else deve avere una label.',
      })
    }
  }

  return errors
}

function getConditionBranches(data: ConditionNodeData) {
  return [
    ...data.config.rules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      type: 'rule' as const,
    })),
    {
      id: data.config.elseBranch.id,
      label: data.config.elseBranch.label,
      type: 'else' as const,
    },
  ]
}
