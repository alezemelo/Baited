import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { nodeLibraryBlocks } from '../../features/workflow/catalog'
import { NodeLibrary } from './NodeLibrary'

describe('NodeLibrary', () => {
  it('adds a block when its button is activated from the keyboard', async () => {
    const user = userEvent.setup()
    const onBlockAdd = vi.fn()

    render(
      <NodeLibrary
        blocks={nodeLibraryBlocks}
        onBlockAdd={onBlockAdd}
        onBlockDragEnd={vi.fn()}
        onBlockDragStart={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Aggiungi Target selezionati al canvas',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Aggiungi Fine workflow al canvas',
      }),
    ).toBeInTheDocument()

    const addOsint = screen.getByRole('button', {
      name: 'Aggiungi Analisi OSINT al canvas',
    })

    addOsint.focus()
    await user.keyboard('{Enter}')

    expect(onBlockAdd).toHaveBeenCalledWith('start-osint-social')

    const addScenario = screen.getByRole('button', {
      name: 'Aggiungi Genera scenario OSINT al canvas',
    })
    addScenario.focus()
    await user.keyboard('{Enter}')

    expect(onBlockAdd).toHaveBeenCalledWith('generate-scenario-osint')
  })
})
