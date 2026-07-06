import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'
import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createWorkflowNode,
  getWorkflowNodeConnectionRules,
} from '../../features/workflow/catalog'
import {
  loadLastSavedWorkflow,
  LAST_SAVED_WORKFLOW_KEY,
  restoreWorkflowDraft,
  serializeWorkflow,
  type CreateWorkflowRequest,
} from '../../features/workflow/api/workflows'
import {
  createEmptyWorkflowDraft,
  emptyWorkflowDraft,
  exampleWorkflowDraft,
} from '../../features/workflow/initialWorkflow'
import { wouldCreateCycle } from '../../features/workflow/validation/graph'
import { validateWorkflow } from '../../features/workflow/validation/validateWorkflow'
import {
  WorkflowContext,
  type WorkflowContextValue,
} from '../../features/workflow/WorkflowContext'
import type {
  WorkflowDraft,
  WorkflowEdge,
  WorkflowMetadata,
  WorkflowNode,
  WorkflowNodeData,
} from '../../features/workflow/types'

interface WorkflowProviderProps {
  children: ReactNode
  initialDraft?: WorkflowDraft
}

let generatedEdgeSequence = 0
let duplicatedNodeSequence = 0

function createEdgeId(source: string, target: string) {
  generatedEdgeSequence += 1
  return `${source}-${target}-${Date.now()}-${generatedEdgeSequence}`
}

function createDuplicatedNodeId(node: WorkflowNode) {
  duplicatedNodeSequence += 1
  return `${node.id}-copy-${Date.now()}-${duplicatedNodeSequence}`
}

function cloneDraft(draft: WorkflowDraft): WorkflowDraft {
  return structuredClone(draft)
}

