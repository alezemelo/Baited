import type {
  WorkflowEdge,
  WorkflowNode,
} from '../types'

export interface WorkflowConnectionLike {
  source?: string | null
  sourceHandle?: string | null
  target?: string | null
  targetHandle?: string | null
}

export function buildAdjacency(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) {
  const adjacency = new Map<string, string[]>()
  const nodeIds = new Set(nodes.map((node) => node.id))

  nodes.forEach((node) => adjacency.set(node.id, []))

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return
    }

    adjacency.get(edge.source)?.push(edge.target)
  })

  return adjacency
}

export function buildReverseAdjacency(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) {
  const reverseAdjacency = new Map<string, string[]>()
  const nodeIds = new Set(nodes.map((node) => node.id))

  nodes.forEach((node) => reverseAdjacency.set(node.id, []))

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return
    }

    reverseAdjacency.get(edge.target)?.push(edge.source)
  })

  return reverseAdjacency
}

export function getReachableNodeIds(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  startNodeIds: string[],
) {
  const adjacency = buildAdjacency(nodes, edges)
  const reachableNodeIds = new Set<string>()
  const queue = [...startNodeIds]

  while (queue.length > 0) {
    const nodeId = queue.shift()

    if (!nodeId || reachableNodeIds.has(nodeId)) {
      continue
    }

    reachableNodeIds.add(nodeId)

    adjacency.get(nodeId)?.forEach((targetId) => {
      if (!reachableNodeIds.has(targetId)) {
        queue.push(targetId)
      }
    })
  }

  return reachableNodeIds
}

export function getNodeIdsThatCanReachTargets(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  targetNodeIds: string[],
) {
  const reverseAdjacency = buildReverseAdjacency(nodes, edges)
  const nodeIdsThatCanReachTargets = new Set<string>()
  const queue = [...targetNodeIds]

  while (queue.length > 0) {
    const nodeId = queue.shift()

    if (!nodeId || nodeIdsThatCanReachTargets.has(nodeId)) {
      continue
    }

    nodeIdsThatCanReachTargets.add(nodeId)

    reverseAdjacency.get(nodeId)?.forEach((sourceId) => {
      if (!nodeIdsThatCanReachTargets.has(sourceId)) {
        queue.push(sourceId)
      }
    })
  }

  return nodeIdsThatCanReachTargets
}

export function wouldCreateCycle(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  connection: WorkflowConnectionLike,
) {
  if (!connection.source || !connection.target) {
    return false
  }

  if (connection.source === connection.target) {
    return true
  }

  const adjacency = buildAdjacency(nodes, edges)
  adjacency.get(connection.source)?.push(connection.target)

  return hasPath(adjacency, connection.target, connection.source)
}

export function findCycleNodeIds(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) {
  const adjacency = buildAdjacency(nodes, edges)
  const visitedNodeIds = new Set<string>()
  const visitingNodeIds = new Set<string>()
  const cycleNodeIds = new Set<string>()
  const stack: string[] = []

  const visit = (nodeId: string) => {
    if (visitingNodeIds.has(nodeId)) {
      const cycleStartIndex = stack.indexOf(nodeId)

      if (cycleStartIndex >= 0) {
        stack.slice(cycleStartIndex).forEach((cycleNodeId) => {
          cycleNodeIds.add(cycleNodeId)
        })
      }

      return
    }

    if (visitedNodeIds.has(nodeId)) {
      return
    }

    visitingNodeIds.add(nodeId)
    stack.push(nodeId)

    adjacency.get(nodeId)?.forEach(visit)

    stack.pop()
    visitingNodeIds.delete(nodeId)
    visitedNodeIds.add(nodeId)
  }

  nodes.forEach((node) => visit(node.id))

  return cycleNodeIds
}

function hasPath(
  adjacency: Map<string, string[]>,
  startNodeId: string,
  targetNodeId: string,
) {
  const visitedNodeIds = new Set<string>()
  const queue = [startNodeId]

  while (queue.length > 0) {
    const nodeId = queue.shift()

    if (!nodeId || visitedNodeIds.has(nodeId)) {
      continue
    }

    if (nodeId === targetNodeId) {
      return true
    }

    visitedNodeIds.add(nodeId)

    adjacency.get(nodeId)?.forEach((nextNodeId) => {
      if (!visitedNodeIds.has(nextNodeId)) {
        queue.push(nextNodeId)
      }
    })
  }

  return false
}
