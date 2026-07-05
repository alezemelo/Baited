import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  type Edge,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { CanvasActionBar } from './CanvasActionBar'
import { WorkflowNodeCard } from './WorkflowNodeCard'

const nodeTypes: NodeTypes = {
  baitedWorkflow: WorkflowNodeCard,
}

const defaultEdgeOptions: Partial<Edge> = {
  type: 'default',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#4de082' },
}

export function WorkflowCanvas() {
  const {
    applyEdgesChange,
    applyNodesChange,
    connectNodes,
    draft,
    edges,
    nodes,
    selectNode,
  } = useWorkflow()

  return (
    <section
      aria-label="Canvas workflow"
      className="relative min-w-0 flex-1 bg-surface-lowest"
    >
      <ReactFlow
        defaultEdgeOptions={defaultEdgeOptions}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        maxZoom={1.5}
        minZoom={0.4}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onConnect={connectNodes}
        onEdgesChange={applyEdgesChange}
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
