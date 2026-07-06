# Dependencies and Libraries

This document lists the direct packages declared in [`package.json`](../package.json), what each one is used for, and the main places where it appears in the current codebase. It intentionally does not list transitive packages from `package-lock.json`.

## Runtime Dependencies

| Package | Used for | Main usage |
| --- | --- | --- |
| `@tailwindcss/vite` | Wires Tailwind CSS into Vite so Tailwind utilities, theme tokens, and generated styles are available during dev and production builds. | [`vite.config.ts`](../vite.config.ts) registers `tailwindcss()` in the Vite plugin list. |
| `@xyflow/react` | Provides the graph editor canvas, nodes, edges, handles, minimap, controls, markers, viewport operations, and React Flow types. | [`src/components/workflow/WorkflowCanvas.tsx`](../src/components/workflow/WorkflowCanvas.tsx) renders `ReactFlow`, `Background`, `Controls`, `MiniMap`, and `Panel`; [`src/components/workflow/WorkflowNodeCard.tsx`](../src/components/workflow/WorkflowNodeCard.tsx) renders node handles; [`src/components/workflow/WorkflowProvider.tsx`](../src/components/workflow/WorkflowProvider.tsx), [`src/features/workflow/WorkflowContext.ts`](../src/features/workflow/WorkflowContext.ts), [`src/features/workflow/types.ts`](../src/features/workflow/types.ts), and [`src/features/workflow/initialWorkflow.ts`](../src/features/workflow/initialWorkflow.ts) use React Flow state helpers and types. |
| `lucide-react` | Supplies application icons as React components. | Layout icons in [`src/components/layout/AppHeader.tsx`](../src/components/layout/AppHeader.tsx) and [`src/components/layout/SideNavigation.tsx`](../src/components/layout/SideNavigation.tsx); page icons in [`src/pages/HomePage.tsx`](../src/pages/HomePage.tsx); workflow and wizard icons in [`src/components/workflow/`](../src/components/workflow/) and [`src/components/wizard/`](../src/components/wizard/), including [`WorkflowIcon.tsx`](../src/components/workflow/WorkflowIcon.tsx), [`NodeInspector.tsx`](../src/components/workflow/NodeInspector.tsx), [`NodeLibrary.tsx`](../src/components/workflow/NodeLibrary.tsx), [`WorkflowCanvas.tsx`](../src/components/workflow/WorkflowCanvas.tsx), [`CanvasActionBar.tsx`](../src/components/workflow/CanvasActionBar.tsx), [`WorkflowDetailsStep.tsx`](../src/components/wizard/WorkflowDetailsStep.tsx), [`WorkflowReviewStep.tsx`](../src/components/wizard/WorkflowReviewStep.tsx), [`WorkflowWizard.tsx`](../src/components/wizard/WorkflowWizard.tsx), and [`WizardProgress.tsx`](../src/components/wizard/WizardProgress.tsx). |
| `react` | Core UI runtime, JSX component model, context, lazy loading, suspense, hooks, and type utilities. | Bootstrapping in [`src/main.tsx`](../src/main.tsx), route shell in [`src/App.tsx`](../src/App.tsx), pages in [`src/pages/`](../src/pages/), shared state in [`src/components/workflow/WorkflowProvider.tsx`](../src/components/workflow/WorkflowProvider.tsx) and [`src/features/workflow/WorkflowContext.ts`](../src/features/workflow/WorkflowContext.ts), and all interactive components under [`src/components/`](../src/components/). |
| `react-dom` | Mounts the React application into the browser DOM. | [`src/main.tsx`](../src/main.tsx) calls `createRoot(...).render(...)`. |
| `react-router-dom` | Provides browser routing, redirects, route links, and navigation blocking. | [`src/App.tsx`](../src/App.tsx) creates the data router and fallback redirect; [`src/components/layout/SideNavigation.tsx`](../src/components/layout/SideNavigation.tsx) and [`src/pages/HomePage.tsx`](../src/pages/HomePage.tsx) use `NavLink`; [`src/pages/WorkflowStudioPage.tsx`](../src/pages/WorkflowStudioPage.tsx) uses `useBlocker` for dirty-draft navigation protection; tests use `MemoryRouter` where route context is required. |
| `tailwindcss` | Provides the utility CSS engine and theme token system used by the application styling. | [`src/index.css`](../src/index.css) imports `tailwindcss` and defines the theme colors/fonts; Tailwind utility classes are used throughout [`src/pages/`](../src/pages/) and [`src/components/`](../src/components/). |

## Development, Build, and Test Dependencies

