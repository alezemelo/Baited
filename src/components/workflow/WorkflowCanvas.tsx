import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Sparkles } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
} from 'react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { CanvasActionBar } from './CanvasActionBar'
import {
  NODE_LIBRARY_DRAG_TYPE,
} from './NodeLibrary'
import { WorkflowNodeCard } from './WorkflowNodeCard'
import type {
  WorkflowEdge,
  WorkflowNode,
} from '../../features/workflow/types'

interface WorkflowCanvasProps {
  pendingTemplateId: string | null
  onPendingNodeDrop: () => void
}

const nodeTypes: NodeTypes = {
  baitedWorkflow: WorkflowNodeCard,
}

const defaultEdgeOptions: Partial<Edge> = {
  type: 'default',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#4de082' },
}

export function WorkflowCanvas({
  pendingTemplateId,
  onPendingNodeDrop,
}: WorkflowCanvasProps) {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<WorkflowNode, WorkflowEdge> | null>(null)
  const lastDropRef = useRef<{
    templateId: string
    x: number
    y: number
    timestamp: number
  } | null>(null)
  const {
    addNode,
    applyEdgesChange,
    applyNodesChange,
    connectNodes,
    draft,
    edges,
    nodes,
    selectNode,
    selectedNodeId,
    validation,
    loadExampleWorkflow,
  } = useWorkflow()
  const errorNodeIds = useMemo(
    () =>
      new Set(
        validation.issues
          .map((issue) => issue.nodeId)
          .filter((nodeId): nodeId is string => Boolean(nodeId)),
      ),
    [validation.issues],
  )
  const errorEdgeIds = useMemo(
    () =>
      new Set(
        validation.issues
          .map((issue) => issue.edgeId)
          .filter((edgeId): edgeId is string => Boolean(edgeId)),
      ),
    [validation.issues],
  )
  const visibleNodes = useMemo<WorkflowNode[]>(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          validationState: errorNodeIds.has(node.id) ? 'error' : undefined,
        },
      })),
    [errorNodeIds, nodes],
  )
  const visibleEdges = useMemo<WorkflowEdge[]>(
    () =>
      edges.map((edge) =>
        errorEdgeIds.has(edge.id)
          ? {
              ...edge,
              className: [edge.className, 'workflow-edge-error']
                .filter(Boolean)
                .join(' '),
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#f87171',
              },
            }
          : edge,
      ),
    [edges, errorEdgeIds],
  )

  useEffect(() => {
    if (!reactFlowInstance || !selectedNodeId) {
      return
    }

    const selectedNode = nodes.find((node) => node.id === selectedNodeId)

    if (!selectedNode) {
      return
    }

    void reactFlowInstance.setCenter(
      selectedNode.position.x + 105,
      selectedNode.position.y + 64,
      {
        duration: 420,
        zoom: 1,
      },
    )
  }, [nodes, reactFlowInstance, selectedNodeId])

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const addNodeAtClientPosition = useCallback(
    (templateId: string, clientX: number, clientY: number) => {
      if (!reactFlowInstance) {
        return
      }

      const now = Date.now()
      const lastDrop = lastDropRef.current

      if (
        lastDrop &&
        lastDrop.templateId === templateId &&
        Math.abs(lastDrop.x - clientX) < 8 &&
        Math.abs(lastDrop.y - clientY) < 8 &&
        now - lastDrop.timestamp < 250
      ) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      })

      addNode(templateId, position)
      lastDropRef.current = {
        templateId,
        x: clientX,
        y: clientY,
        timestamp: now,
      }
    },
    [addNode, reactFlowInstance],
  )

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const templateId =
        event.dataTransfer.getData(NODE_LIBRARY_DRAG_TYPE) || pendingTemplateId

      if (!templateId) {
        return
      }

      addNodeAtClientPosition(templateId, event.clientX, event.clientY)
      onPendingNodeDrop()
    },
    [addNodeAtClientPosition, onPendingNodeDrop, pendingTemplateId],
  )

  const handleMouseDrop = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!pendingTemplateId) {
        return
      }

      const target = event.target

      if (!(target instanceof Element) || !target.closest('.react-flow')) {
        return
      }

      addNodeAtClientPosition(
        pendingTemplateId,
        event.clientX,
        event.clientY,
      )
      onPendingNodeDrop()
    },
    [addNodeAtClientPosition, onPendingNodeDrop, pendingTemplateId],
  )

  return (
    <section
      aria-label="Canvas workflow"
      className="relative min-w-0 flex-1 bg-surface-lowest"
      onMouseUp={handleMouseDrop}
    >
      <ReactFlow<WorkflowNode, WorkflowEdge>
        defaultEdgeOptions={defaultEdgeOptions}
        edges={visibleEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        maxZoom={1.5}
        minZoom={0.4}
        nodeTypes={nodeTypes}
        nodes={visibleNodes}
        onConnect={connectNodes}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onEdgesChange={applyEdgesChange}
        onInit={setReactFlowInstance}
        onNodeClick={(_, node) => selectNode(node.id)}
        onNodesChange={applyNodesChange}
        onPaneClick={() => selectNode(null)}
      >
        <Background
          color="rgba(255, 255, 255, 0.18)"
          gap={24}
          size={1.4}
          variant={BackgroundVariant.Dots}
        />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          maskColor="rgb(14 14 17 / 0.78)"
          nodeColor="rgb(77 224 130 / 0.45)"
          nodeStrokeColor="rgb(255 179 176 / 0.55)"
          pannable
          position="bottom-right"
          zoomable
        />
        <Panel className="m-4" position="top-left">
          <div className="rounded-xl border border-white/[0.07] bg-surface-container/75 px-3 py-2 shadow-[0_8px_24px_rgb(0_0_0/0.18)] backdrop-blur-xl">
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-secondary">
              Workflow attivo
            </p>
            <p className="mt-0.5 text-xs font-medium text-on-surface">
              {draft.metadata.name || 'Nuovo workflow'}
            </p>
            <p
              className={`mt-1 font-label text-[10px] ${
                validation.isValid ? 'text-secondary' : 'text-primary'
              }`}
            >
              {validation.isValid
                ? 'DAG valido'
                : `${validation.issues.length} errori da correggere`}
            </p>
          </div>
        </Panel>
        {nodes.length === 0 ? (
          <Panel className="m-0" position="top-center">
            <div className="mt-24 w-80 rounded-2xl border border-dashed border-white/15 bg-surface-container/90 p-6 text-center shadow-[0_16px_40px_rgb(0_0_0/0.24)] backdrop-blur-xl">
              <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-on-surface">
                Inizia dal nodo Start
              </h2>
              <p className="mt-2 text-xs leading-5 text-on-surface-muted">
                Aggiungi i blocchi dalla libreria e collegali per costruire il
                workflow da zero.
              </p>
              <button
                className="mt-4 rounded-lg border border-white/10 px-3 py-2 font-label text-xs text-on-surface-muted transition-colors hover:border-primary/35 hover:text-primary"
                onClick={loadExampleWorkflow}
                type="button"
              >
                Carica workflow di esempio
              </button>
            </div>
          </Panel>
        ) : null}
      </ReactFlow>
      <CanvasActionBar />
    </section>
  )
}
