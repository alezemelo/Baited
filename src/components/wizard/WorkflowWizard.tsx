import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { nodeLibraryBlocks } from '../../features/workflow/catalog'
import { useWorkflow } from '../../features/workflow/WorkflowContext'
import { NodeLibrary } from '../workflow/NodeLibrary'
import { WorkflowCanvas } from '../workflow/WorkflowCanvas'
import { WorkflowPropertiesPanel } from '../workflow/WorkflowPropertiesPanel'
import { WorkflowDetailsStep } from './WorkflowDetailsStep'
import { WorkflowReviewStep } from './WorkflowReviewStep'
import {
  WizardProgress,
  type WorkflowWizardStep,
  type WorkflowWizardStepId,
} from './WizardProgress'

const steps: readonly WorkflowWizardStep[] = [
  {
    id: 'details',
    label: 'Dettagli',
    description: 'Nome e target',
  },
  {
    id: 'workflow',
    label: 'Workflow',
    description: 'Costruisci il grafo',
  },
  {
    id: 'review',
    label: 'Revisione',
    description: 'Controlla e salva',
  },
]

export function WorkflowWizard() {
  const { draft } = useWorkflow()
  const [currentStep, setCurrentStep] =
    useState<WorkflowWizardStepId>('details')
  const [highestVisitedIndex, setHighestVisitedIndex] = useState(0)
  const [nameError, setNameError] = useState<string>()
  const [pendingLibraryBlockId, setPendingLibraryBlockId] =
    useState<string | null>(null)
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  useEffect(() => {
    const clearPendingLibraryBlock = () => setPendingLibraryBlockId(null)

    window.addEventListener('mouseup', clearPendingLibraryBlock)

    return () => {
      window.removeEventListener('mouseup', clearPendingLibraryBlock)
    }
  }, [])

  const goToStep = (step: WorkflowWizardStepId) => {
    const targetIndex = steps.findIndex((candidate) => candidate.id === step)

    if (targetIndex <= highestVisitedIndex) {
      setCurrentStep(step)
    }
  }

  const goForward = () => {
    if (currentStep === 'details' && !draft.metadata.name.trim()) {
      setNameError('Inserisci un nome per continuare al workflow.')
      return
    }

    const nextIndex = Math.min(currentIndex + 1, steps.length - 1)
    setHighestVisitedIndex((visitedIndex) =>
      Math.max(visitedIndex, nextIndex),
    )
    setCurrentStep(steps[nextIndex].id)
  }

  const goBack = () => {
    const previousIndex = Math.max(currentIndex - 1, 0)
    setCurrentStep(steps[previousIndex].id)
  }

  return (
    <section
      aria-label="Creazione workflow"
      className="flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      <WizardProgress
        currentStep={currentStep}
        highestVisitedIndex={highestVisitedIndex}
        onStepChange={goToStep}
        steps={steps}
      />

      <div className="flex min-h-0 flex-1">
        {currentStep === 'details' ? (
          <WorkflowDetailsStep
            nameError={nameError}
            onNameInput={() => setNameError(undefined)}
          />
        ) : null}

        {currentStep === 'workflow' ? (
          <>
            <NodeLibrary
              blocks={nodeLibraryBlocks}
              onBlockDragEnd={() => setPendingLibraryBlockId(null)}
              onBlockDragStart={setPendingLibraryBlockId}
            />
            <WorkflowCanvas
              onPendingNodeDrop={() => setPendingLibraryBlockId(null)}
              pendingTemplateId={pendingLibraryBlockId}
            />
            <WorkflowPropertiesPanel />
          </>
        ) : null}

        {currentStep === 'review' ? <WorkflowReviewStep /> : null}
      </div>

      <footer className="flex h-16 shrink-0 items-center justify-between border-t border-white/10 bg-surface-low px-6">
        <button
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={currentIndex === 0}
          onClick={goBack}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Indietro
        </button>

        <p className="hidden font-label text-[10px] text-on-surface-muted md:block">
          Le modifiche restano nel draft durante tutti gli step.
        </p>

        {currentIndex < steps.length - 1 ? (
          <button
            className="flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
            onClick={goForward}
            type="button"
          >
            {currentStep === 'details' ? 'Apri workflow' : 'Vai alla revisione'}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </button>
        ) : (
          <span className="rounded-lg border border-secondary/25 bg-secondary/10 px-4 py-2 font-label text-xs font-medium text-secondary">
            Pronto per il salvataggio
          </span>
        )}
      </footer>
    </section>
  )
}
