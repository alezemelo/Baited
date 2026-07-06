import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  WizardProgress,
  type WorkflowWizardStep,
} from './WizardProgress'

const steps: readonly WorkflowWizardStep[] = [
  { id: 'details', label: 'Dettagli', description: 'Nome e target' },
  { id: 'workflow', label: 'Workflow', description: 'Costruisci il grafo' },
  { id: 'review', label: 'Revisione', description: 'Controlla e salva' },
]

describe('WizardProgress', () => {
  it('renders only the step navigation controls', () => {
    const props = {
      highestVisitedIndex: 2,
      onStepChange: vi.fn(),
      steps,
    }
    const { rerender } = render(
      <WizardProgress {...props} currentStep="details" />,
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Vai allo step Dettagli' }),
    ).toHaveAttribute('aria-current', 'step')

    rerender(<WizardProgress {...props} currentStep="workflow" />)
    expect(
      screen.getByRole('button', { name: 'Vai allo step Workflow' }),
    ).toHaveAttribute('aria-current', 'step')

    rerender(<WizardProgress {...props} currentStep="review" />)
    expect(
      screen.getByRole('button', { name: 'Vai allo step Revisione' }),
    ).toHaveAttribute('aria-current', 'step')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
