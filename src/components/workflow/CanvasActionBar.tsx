import { Keyboard, MousePointer2 } from 'lucide-react'

export function CanvasActionBar() {
  return (
    <div
      className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-xl border border-white/[0.08] bg-surface-container/90 px-3 py-2 shadow-[0_12px_32px_rgb(0_0_0/0.3)] backdrop-blur-xl md:flex"
      role="note"
    >
      <span className="flex items-center gap-1.5 font-label text-[10px] text-on-surface-muted">
        <Keyboard aria-hidden="true" className="size-3.5 text-secondary" />
        Invio aggiunge un blocco
      </span>
      <span aria-hidden="true" className="h-3 w-px bg-white/10" />
      <span className="flex items-center gap-1.5 font-label text-[10px] text-on-surface-muted">
        <MousePointer2 aria-hidden="true" className="size-3.5 text-primary" />
        Trascina per posizionarlo
      </span>
    </div>
  )
}
