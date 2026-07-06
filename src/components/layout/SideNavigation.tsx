import {
  BookOpenCheck,
  CircleHelp,
  FileBarChart,
  Home,
  Settings,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface NavigationItem {
  label: string
  icon: LucideIcon
  to?: string
  end?: boolean
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', icon: Home, to: '/', end: true },
  { label: 'Workflow', icon: Workflow, to: '/workflow' },
  { label: 'Workflow salvati', icon: FileBarChart, to: '/workflows' },
  { label: 'Target', icon: Users },
  { label: 'Training', icon: BookOpenCheck },
  { label: 'Impostazioni', icon: Settings },
]

export function SideNavigation() {
  return (
    <aside className="z-30 flex w-16 shrink-0 flex-col items-center border-r border-white/10 bg-surface-low py-4">
      <nav aria-label="Navigazione principale" className="flex flex-col gap-1">
        {navigationItems.map(({ end, icon: Icon, label, to }) => {
          if (to) {
            return (
              <NavLink
                aria-label={label}
                className={({ isActive }) => navigationItemClass(isActive)}
                end={end}
                key={label}
                to={to}
              >
                <Icon aria-hidden="true" className="size-5" />
              </NavLink>
            )
          }

          return (
            <button
              aria-label={label}
              className={`${navigationItemClass(false)} cursor-not-allowed opacity-45`}
              disabled
              key={label}
              title="Disponibile in una versione futura"
              type="button"
            >
              <Icon aria-hidden="true" className="size-5" />
            </button>
          )
        })}
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

function navigationItemClass(isActive: boolean) {
  return `flex size-10 items-center justify-center rounded-lg transition-colors ${
    isActive
      ? 'bg-secondary/10 text-secondary'
      : 'text-on-surface-muted hover:bg-white/5 hover:text-on-surface'
  }`
}
