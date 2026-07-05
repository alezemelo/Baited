import { Check } from 'lucide-react'

export type WorkflowWizardStepId = 'details' | 'workflow' | 'review'

export interface WorkflowWizardStep {
  id: WorkflowWizardStepId
  label: string
  description: string
}

interface WizardProgressProps {
  steps: readonly WorkflowWizardStep[]
  currentStep: WorkflowWizardStepId
  highestVisitedIndex: number
  onStepChange: (step: WorkflowWizardStepId) => void
}

export function WizardProgress({
  steps,
  currentStep,
  highestVisitedIndex,
  onStepChange,
}: WizardProgressProps) {
  return (
    <nav
      aria-label="Avanzamento creazione workflow"
      className="shrink-0 border-b border-white/10 bg-surface-low px-6 py-3"
    >
      <ol className="mx-auto flex max-w-3xl items-center">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isComplete = index < highestVisitedIndex && !isCurrent
          const isReachable = index <= highestVisitedIndex

          return (
            <li className="flex flex-1 items-center last:flex-none" key={step.id}>
              <button
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Vai allo step ${step.label}`}
                className="group flex items-center gap-3 rounded-lg p-1 text-left disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!isReachable}
                onClick={() => onStepChange(step.id)}
                type="button"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border font-label text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgb(248_113_113/0.18)]'
                      : isComplete
                        ? 'border-secondary bg-secondary/10 text-secondary'
                        : 'border-white/15 bg-surface-container text-on-surface-muted'
                  }`}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:block">
                  <span
                    className={`block text-xs font-semibold ${
                      isCurrent ? 'text-on-surface' : 'text-on-surface-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 hidden font-label text-[9px] text-on-surface-muted lg:block">
                    {step.description}
                  </span>
                </span>
              </button>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`mx-3 h-px min-w-6 flex-1 ${
                    index < highestVisitedIndex ? 'bg-secondary/50' : 'bg-white/10'
                  }`}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
