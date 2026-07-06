# Baited Application Documentation

This folder explains how the Baited Workflow Studio is composed and how its implemented parts interact. It is written for developers who need to run, maintain, test, or extend the current MVP.

## Reading order

| Document | What it explains |
| --- | --- |
| [System overview](01-system-overview.md) | Product boundary, stack, major subsystems, and component hierarchy |
| [Bootstrap and runtime](02-bootstrap-and-runtime.md) | Startup sequence, commands, ports, proxying, and initial state |
| [Frontend state and data flow](03-frontend-state-and-data-flow.md) | State ownership, editor operations, IDs, dirty state, and restoration |
| [Workflow blocks](04-workflow-blocks.md) | Every draggable template, its configuration, purpose, and connection rules |
| [Graph model and validation](05-graph-model-and-validation.md) | Node/edge shapes, condition branches, DAG rules, and validation errors |
| [API and persistence](06-api-and-persistence.md) | JSON Server, HTTP contracts, runtime database, localStorage, curl, and Postman |
| [Testing and development](07-testing-and-development.md) | Test layers, commands, isolation, accessibility checks, and troubleshooting |
| [Extending the app](08-extending-the-app.md) | Checklists for adding blocks, fields, rules, icons, and API changes |
| [Dependencies and libraries](09-dependencies-and-libraries.md) | Direct runtime, build, test, and mock-server packages, with purpose and usage locations |

## Current boundary

The repository implements a desktop-first Home and workflow editor. The Home links to the studio and summarizes the latest valid browser save. In the editor, a user can define metadata, create a directed graph, configure nodes, create conditional branches, validate the graph, and persist the serialized result through a local mock API.

The following are intentionally outside the current implementation:

- executing campaigns, training, OSINT collection, or target updates;
- authentication, authorization, tenancy, or production database behavior;
- server-side graph validation and workflow execution scheduling;
- the disabled custom-block creation control;
- a deployment-ready backend.

Where the UI uses terms such as “start campaign” or “run OSINT,” the editor is describing a future workflow action. It does not perform that action.

## Sources of truth

| Concern | Source |
| --- | --- |
| Node kinds and data contracts | [`src/features/workflow/types.ts`](../src/features/workflow/types.ts) |
| Routes and page loading | [`src/App.tsx`](../src/App.tsx) |
| Main navigation | [`src/components/layout/SideNavigation.tsx`](../src/components/layout/SideNavigation.tsx) |
| Available templates and defaults | [`src/features/workflow/catalog.ts`](../src/features/workflow/catalog.ts) |
| Shared editor state | [`src/components/workflow/WorkflowProvider.tsx`](../src/components/workflow/WorkflowProvider.tsx) |
| Graph validation | [`src/features/workflow/validation/validateWorkflow.ts`](../src/features/workflow/validation/validateWorkflow.ts) |
| Client API contract | [`src/features/workflow/api/workflows.ts`](../src/features/workflow/api/workflows.ts) |
| Mock server behavior | [`mocks/server.cjs`](../mocks/server.cjs) |
| Commands and dependency versions | [`package.json`](../package.json) |

These documents describe the current code, not a separate specification. When behavior changes, update the relevant source and documentation in the same change.

## End-of-session synchronization

Documentation review is mandatory before every project handoff. Follow [`agentic/END-SESSION.md`](../agentic/END-SESSION.md) and compare the session's changes with this mapping:

| Changed concern | Documentation to review |
| --- | --- |
| Page structure, navigation, dependencies, or subsystem boundaries | `01-system-overview.md` |
| Entrypoints, scripts, ports, proxy, or environment variables | `02-bootstrap-and-runtime.md` |
| Provider state, editor operations, IDs, or browser restoration | `03-frontend-state-and-data-flow.md` |
| Catalog templates, kinds, defaults, or inspector options | `04-workflow-blocks.md` |
| Types, graph rules, condition semantics, or validation codes | `05-graph-model-and-validation.md` |
| HTTP contract, server behavior, database, or localStorage | `06-api-and-persistence.md` |
| Commands, test coverage, isolation, accessibility, or troubleshooting | `07-testing-and-development.md` |
| Required implementation steps for future extensions | `08-extending-the-app.md` |
| Direct npm dependencies, toolchain libraries, or package usage locations | `09-dependencies-and-libraries.md` |

For incomplete work, record any outstanding documentation updates in the active task and handoff. A task must not be archived while its implemented behavior and these guides knowingly disagree.

## Terminology

- **Draft:** the editable `WorkflowDraft` held by the React provider.
- **Kind:** one member of the discriminated `WorkflowNodeKind` union.
- **Template:** a catalog entry used to create a node. Multiple templates may share one kind.
- **Block/node:** a template instance placed on the React Flow canvas.
- **Branch:** one named output of a condition node.
- **Mock API:** the local JSON Server process. It persists JSON but does not execute workflows.
- **Home:** the `/` route, which reads the latest local save without mounting workflow state.
