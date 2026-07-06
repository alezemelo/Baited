import { useEffect } from 'react'
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
  const { draft, hasUnsavedChanges, startNewWorkflow } = useWorkflow()
  const workflowTitle = draft.metadata.name.trim() || 'Nuovo workflow'

  const handleNewWorkflow = () => {
    if (
      hasUnsavedChanges &&
      !window.confirm('Creare un nuovo workflow? Le modifiche non salvate andranno perse.')
    ) {
      return
    }

    startNewWorkflow()
  }

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnAboutUnsavedChanges)

    return () => {
      window.removeEventListener('beforeunload', warnAboutUnsavedChanges)
    }
  }, [hasUnsavedChanges])

  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category={draft.metadata.category}
        hasUnsavedChanges={hasUnsavedChanges}
        onNewWorkflow={handleNewWorkflow}
        status={hasUnsavedChanges ? 'Modifiche non salvate' : 'Draft allineato'}
        title={workflowTitle}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <WorkflowWizard key={draft.id} />
      </div>
    </main>
  )
}
