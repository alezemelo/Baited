import { Plus, Workflow } from 'lucide-react'
import {
  useMemo,
  type DragEvent,
  type MouseEvent,
} from 'react'
import type { NodeLibraryBlock } from '../../features/workflow/types'
import { WorkflowIcon } from './WorkflowIcon'

export const NODE_LIBRARY_DRAG_TYPE = 'application/x-baited-node-template'

interface NodeLibraryProps {
  blocks: readonly NodeLibraryBlock[]
  onBlockDragEnd: () => void
  onBlockDragStart: (templateId: string) => void
  onBlockAdd: (templateId: string) => void
  workflowTitle: string
}

export function NodeLibrary({
  blocks,
  onBlockDragEnd,
  onBlockDragStart,
  onBlockAdd,
  workflowTitle,
}: NodeLibraryProps) {
  const categoryGroups = useMemo(() => groupBlocksByCategory(blocks), [blocks])

  const startDrag = (
    event: DragEvent<HTMLButtonElement>,
    block: NodeLibraryBlock,
  ) => {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData(NODE_LIBRARY_DRAG_TYPE, block.id)
    event.dataTransfer.setData('text/plain', block.label)
    onBlockDragStart(block.id)
  }

  const startPointerDrag = (
    event: MouseEvent<HTMLButtonElement>,
    block: NodeLibraryBlock,
  ) => {
    if (event.button === 0) {
      onBlockDragStart(block.id)
    }
  }

  return (
    <aside className="stealth-scroll hidden w-[280px] shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-surface-low p-4 lg:flex">
      <div className="mb-5 flex w-[clamp(10rem,22vw,15rem)] min-w-0 shrink-0 items-center gap-2">
        <Workflow aria-hidden="true" className="size-5 shrink-0 text-primary" />
        <h2 className="truncate text-sm font-semibold tracking-[-0.01em] text-on-surface">
          {workflowTitle}
        </h2>
      </div>

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
            Libreria
          </p>
          <h2 className="mt-1 text-lg font-semibold text-on-surface">
            Blocchi disponibili
          </h2>
          <p className="mt-1 text-xs leading-5 text-on-surface-muted">
            Seleziona un'azione da aggiungere al flusso.
          </p>
        </div>
        <button
          aria-label="Crea blocco personalizzato"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-surface-high text-on-surface-muted transition-colors hover:border-primary/40 hover:text-primary"
          disabled
          title="Disponibile in una versione futura"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="space-y-4">
        {categoryGroups.map(([category, categoryBlocks]) => (
          <section aria-labelledby={`library-category-${category}`} key={category}>
            <h3
              className="mb-2 font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted"
              id={`library-category-${category}`}
            >
              {category}
            </h3>
            <div className="space-y-2">
              {categoryBlocks.map((block) => (
                <button
                  aria-label={`Aggiungi ${block.label} al canvas`}
                  className="group flex w-full cursor-grab items-center gap-3 rounded-xl border border-white/[0.07] bg-surface-container p-3 text-left shadow-[0_8px_20px_rgb(0_0_0/0.12)] transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:bg-surface-high active:cursor-grabbing"
                  draggable
                  key={block.id}
                  onDragEnd={onBlockDragEnd}
                  onDragStart={(event) => startDrag(event, block)}
                  onMouseDown={(event) => startPointerDrag(event, block)}
                  onClick={() => onBlockAdd(block.id)}
                  type="button"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-high text-on-surface-muted transition-colors group-hover:text-secondary">
                    <WorkflowIcon className="size-4" name={block.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-on-surface">
                      {block.label}
                    </span>
                    <span className="mt-0.5 block truncate font-label text-[10px] text-on-surface-muted">
                      {block.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-white/[0.07] bg-surface-lowest p-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-secondary shadow-[0_0_7px_#4de082]" />
            <span className="font-label text-[10px] font-medium text-secondary">
              Editor online
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-on-surface-muted">
            Puoi aggiungere i blocchi con Invio oppure trascinarli per scegliere
            la posizione. Il salvataggio è disponibile in Revisione.
          </p>
        </div>
      </div>
    </aside>
  )
}

function groupBlocksByCategory(blocks: readonly NodeLibraryBlock[]) {
  const groups = new Map<string, NodeLibraryBlock[]>()

  blocks.forEach((block) => {
    const categoryBlocks = groups.get(block.category) ?? []
    categoryBlocks.push(block)
    groups.set(block.category, categoryBlocks)
  })

  return [...groups.entries()]
}
