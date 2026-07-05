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
import { createWorkflowNode } from '../../features/workflow/catalog'
import { initialWorkflowDraft } from '../../features/workflow/initialWorkflow'
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

function createEdgeId(source: string, target: string) {
  generatedEdgeSequence += 1
  return `${source}-${target}-${Date.now()}-${generatedEdgeSequence}`
}

function cloneDraft(draft: WorkflowDraft): WorkflowDraft {
  return structuredClone(draft)
}

export function WorkflowProvider({
  children,
  initialDraft = initialWorkflowDraft,
}: WorkflowProviderProps) {
  const clonedInitialDraft = useMemo(() => cloneDraft(initialDraft), [initialDraft])
  const [metadata, setMetadata] = useState(clonedInitialDraft.metadata)
  const [nodes, setNodes] = useState(clonedInitialDraft.nodes)
  const [edges, setEdges] = useState(clonedInitialDraft.edges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) ?? null

  const updateMetadata = (patch: Partial<WorkflowMetadata>) => {
    setMetadata((currentMetadata) => ({ ...currentMetadata, ...patch }))
  }

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId)
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        selected: node.id === nodeId,
      })),
    )
  }

  const addNode = (templateId: string, position: XYPosition) => {
    const node = createWorkflowNode(templateId, { position })

    if (!node) {
      return null
    }

    setNodes((currentNodes) => [...currentNodes, node])
    selectNode(node.id)
    return node.id
  }

  const updateNodeData = (
    nodeId: string,
    updater: (currentData: WorkflowNodeData) => WorkflowNodeData,
  ) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: updater(node.data) } : node,
      ),
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
  }

  const duplicateNode = (nodeId: string) => {
    const sourceNode = nodes.find((node) => node.id === nodeId)

    if (!sourceNode) {
      return null
    }

    const duplicate = createWorkflowNodeFromExisting(sourceNode)
    setNodes((currentNodes) => [...currentNodes, duplicate])
    selectNode(duplicate.id)
    return duplicate.id
  }

  const connectNodes = (connection: Connection) => {
    if (!connection.source || !connection.target) {
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
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges))
  }

  const draft = useMemo<WorkflowDraft>(
    () => ({
      ...clonedInitialDraft,
      metadata,
      nodes,
      edges,
    }),
    [clonedInitialDraft, edges, metadata, nodes],
  )

  const value: WorkflowContextValue = {
    draft,
    nodes,
    edges,
    selectedNodeId,
    selectedNode,
    updateMetadata,
    addNode,
    updateNodeData,
    removeNode,
    duplicateNode,
    connectNodes,
    applyNodesChange,
    applyEdgesChange,
    selectNode,
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

function createWorkflowNodeFromExisting(node: WorkflowNode): WorkflowNode {
  const duplicatedId = `${node.id}-copy-${Date.now()}`

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
