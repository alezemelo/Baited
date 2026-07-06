import {
  Activity,
  Plus,
  Workflow,
} from 'lucide-react'

const tabs = ['Editor', 'Esecuzioni', 'Test'] as const

type AppTab = (typeof tabs)[number]

interface AppHeaderProps {
  title: string
  category: string
  status: string
  activeTab: AppTab
  hasUnsavedChanges: boolean
  onNewWorkflow: () => void
}

export function AppHeader({
  title,
  category,
  status,
  activeTab,
  hasUnsavedChanges,
  onNewWorkflow,
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
              aria-disabled={!isActive}
              className={`rounded-md px-4 py-1.5 font-label text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-on-surface shadow-[inset_0_-2px_0_#ffb3b0]'
                  : 'text-on-surface-muted hover:bg-white/5 hover:text-on-surface'
              }`}
              key={tab}
              disabled={!isActive}
              title={!isActive ? 'Disponibile in una versione futura' : undefined}
              type="button"
            >
              {tab}
            </button>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        <button
          className="hidden items-center gap-2 rounded-lg border border-white/10 bg-surface-container px-3 py-2 font-label text-xs font-medium text-on-surface transition-colors hover:border-secondary/35 hover:text-secondary sm:flex"
          onClick={onNewWorkflow}
          type="button"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Nuovo workflow
        </button>
        <div
          aria-live="polite"
          className={`hidden items-center gap-2 text-xs md:flex ${
            hasUnsavedChanges ? 'text-primary' : 'text-secondary'
          }`}
        >
          <Activity aria-hidden="true" className="size-3.5" />
          <span className="font-label">{status}</span>
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${
              hasUnsavedChanges
                ? 'bg-primary shadow-[0_0_8px_#f87171]'
                : 'bg-secondary shadow-[0_0_8px_#4de082]'
            }`}
          />
        </div>
      </div>
    </header>
  )
}