export function WorkflowProvider({
  children,
  initialDraft,
}: WorkflowProviderProps) {
  const clonedInitialDraft = useMemo(
    () => cloneDraft(resolveInitialDraft(initialDraft)),
    [initialDraft],
  )
  const [metadata, setMetadata] = useState(clonedInitialDraft.metadata)
  const [nodes, setNodes] = useState(clonedInitialDraft.nodes)
  const [edges, setEdges] = useState(clonedInitialDraft.edges)
  const [draftIdentity, setDraftIdentity] = useState(() => ({
    id: clonedInitialDraft.id,
    status: clonedInitialDraft.status,
    version: clonedInitialDraft.version,
  }))
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [savedRequestSnapshot, setSavedRequestSnapshot] = useState(() =>
    JSON.stringify(serializeWorkflow(clonedInitialDraft)),
  )
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) ?? null
  const selectedEdge =
    edges.find((edge) => edge.id === selectedEdgeId) ?? null

  const updateMetadata = (patch: Partial<WorkflowMetadata>) => {
    setMetadata((currentMetadata) => ({ ...currentMetadata, ...patch }))
  }

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId)
    setNodes((currentNodes) => markSelectedNode(currentNodes, nodeId))
    setSelectedEdgeId(null)
    setEdges((currentEdges) => markSelectedEdge(currentEdges, null))
  }

  const selectEdge = (edgeId: string | null) => {
    setSelectedEdgeId(edgeId)
    setEdges((currentEdges) => markSelectedEdge(currentEdges, edgeId))
    setSelectedNodeId(null)
    setNodes((currentNodes) => markSelectedNode(currentNodes, null))
  }

  const addNode = (templateId: string, position: XYPosition) => {
    const node = createWorkflowNode(templateId, { position })

    if (!node) {
      return null
    }

    setSelectedNodeId(node.id)
    setSelectedEdgeId(null)
    setNodes((currentNodes) =>
      markSelectedNode([...currentNodes, node], node.id),
    )
    setEdges((currentEdges) => markSelectedEdge(currentEdges, null))
    return node.id
  }

  const updateNodeData = (
    nodeId: string,
    updater: (currentData: WorkflowNodeData) => WorkflowNodeData,
  ) => {
    const node = nodes.find((candidate) => candidate.id === nodeId)

    if (!node) {
      return
    }

    const nextData = updater(node.data)

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: nextData } : node,
      ),
    )
    setEdges((currentEdges) =>
      syncEdgesWithNodeData(currentEdges, nodeId, nextData),
    )
  }

  const removeNode = (nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeId),
    )
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    )
    setSelectedNodeId((currentSelection) =>
      currentSelection === nodeId ? null : currentSelection,
    )
    setSelectedEdgeId((currentSelection) => {
      const selectedEdge = edges.find((edge) => edge.id === currentSelection)

      if (
        selectedEdge &&
        (selectedEdge.source === nodeId || selectedEdge.target === nodeId)
      ) {
        return null
      }

      return currentSelection
    })
  }

  const removeEdge = (edgeId: string) => {
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== edgeId))
    setSelectedEdgeId((currentSelection) =>
      currentSelection === edgeId ? null : currentSelection,
    )
  }

  const reconnectEdge = (edge: WorkflowEdge, connection: Connection) => {
    if (!connection.source || !connection.target) {
      return
    }

    const currentEdge = edges.find((candidate) => candidate.id === edge.id)

    if (!currentEdge) {
      return
    }

    const candidateEdges = edges.filter(
      (candidate) => candidate.id !== currentEdge.id,
    )

    if (!canConnectNodes(connection, nodes, candidateEdges)) {
      return
    }

    const sourceNode = nodes.find((node) => node.id === connection.source)
    const branch = getConnectionBranch(sourceNode, connection.sourceHandle)

    setEdges((currentEdges) =>
      currentEdges.map((candidate) =>
        candidate.id === currentEdge.id
          ? {
              ...candidate,
              selected: true,
              source: connection.source,
              target: connection.target,
              sourceHandle: connection.sourceHandle,
              targetHandle: connection.targetHandle,
              label: branch?.label,
              data: branch
                ? { branchId: branch.id, branchType: branch.type }
                : undefined,
            }
          : candidate,
      ),
    )
    setSelectedEdgeId(edge.id)
    setSelectedNodeId(null)
    setNodes((currentNodes) => markSelectedNode(currentNodes, null))
  }

  const duplicateNode = (nodeId: string) => {
    const sourceNode = nodes.find((node) => node.id === nodeId)

    if (!sourceNode) {
      return null
    }

    const duplicate = createWorkflowNodeFromExisting(sourceNode)
    setSelectedNodeId(duplicate.id)
    setSelectedEdgeId(null)
    setNodes((currentNodes) =>
      markSelectedNode([...currentNodes, duplicate], duplicate.id),
    )
    setEdges((currentEdges) => markSelectedEdge(currentEdges, null))
    return duplicate.id
  }

  const connectNodes = (connection: Connection) => {
    if (
      !connection.source ||
      !connection.target ||
      !canConnectNodes(connection, nodes, edges)
    ) {
      return
    }

    const sourceNode = nodes.find((node) => node.id === connection.source)
    const branch = getConnectionBranch(sourceNode, connection.sourceHandle)
    const edge: WorkflowEdge = {
      id: createEdgeId(connection.source, connection.target),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'default',
      label: branch?.label,
      data: branch
        ? { branchId: branch.id, branchType: branch.type }
        : undefined,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4de082' },
    }

    setEdges((currentEdges) => addEdge(edge, currentEdges))
  }

  const applyNodesChange = (changes: NodeChange<WorkflowNode>[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes))
  }

  const applyEdgesChange = (changes: EdgeChange<WorkflowEdge>[]) => {
    const removedEdgeIds = new Set(
      changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id),
    )

    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges))
    setSelectedEdgeId((currentSelection) =>
      currentSelection && removedEdgeIds.has(currentSelection)
        ? null
        : currentSelection,
    )
  }

  const draft = useMemo<WorkflowDraft>(
    () => ({
      ...draftIdentity,
      metadata,
      nodes,
      edges,
    }),
    [draftIdentity, edges, metadata, nodes],
  )
  const validation = useMemo(() => validateWorkflow(draft), [draft])
  const currentRequestSnapshot = useMemo(
    () => JSON.stringify(serializeWorkflow(draft)),
    [draft],
  )
  const hasUnsavedChanges = currentRequestSnapshot !== savedRequestSnapshot
  const markWorkflowSaved = (request: CreateWorkflowRequest) => {
    setSavedRequestSnapshot(JSON.stringify(request))
  }
  const replaceDraft = (nextDraft: WorkflowDraft) => {
    const clonedDraft = cloneDraft(nextDraft)

    setDraftIdentity({
      id: clonedDraft.id,
      status: clonedDraft.status,
      version: clonedDraft.version,
    })
    setMetadata(clonedDraft.metadata)
    setNodes(clonedDraft.nodes)
    setEdges(clonedDraft.edges)
    setSelectedNodeId(null)
    setSelectedEdgeId(null)

    return clonedDraft
  }
  const startNewWorkflow = () => {
    const emptyDraft = replaceDraft(createEmptyWorkflowDraft())

    window.localStorage.removeItem(LAST_SAVED_WORKFLOW_KEY)
    setSavedRequestSnapshot(JSON.stringify(serializeWorkflow(emptyDraft)))
  }
  const loadExampleWorkflow = () => {
    replaceDraft({
      ...exampleWorkflowDraft,
      id: draftIdentity.id,
    })
  }

  const value: WorkflowContextValue = {
    draft,
    validation,
    nodes,
    edges,
    selectedNodeId,
    selectedNode,
    selectedEdgeId,
    selectedEdge,
    hasUnsavedChanges,
    updateMetadata,
    addNode,
    updateNodeData,
    removeNode,
    removeEdge,
    reconnectEdge,
    duplicateNode,
    connectNodes,
    applyNodesChange,
    applyEdgesChange,
    selectNode,
    selectEdge,
    markWorkflowSaved,
    startNewWorkflow,
    loadExampleWorkflow,
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

function resolveInitialDraft(initialDraft?: WorkflowDraft) {
  if (initialDraft) {
    return initialDraft
  }

  const savedWorkflow = loadLastSavedWorkflow(window.localStorage)

  return savedWorkflow
    ? restoreWorkflowDraft(savedWorkflow)
    : emptyWorkflowDraft
}

function createWorkflowNodeFromExisting(node: WorkflowNode): WorkflowNode {
  const duplicatedId = createDuplicatedNodeId(node)

  return {
    ...node,
    id: duplicatedId,
    selected: false,
    position: { x: node.position.x + 40, y: node.position.y + 40 },
    data: structuredClone(node.data),
  }
}

function getConnectionBranch(
  sourceNode: WorkflowNode | undefined,
  sourceHandle: string | null,
) {
  if (!sourceNode || sourceNode.data.kind !== 'condition' || !sourceHandle) {
    return null
  }

  const rule = sourceNode.data.config.rules.find(
    (conditionRule) => conditionRule.id === sourceHandle,
  )

  if (rule) {
    return { id: rule.id, label: rule.label, type: 'rule' as const }
  }

  if (sourceNode.data.config.elseBranch.id === sourceHandle) {
    return {
      id: sourceNode.data.config.elseBranch.id,
      label: sourceNode.data.config.elseBranch.label,
      type: 'else' as const,
    }
  }

  return null
}

function markSelectedNode(
  nodes: WorkflowNode[],
  selectedNodeId: string | null,
): WorkflowNode[] {
  return nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
  }))
}

