import { lazy, Suspense, type ReactNode } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const WorkflowsPage = lazy(() =>
  import('./pages/WorkflowsPage').then((module) => ({
    default: module.WorkflowsPage,
  })),
)
const WorkflowStudioPage = lazy(() =>
  import('./pages/WorkflowStudioPage').then((module) => ({
    default: module.WorkflowStudioPage,
  })),
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyPage><HomePage /></LazyPage>,
  },
  {
    path: '/workflow',
    element: <LazyPage><WorkflowStudioPage /></LazyPage>,
  },
  {
    path: '/workflows',
    element: <LazyPage><WorkflowsPage /></LazyPage>,
  },
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>
  )
}

function PageLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Caricamento pagina"
      className="flex h-dvh min-h-[640px] items-center justify-center bg-surface text-on-surface"
    >
      <span className="font-label text-xs text-on-surface-muted">
        Caricamento…
      </span>
    </main>
  )
}
