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
import {
  useCallback,
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
  } = useWorkflow()

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
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        maxZoom={1.5}
        minZoom={0.4}
        nodeTypes={nodeTypes}
        nodes={nodes}
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
              {draft.metadata.name}
            </p>
          </div>
        </Panel>
      </ReactFlow>
      <CanvasActionBar />
    </section>
  )
}
