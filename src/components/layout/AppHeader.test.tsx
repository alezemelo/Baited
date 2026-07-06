import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppHeader } from './AppHeader'

describe('AppHeader', () => {
  it('uses the Baited wordmark as its accessible page heading', () => {
    render(
      <AppHeader
        activeTab="Editor"
        category="Simulazione phishing"
        hasUnsavedChanges={false}
        onNewWorkflow={vi.fn()}
        status="Draft allineato"
      />,
    )

    const heading = screen.getByRole('heading', { level: 1 })
    const logo = screen.getByRole('img', { name: 'Baited' })

    expect(heading).toContainElement(logo)
    expect(logo).toHaveAttribute('src', '/baited-logo.svg')
  })
})