| Package | Used for | Main usage |
| --- | --- | --- |
| `@axe-core/playwright` | Runs automated accessibility audits inside browser E2E tests. | [`e2e/workflow.spec.ts`](../e2e/workflow.spec.ts) creates `AxeBuilder` audits for the Home, details, and review screens. |
| `@playwright/test` | Runs Chromium E2E tests and starts the local web/API servers for those tests. | [`playwright.config.ts`](../playwright.config.ts) configures devices, server startup, screenshots, and traces; [`e2e/workflow.spec.ts`](../e2e/workflow.spec.ts) uses `test`, `expect`, `page`, and `request`. |
| `@testing-library/jest-dom` | Adds DOM-specific Vitest matchers such as `toBeInTheDocument` and `toHaveAttribute`. | [`src/test/setup.ts`](../src/test/setup.ts) imports `@testing-library/jest-dom/vitest`; component tests under [`src/**/*.test.tsx`](../src/) use the matchers. |
| `@testing-library/react` | Renders React components in unit tests and queries the virtual DOM through accessible roles/labels/text. | Component tests such as [`src/components/workflow/NodeLibrary.test.tsx`](../src/components/workflow/NodeLibrary.test.tsx), [`src/components/workflow/WorkflowProvider.test.tsx`](../src/components/workflow/WorkflowProvider.test.tsx), [`src/components/wizard/WorkflowDetailsStep.test.tsx`](../src/components/wizard/WorkflowDetailsStep.test.tsx), and [`src/pages/HomePage.test.tsx`](../src/pages/HomePage.test.tsx); [`src/test/setup.ts`](../src/test/setup.ts) calls `cleanup`. |
| `@testing-library/user-event` | Simulates realistic keyboard and pointer input in component tests. | Workflow component tests including [`src/components/workflow/NodeLibrary.test.tsx`](../src/components/workflow/NodeLibrary.test.tsx), [`src/components/workflow/NodeInspector.test.tsx`](../src/components/workflow/NodeInspector.test.tsx), [`src/components/workflow/WorkflowPropertiesPanel.test.tsx`](../src/components/workflow/WorkflowPropertiesPanel.test.tsx), and [`src/components/workflow/WorkflowProvider.test.tsx`](../src/components/workflow/WorkflowProvider.test.tsx). |
| `@types/node` | Supplies Node.js type definitions for TypeScript config files and Node-based tests. | TypeScript compilation for [`vite.config.ts`](../vite.config.ts), [`playwright.config.ts`](../playwright.config.ts), and tests under [`tests/`](../tests/) that use Node APIs. |
| `@types/react` | Supplies React type definitions for JSX, hooks, props, context, and `ReactNode`. | Used implicitly by all `.tsx` files, with explicit type imports in files such as [`src/App.tsx`](../src/App.tsx) and [`src/components/workflow/config/FormControls.tsx`](../src/components/workflow/config/FormControls.tsx). |
| `@types/react-dom` | Supplies React DOM type definitions. | Supports TypeScript checking for [`src/main.tsx`](../src/main.tsx), where `react-dom/client` mounts the app. |
| `@vitejs/plugin-react` | Enables React support in Vite, including JSX transform and React refresh behavior during development. | [`vite.config.ts`](../vite.config.ts) registers `react()` in the Vite plugin list. |
| `concurrently` | Runs the mock API and Vite dev server together from one command. | [`package.json`](../package.json) defines `npm run dev` as `concurrently ... "npm:mock:api" "npm:dev:web"`. |
| `jsdom` | Provides the browser-like DOM environment for Vitest component tests. | [`vite.config.ts`](../vite.config.ts) sets `test.environment` to `jsdom`. |
| `json-server` | Implements the local mock API and JSON persistence layer. | [`mocks/server.cjs`](../mocks/server.cjs) creates the server, router, body parser, health endpoint, and custom `POST /api/workflows`; scripts in [`package.json`](../package.json) run it for development and E2E tests. |
| `oxlint` | Lints the TypeScript/React codebase. | [`package.json`](../package.json) defines `npm run lint` as `oxlint`. |
| `typescript` | Type-checks the application and compiles domain tests before they run in Node. | [`package.json`](../package.json) uses `tsc -b` in `npm run build` and `tsc -p tsconfig.test.json` in `npm run test:domain`; TypeScript config files include [`tsconfig.json`](../tsconfig.json), [`tsconfig.app.json`](../tsconfig.app.json), and [`tsconfig.test.json`](../tsconfig.test.json). |
| `vite` | Provides the dev server, production bundling, preview server, environment loading, and proxying to the mock API. | [`vite.config.ts`](../vite.config.ts) imports `loadEnv` from `vite` and configures server/preview proxy behavior; [`package.json`](../package.json) defines `dev:web`, `build`, and `preview` scripts. |
| `vitest` | Runs component tests and provides test globals/utilities; also supplies the Vite-compatible test configuration helper. | [`vite.config.ts`](../vite.config.ts) imports `defineConfig` from `vitest/config`; component tests under [`src/**/*.test.tsx`](../src/) import `describe`, `it`, `expect`, and `vi`; [`src/test/setup.ts`](../src/test/setup.ts) imports `afterEach`. |

## Node.js Built-ins

These modules are not installable npm dependencies, but they are used directly by the repository's scripts and tests.

| Module | Used for | Main usage |
| --- | --- | --- |
| `node:crypto` | Generates saved workflow IDs in the mock API. | [`mocks/server.cjs`](../mocks/server.cjs) uses `randomUUID`. |
| `node:fs` and `node:fs/promises` | Creates mock database directories, copies the seed database, and manages temporary test directories. | [`mocks/server.cjs`](../mocks/server.cjs) uses synchronous filesystem helpers; [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts) uses promise-based temporary directory cleanup. |
| `node:path` | Resolves project, mock database, and test paths. | [`mocks/server.cjs`](../mocks/server.cjs) and [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |
| `node:assert/strict` | Provides assertions for Node's domain/API tests. | [`tests/workflow-validation.test.ts`](../tests/workflow-validation.test.ts) and [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |
| `node:test` | Runs domain and API tests without an additional unit-test dependency. | [`tests/workflow-validation.test.ts`](../tests/workflow-validation.test.ts) and [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |
| `node:child_process` | Starts the mock API server during API contract tests. | [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |
| `node:net` | Finds an available port for API contract tests. | [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |
| `node:os` | Locates the operating-system temp directory for isolated API tests. | [`tests/workflow-api.test.ts`](../tests/workflow-api.test.ts). |

## Maintenance Notes

- Add new direct npm packages to the appropriate table in this document in the same change that introduces them.
- If a package is removed from `package.json`, remove its row here and update any related docs under this folder.
- Keep usage locations specific enough for a maintainer to find the dependency quickly, but prefer grouped directories when a library is intentionally used across many components.
