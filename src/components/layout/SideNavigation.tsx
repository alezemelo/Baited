import {
  BookOpenCheck,
  CircleHelp,
  FileBarChart,
  Home,
  Settings,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

interface NavigationItem {
  label: string
  icon: LucideIcon
  active?: boolean
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', icon: Home },
  { label: 'Workflow', icon: Workflow, active: true },
  { label: 'Target', icon: Users },
  { label: 'Training', icon: BookOpenCheck },
  { label: 'Report', icon: FileBarChart },
  { label: 'Impostazioni', icon: Settings },
]

export function SideNavigation() {
  return (
    <aside className="z-30 flex w-16 shrink-0 flex-col items-center border-r border-white/10 bg-surface-low py-4">
      <div className="mb-6 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ShieldCheck aria-label="Baited" className="size-5" />
      </div>

      <nav aria-label="Navigazione principale" className="flex flex-col gap-1">
        {navigationItems.map(({ active, icon: Icon, label }) => (
          <button
            aria-current={active ? 'page' : undefined}
            aria-label={label}
            className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
              active
                ? 'bg-secondary/10 text-secondary'
                : 'text-on-surface-muted hover:bg-white/5 hover:text-on-surface'
            }`}
            key={label}
            type="button"
          >
            <Icon aria-hidden="true" className="size-5" />
          </button>
        ))}
      </nav>

      <button
        aria-label="Aiuto"
        className="mt-auto flex size-10 items-center justify-center rounded-lg text-on-surface-muted transition-colors hover:bg-white/5 hover:text-on-surface"
        type="button"
      >
        <CircleHelp aria-hidden="true" className="size-5" />
      </button>
      <div
        aria-label="Profilo AM"
        className="mt-3 flex size-8 items-center justify-center rounded-full border border-white/10 bg-surface-high font-label text-[10px] font-semibold text-on-surface"
        role="img"
      >
        AM
      </div>
    </aside>
  )
}
