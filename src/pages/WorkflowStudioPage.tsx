import { AppHeader } from '../components/layout/AppHeader'
import { SideNavigation } from '../components/layout/SideNavigation'
import { NodeLibrary } from '../components/workflow/NodeLibrary'
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas'
import { nodeLibraryBlocks } from '../features/workflow/demoWorkflow'

export function WorkflowStudioPage() {
  return (
    <main className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <AppHeader
        activeTab="Editor"
        category="Simulazione phishing"
        status="Attivo"
        title="Campagna Q3 — Sicurezza email"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />
        <NodeLibrary blocks={nodeLibraryBlocks} />
        <WorkflowCanvas />
      </div>
    </main>
  )
}
