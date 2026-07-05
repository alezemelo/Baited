import { delay, http, HttpResponse } from 'msw'
import type { CreateWorkflowRequest } from './workflows'

export const workflowHandlers = [
  http.post('*/api/workflows', async ({ request }) => {
    await delay(500)

    if (request.headers.get('x-baited-simulate-error') === 'true') {
      return HttpResponse.json(
        { message: 'Errore mock: salvataggio non riuscito. Riprova.' },
        { status: 503 },
      )
    }

    const payload = (await request.json()) as Partial<CreateWorkflowRequest>

    if (
      payload.version !== 1 ||
      !payload.metadata ||
      !Array.isArray(payload.nodes) ||
      !Array.isArray(payload.edges)
    ) {
      return HttpResponse.json(
        { message: 'Payload workflow non valido.' },
        { status: 400 },
      )
    }

    return HttpResponse.json(
      {
        id: `workflow-${crypto.randomUUID()}`,
        version: 1 as const,
        status: 'saved' as const,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }),
]

export async function startWorkflowMocking() {
  const { setupWorker } = await import('msw/browser')
  const worker = setupWorker(...workflowHandlers)

  return worker.start({ onUnhandledRequest: 'bypass' })
}
