import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (import.meta.env.VITE_DISABLE_WORKFLOW_MOCKS === 'true') {
    return
  }

  const { startWorkflowMocking } = await import(
    './features/workflow/api/mock.ts'
  )

  await startWorkflowMocking()
}

void enableMocking().catch(() => undefined).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
