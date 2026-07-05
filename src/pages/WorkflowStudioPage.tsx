import { AppHeader } from '../components/layout/AppHeader'
import { SideNavigation } from '../components/layout/SideNavigation'
import { NodeLibrary } from '../components/workflow/NodeLibrary'
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas'
import { WorkflowProvider } from '../components/workflow/WorkflowProvider'
import { nodeLibraryBlocks } from '../features/workflow/catalog'
import { useWorkflow } from '../features/workflow/WorkflowContext'

export function WorkflowStudioPage() {
  return (
    <WorkflowProvider>
      <WorkflowStudioContent />
    </WorkflowProvider>
  )
}

function WorkflowStudioContent() {
  const { draft } = useWorkflow()

  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category={draft.metadata.category}
        status="Attivo"
        title={draft.metadata.name}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <NodeLibrary blocks={nodeLibraryBlocks} />
        <WorkflowCanvas />
      </div>
    </main>
  )
}
