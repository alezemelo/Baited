import { FileText, Target, Workflow } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useWorkflow } from '../../features/workflow/WorkflowContext'

interface WorkflowDetailsStepProps {
  nameError?: string
  onNameInput: () => void
}

export function WorkflowDetailsStep({
  nameError,
  onNameInput,
}: WorkflowDetailsStepProps) {
  const { draft, updateMetadata } = useWorkflow()
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (nameError) {
      nameInputRef.current?.focus()
    }
  }, [nameError])

  return (
    <section
      aria-labelledby="workflow-details-title"
      className="stealth-scroll min-h-0 flex-1 overflow-y-auto bg-surface-lowest px-6 py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            Configurazione iniziale
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-on-surface"
            id="workflow-details-title"
          >
            Dettagli del workflow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-muted">
            Dai un nome riconoscibile al flusso e scegli il gruppo di target da
            coinvolgere nella simulazione.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-white/[0.08] bg-surface-container p-6 shadow-[0_16px_40px_rgb(0_0_0/0.18)]">
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold text-on-surface"
              htmlFor="workflow-name"
            >
              <Workflow aria-hidden="true" className="size-4 text-primary" />
              Nome workflow
            </label>
            <input
              aria-describedby={nameError ? 'workflow-name-error' : undefined}
              aria-invalid={Boolean(nameError)}
              className={`mt-2 w-full rounded-xl border bg-surface-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:ring-2 focus:outline-none ${
                nameError
                  ? 'border-primary focus:border-primary focus:ring-primary/15'
                  : 'border-white/10 focus:border-secondary focus:ring-secondary/15'
              }`}
              id="workflow-name"
              onChange={(event) => {
                updateMetadata({ name: event.target.value })
                onNameInput()
              }}
              placeholder="Es. Campagna Q3 — Sicurezza email"
              ref={nameInputRef}
              type="text"
              value={draft.metadata.name}
            />
            {nameError ? (
              <p
                className="mt-2 font-label text-[11px] font-medium text-primary"
                id="workflow-name-error"
                role="alert"
              >
                {nameError}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold text-on-surface"
              htmlFor="workflow-description"
            >
              <FileText aria-hidden="true" className="size-4 text-on-surface-muted" />
              Descrizione
              <span className="font-label text-[10px] font-normal text-on-surface-muted">
                Opzionale
              </span>
            </label>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-xl border border-white/10 bg-surface-lowest px-4 py-3 text-sm leading-6 text-on-surface placeholder:text-on-surface-muted/60 focus:border-secondary focus:ring-2 focus:ring-secondary/15 focus:outline-none"
              id="workflow-description"
              onChange={(event) =>
                updateMetadata({ description: event.target.value })
              }
              placeholder="Descrivi obiettivo e contesto della simulazione"
              value={draft.metadata.description}
            />
          </div>

          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold text-on-surface"
              htmlFor="workflow-target-group"
            >
              <Target aria-hidden="true" className="size-4 text-secondary" />
              Gruppo target
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-surface-lowest px-4 py-3 text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/15 focus:outline-none"
              id="workflow-target-group"
              onChange={(event) =>
                updateMetadata({ targetGroupId: event.target.value })
              }
              value={draft.metadata.targetGroupId ?? ''}
            >
              <option value="">Seleziona un gruppo</option>
              <option value="target-group-q3">Target campagna Q3</option>
              <option value="high-risk">Target ad alto rischio</option>
              <option value="new-hires">Nuovi assunti</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
