import {
  Activity,
  EllipsisVertical,
  History,
  Save,
  Workflow,
} from 'lucide-react'

const tabs = ['Editor', 'Esecuzioni', 'Test'] as const

type AppTab = (typeof tabs)[number]

interface AppHeaderProps {
  title: string
  category: string
  status: string
  activeTab: AppTab
}

export function AppHeader({
  title,
  category,
  status,
  activeTab,
}: AppHeaderProps) {
  return (
    <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-surface/90 px-4 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <Workflow aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <h1 className="truncate text-lg font-semibold tracking-[-0.01em] text-on-surface">
            {title}
          </h1>
        </div>
        <span className="hidden rounded bg-surface-container px-2 py-1 font-label text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-muted sm:inline-flex">
          {category}
        </span>
      </div>

      <nav
        aria-label="Sezioni del workflow"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-lg bg-surface-high p-1 lg:flex"
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-md px-4 py-1.5 font-label text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-on-surface shadow-[inset_0_-2px_0_#ffb3b0]'
                  : 'text-on-surface-muted hover:bg-white/5 hover:text-on-surface'
              }`}
              key={tab}
              type="button"
            >
              {tab}
            </button>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-2 text-xs text-secondary md:flex">
          <Activity aria-hidden="true" className="size-3.5" />
          <span className="font-label">{status}</span>
          <span aria-hidden="true" className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4de082]" />
        </div>
        <button
          className="hidden items-center gap-2 rounded-lg bg-primary-container px-3.5 py-2 font-label text-xs font-semibold text-on-primary transition-opacity hover:opacity-90 sm:flex"
          type="button"
        >
          <Save aria-hidden="true" className="size-3.5" />
          Salva workflow
        </button>
        <div className="hidden items-center gap-1 border-l border-white/10 pl-2 xl:flex">
          <span className="px-1 font-label text-[11px] text-on-surface-muted">
            Bozza salvata
          </span>
          <button
            aria-label="Visualizza cronologia"
            className="rounded-md p-1.5 text-on-surface-muted transition-colors hover:bg-white/5 hover:text-primary"
            type="button"
          >
            <History aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-label="Altre opzioni"
            className="rounded-md p-1.5 text-on-surface-muted transition-colors hover:bg-white/5 hover:text-primary"
            type="button"
          >
            <EllipsisVertical aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