function markSelectedEdge(
  edges: WorkflowEdge[],
  selectedEdgeId: string | null,
): WorkflowEdge[] {
  return edges.map((edge) => ({
    ...edge,
    selected: edge.id === selectedEdgeId,
  }))
}

function canConnectNodes(
  connection: Connection,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) {
  const sourceNode = nodes.find((node) => node.id === connection.source)
  const targetNode = nodes.find((node) => node.id === connection.target)

  if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
    return false
  }

  if (wouldCreateCycle(nodes, edges, connection)) {
    return false
  }

  const sourceRules = getWorkflowNodeConnectionRules(sourceNode.data.kind)
  const targetRules = getWorkflowNodeConnectionRules(targetNode.data.kind)

  if (
    !sourceRules?.allowOutgoing ||
    !targetRules?.allowIncoming
  ) {
    return false
  }

  const incomingCount = edges.filter(
    (edge) => edge.target === targetNode.id,
  ).length
  const outgoingCount = edges.filter(
    (edge) => edge.source === sourceNode.id,
  ).length
  const handleOutgoingCount = edges.filter(
    (edge) =>
      edge.source === sourceNode.id &&
      edge.sourceHandle === connection.sourceHandle,
  ).length

  if (
    targetRules.maxIncoming !== null &&
    incomingCount >= targetRules.maxIncoming
  ) {
    return false
  }

  if (
    sourceRules.maxOutgoing !== null &&
    outgoingCount >= sourceRules.maxOutgoing
  ) {
    return false
  }

  if (sourceNode.data.kind === 'condition' && handleOutgoingCount > 0) {
    return false
  }

  return !edges.some(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target &&
      edge.sourceHandle === connection.sourceHandle,
  )
}

function syncEdgesWithNodeData(
  edges: WorkflowEdge[],
  nodeId: string,
  data: WorkflowNodeData,
) {
  if (data.kind !== 'condition') {
    return edges
  }

  return edges.map((edge) => {
    if (edge.source !== nodeId || !edge.sourceHandle) {
      return edge
    }

    const rule = data.config.rules.find(
      (conditionRule) => conditionRule.id === edge.sourceHandle,
    )

    if (rule) {
      return {
        ...edge,
        label: rule.label,
        data: { branchId: rule.id, branchType: 'rule' as const },
      }
    }

    if (data.config.elseBranch.id === edge.sourceHandle) {
      return {
        ...edge,
        label: data.config.elseBranch.label,
        data: {
          branchId: data.config.elseBranch.id,
          branchType: 'else' as const,
        },
      }
    }

    return edge
  })
}
