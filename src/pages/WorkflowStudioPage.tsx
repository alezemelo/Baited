import { AppHeader } from '../components/layout/AppHeader'
import { SideNavigation } from '../components/layout/SideNavigation'
import { WorkflowProvider } from '../components/workflow/WorkflowProvider'
import { WorkflowWizard } from '../components/wizard/WorkflowWizard'
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
  const workflowTitle = draft.metadata.name.trim() || 'Nuovo workflow'

  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category={draft.metadata.category}
        status="Attivo"
        title={workflowTitle}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <WorkflowWizard />
      </div>
    </main>
  )
}
