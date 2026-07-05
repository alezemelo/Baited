import { Plus } from 'lucide-react'
import type { NodeLibraryBlock } from '../../features/workflow/types'
import { WorkflowIcon } from './WorkflowIcon'

interface NodeLibraryProps {
  blocks: readonly NodeLibraryBlock[]
}

export function NodeLibrary({ blocks }: NodeLibraryProps) {
  return (
    <aside className="stealth-scroll hidden w-[280px] shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-surface-low p-4 lg:flex">
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
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <button
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-surface-container p-3 text-left shadow-[0_8px_20px_rgb(0_0_0/0.12)] transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:bg-surface-high"
            key={block.id}
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
            <span className="rounded-full bg-white/5 px-2 py-1 font-label text-[9px] uppercase tracking-wide text-on-surface-muted">
              {block.category}
            </span>
          </button>
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
            Il workflow viene salvato automaticamente come bozza.
          </p>
        </div>
      </div>
    </aside>
  )
}
