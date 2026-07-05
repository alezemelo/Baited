import {
  Flag,
  GitBranch,
  GraduationCap,
  Mail,
  MessageSquareText,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { WorkflowIconName } from '../../features/workflow/types'

const icons: Record<WorkflowIconName, LucideIcon> = {
  users: Users,
  mail: Mail,
  branch: GitBranch,
  message: MessageSquareText,
  shield: ShieldAlert,
  training: GraduationCap,
  flag: Flag,
  search: Search,
  sparkles: Sparkles,
}

interface WorkflowIconProps {
  name: WorkflowIconName
  className?: string
}

export function WorkflowIcon({ name, className }: WorkflowIconProps) {
  const Icon = icons[name]

  return <Icon aria-hidden="true" className={className} />
}
