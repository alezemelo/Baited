import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../../features/workflow/types'
import { WorkflowIcon } from './WorkflowIcon'

const categoryTone = {
  workflow_start: 'text-primary bg-primary/10',
  create_campaign: 'text-secondary bg-secondary/10',
  condition: 'text-primary bg-primary/10',
  add_target_to_group: 'text-secondary bg-secondary/10',
  start_awareness_campaign: 'text-primary bg-primary/10',
  start_osint_on_targets: 'text-secondary bg-secondary/10',
  generate_scenario_from_osint: 'text-primary bg-primary/10',
  workflow_end: 'text-on-surface bg-white/5',
} as const

export function WorkflowNodeCard({
  data,
  selected,
}: NodeProps<WorkflowNode>) {
  const isTrigger = data.kind === 'workflow_start'
  const isCondition = data.kind === 'condition'
  const isEnd = data.kind === 'workflow_end'
  const hasValidationError = data.validationState === 'error'
  const conditionBranches = isCondition
    ? [
        ...data.config.rules.map((rule, index) => ({
          id: rule.id,
          label: rule.label,
          type: index === 0 ? 'if' : 'else if',
        })),
        {
          id: data.config.elseBranch.id,
          label: data.config.elseBranch.label,
          type: 'else',
        },
      ]
    : []

  return (
    <article
      className={`relative w-[210px] rounded-2xl border bg-surface-container p-4 shadow-[0_10px_28px_rgb(0_0_0/0.24)] transition-[border-color,box-shadow,transform] ${
        hasValidationError
          ? 'border-primary shadow-[0_0_0_1px_rgb(248_113_113/0.18),0_0_18px_rgb(248_113_113/0.28)]'
          : selected
          ? 'border-secondary shadow-[0_0_0_1px_rgb(77_224_130/0.12),0_0_14px_rgb(77_224_130/0.25)]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {!isTrigger ? (
        <Handle
          className="workflow-handle"
          position={Position.Left}
          type="target"
        />
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${categoryTone[data.kind]}`}
        >
          <WorkflowIcon className="size-[18px]" name={data.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-label text-[9px] font-semibold uppercase tracking-[0.1em] text-on-surface-muted">
              {data.category}
            </span>
            {hasValidationError ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-label text-[8px] font-semibold uppercase tracking-wide text-primary">
                Da correggere
              </span>
            ) : data.status ? (
              <span className="flex items-center gap-1 font-label text-[9px] text-on-surface-muted">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${
                    data.status === 'bozza' ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
                {data.status}
              </span>
            ) : null}
          </div>
          <h3 className="mt-1 truncate text-sm font-semibold text-on-surface">
            {data.label}
          </h3>
          <p className="mt-1 truncate font-label text-[10px] text-on-surface-muted">
            {data.subtitle}
          </p>
        </div>
      </div>

      {conditionBranches.length > 0 ? (
        <div className="mt-3 space-y-1 border-t border-white/[0.07] pt-3">
          {conditionBranches.map((branch) => (
            <div
              className="relative rounded-lg bg-surface-lowest px-2 py-1.5 pr-4"
              key={branch.id}
            >
              <span className="block font-label text-[8px] font-semibold uppercase tracking-wide text-on-surface-muted">
                {branch.type}
              </span>
              <span className="block truncate font-label text-[9px] text-on-surface">
                {branch.label || 'Branch senza label'}
              </span>
              <Handle
                className="workflow-handle"
                id={branch.id}
                position={Position.Right}
                style={{ top: '50%' }}
                type="source"
              />
            </div>
          ))}
        </div>
      ) : !isEnd ? (
        <Handle
          className="workflow-handle"
          position={Position.Right}
          type="source"
        />
      ) : null}
    </article>
  )
}
