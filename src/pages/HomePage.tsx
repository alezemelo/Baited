import {
  ArrowRight,
  AlertTriangle,
  BookOpenCheck,
  GitBranch,
  LoaderCircle,
  MailCheck,
  SearchCheck,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SideNavigation } from '../components/layout/SideNavigation'
import {
  listSavedWorkflows,
  type SavedWorkflowResource,
} from '../features/workflow/api/workflows'

const capabilities: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: 'Workflow visuali',
    description:
      'Componi grafi aciclici con azioni, condizioni e percorsi alternativi.',
    icon: GitBranch,
  },
  {
    title: 'Campagne multicanale',
    description:
      'Descrivi sequenze email, SMS e messaggi istantanei nello stesso flusso.',
    icon: MailCheck,
  },
  {
    title: 'OSINT mirato',
    description:
      'Collega raccolta di evidenze e generazione di scenari alle campagne.',
    icon: SearchCheck,
  },
  {
    title: 'Awareness integrata',
    description:
      'Instrada i target verso gruppi di rischio e percorsi formativi dedicati.',
    icon: BookOpenCheck,
  },
]

type LatestWorkflowState =
  | { status: 'loading'; workflow: null }
  | { status: 'success'; workflow: SavedWorkflowResource | null }
  | { message: string; status: 'error'; workflow: null }

export function HomePage() {
  const [latestWorkflowState, setLatestWorkflowState] =
    useState<LatestWorkflowState>({
      status: 'loading',
      workflow: null,
    })
  const latestWorkflow = latestWorkflowState.workflow
  const actionLabel = latestWorkflow
    ? 'Continua nel Workflow Studio'
    : 'Apri il Workflow Studio'
  const workflowStudioPath = latestWorkflow
    ? `/workflow/${latestWorkflow.id}`
    : '/workflow'

  useEffect(() => {
    const controller = new AbortController()

    void listSavedWorkflows({ signal: controller.signal })
      .then((workflows) => {
        setLatestWorkflowState({
          status: 'success',
          workflow: workflows[0] ?? null,
        })
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setLatestWorkflowState({
          message:
            error instanceof Error
              ? error.message
              : 'Non è stato possibile leggere i workflow salvati.',
          status: 'error',
          workflow: null,
        })
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="flex h-dvh min-h-[640px] flex-col overflow-hidden bg-surface text-on-surface">
      <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-surface/90 px-4 backdrop-blur-xl">
        <img
          alt="Baited"
          className="h-[34px] w-[118px]"
          height="34"
          src="/baited-logo.svg"
          width="118"
        />
        <span className="hidden rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 font-label text-[10px] font-medium text-secondary sm:inline-flex">
          Workflow Studio MVP
        </span>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation />

        <main className="stealth-scroll min-w-0 flex-1 overflow-y-auto bg-surface-lowest">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-container px-6 py-8 shadow-[0_24px_70px_rgb(0_0_0/0.24)] lg:px-10 lg:py-10">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-secondary/8 blur-3xl"
              />

              <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
                <div>
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
                    Campaign workflow automation
                  </p>
                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-on-surface lg:text-5xl">
                    Progetta ogni risposta, dal primo segnale alla formazione.
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-on-surface-muted lg:text-base">
                    Costruisci campagne di sicurezza come workflow visuali,
                    collega azioni e condizioni e verifica ogni percorso prima
                    del salvataggio.
                  </p>
                  <NavLink
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-container px-5 py-3 font-label text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
                    to={workflowStudioPath}
                  >
                    {actionLabel}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </NavLink>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-surface-low/80 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Flusso operativo
                      </p>
                      <h2 className="mt-1 text-base font-semibold">
                        Dall'analisi alla risposta
                      </h2>
                    </div>
                    <Workflow aria-hidden="true" className="size-5 text-secondary" />
                  </div>
                  <ol className="mt-5 space-y-3">
                    {['Target e OSINT', 'Campagna multicanale', 'Branch di rischio', 'Training e chiusura'].map(
                      (step, index) => (
                        <li
                          className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-surface-container px-3 py-3"
                          key={step}
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/10 font-label text-[10px] font-semibold text-secondary">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xs font-medium text-on-surface">
                            {step}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </div>
            </section>

            <section aria-labelledby="recent-workflow-title" className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Riprendi il lavoro
                  </p>
                  <h2
                    className="mt-1 text-xl font-semibold tracking-[-0.02em]"
                    id="recent-workflow-title"
                  >
                    Ultimo workflow
                  </h2>
                </div>
              </div>

              {latestWorkflowState.status === 'loading' ? (
                <div className="rounded-2xl border border-white/[0.08] bg-surface-container p-6">
                  <div className="flex items-center gap-3 text-on-surface-muted">
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                    <p className="font-label text-xs">
                      Caricamento ultimo workflow…
                    </p>
                  </div>
                </div>
              ) : null}

              {latestWorkflowState.status === 'error' ? (
                <div
                  className="rounded-2xl border border-primary/20 bg-primary/10 p-6"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Ultimo workflow non disponibile
                      </p>
                      <p className="mt-2 max-w-2xl text-xs leading-5 text-on-surface-muted">
                        {latestWorkflowState.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {latestWorkflowState.status === 'success' && latestWorkflow ? (
                <article className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-surface-container p-6 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-on-surface">
                      {latestWorkflow.metadata.name}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-muted">
                      {latestWorkflow.metadata.category || 'Senza categoria'} ·
                      Salvato {formatSavedAt(latestWorkflow.createdAt)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <WorkflowFact
                        label={`${latestWorkflow.nodes.length} nodi`}
                      />
                      <WorkflowFact
                        label={`${latestWorkflow.edges.length} connessioni`}
                      />
                      <WorkflowFact label="Versione 1" />
                    </div>
                  </div>
                  <NavLink
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-secondary/10 px-4 py-2.5 font-label text-xs font-semibold text-secondary transition-colors hover:border-secondary/50 hover:bg-secondary/15"
                    to={`/workflow/${latestWorkflow.id}`}
                  >
                    Apri workflow
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </NavLink>
                </article>
              ) : null}

              {latestWorkflowState.status === 'success' && !latestWorkflow ? (
                <div className="rounded-2xl border border-dashed border-white/12 bg-surface-container/60 p-6">
                  <p className="text-sm font-semibold text-on-surface">
                    Nessun workflow salvato
                  </p>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-on-surface-muted">
                    Apri lo studio per creare il primo grafo da zero oppure
                    caricare il workflow di esempio.
                  </p>
                </div>
              ) : null}
            </section>

            <section aria-labelledby="capabilities-title" className="mt-8 pb-4">
              <p className="font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-secondary">
                Capability
              </p>
              <h2
                className="mt-1 text-xl font-semibold tracking-[-0.02em]"
                id="capabilities-title"
              >
                Un unico spazio per progettare il percorso
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {capabilities.map(({ description, icon: Icon, title }) => (
                  <article
                    className="rounded-2xl border border-white/[0.07] bg-surface-container p-5"
                    key={title}
                  >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-on-surface">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-on-surface-muted">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function WorkflowFact({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-white/[0.07] bg-surface-high px-2.5 py-1.5 font-label text-[10px] text-on-surface-muted">
      {label}
    </span>
  )
}

function formatSavedAt(createdAt: string) {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}
