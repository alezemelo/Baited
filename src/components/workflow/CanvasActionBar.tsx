import { Play, Save, Trash2 } from 'lucide-react'

export function CanvasActionBar() {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/[0.08] bg-surface-container/90 p-1.5 shadow-[0_12px_32px_rgb(0_0_0/0.3)] backdrop-blur-xl">
      <button
        className="flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
        type="button"
      >
        <Play aria-hidden="true" className="size-3.5 fill-current" />
        Test workflow
      </button>
      <button
        className="hidden items-center gap-2 rounded-lg border border-white/10 bg-surface-high px-4 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:bg-surface-highest sm:flex"
        type="button"
      >
        <Save aria-hidden="true" className="size-3.5" />
        Salva bozza
      </button>
      <button
        aria-label="Elimina selezione"
        className="flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
        type="button"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}
