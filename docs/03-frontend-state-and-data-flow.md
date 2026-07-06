# Frontend State and Data Flow

## State ownership

[`WorkflowProvider`](../src/components/workflow/WorkflowProvider.tsx) is the canonical owner of workflow state. It exposes the typed interface declared in [`WorkflowContext.ts`](../src/features/workflow/WorkflowContext.ts).

| State | Owner | Notes |
| --- | --- | --- |
| Metadata, nodes, and edges | `WorkflowProvider` | Combined into a memoized `WorkflowDraft` |
| Draft ID, version, and status | `WorkflowProvider` | Replaced when a new or restored draft is loaded |
| Selected node | `WorkflowProvider` | Mirrored into each React Flow node's `selected` flag |
| Validation result | Derived in `WorkflowProvider` | Recomputed by the pure validator whenever the draft changes |
| Dirty state | Derived in `WorkflowProvider` | Serialized draft compared with the last saved snapshot |
| Current wizard step | `WorkflowWizard` | UI-only state, not serialized |
| Highest visited step | `WorkflowWizard` | Prevents jumping to unvisited future steps |
| React Flow instance and viewport | `WorkflowCanvas` | UI-only and omitted from the API payload |
| Save loading/error/success state | `WorkflowReviewStep` | Reducer state, separate from the draft |

## Data flow

```mermaid
flowchart TD
  Library["Node library"] -->|template ID| Wizard["WorkflowWizard"]
  Wizard -->|addNode| Provider["WorkflowProvider"]
  Canvas["React Flow canvas"] -->|move, connect, select| Provider
  Inspector["NodeInspector"] -->|typed data updater| Provider
  Provider --> Draft["WorkflowDraft"]
  Draft --> Validator["validateWorkflow"]
  Validator --> Canvas
  Validator --> Review["WorkflowReviewStep"]
  Draft --> Serializer["serializeWorkflow"]
  Serializer --> API["POST /api/workflows"]
  API --> Local["localStorage record"]
  Local -->|next mount| Provider
```

## Editor operations

The context exposes explicit operations rather than a general state setter:

- update metadata;
- add, select, update, duplicate, or remove a node;
- connect nodes subject to immediate connection guards;
- apply React Flow node and edge changes;
- mark a serialized request as saved;
- start an empty workflow or load the example.

Removing a node also removes all incident edges. Duplicating a node copies its data and offsets its position by 40 pixels, but does not copy its connections.

## Adding and moving blocks

The library uses the custom drag MIME type `application/x-baited-node-template`. On drop, screen coordinates are converted into flow coordinates by the React Flow instance. A short spatial/time guard prevents the same pointer gesture from creating duplicate nodes.

Every library entry is also a button. Activating it by mouse, Enter, or Space adds the node at a calculated grid-like position, which is the keyboard-accessible alternative to drag-and-drop.

React Flow reports position and edge changes back to the provider. The provider remains the source of truth and supplies the resulting node and edge arrays back to the canvas.

## Connection behavior

Before accepting a connection, the provider rejects:

- missing source or target IDs;
- self-connections;
- edges that would introduce a cycle;
- connections forbidden by source/target rules;
- connections beyond input/output limits;
- duplicate source/target/branch combinations;
- a second outgoing edge from the same condition branch.

Condition edges copy the branch label and store `branchId` plus `branchType`. Editing a branch label synchronizes existing edge labels and metadata. Removing a condition rule can leave an old edge dangling; the validator reports that state instead of silently deleting the edge.

## IDs

IDs are generated client-side for editor entities and server-side for saved workflows:

| Entity | Current format |
| --- | --- |
| New node | `<kind>-<Date.now()>-<in-memory sequence>` |
| New edge | `<source>-<target>-<Date.now()>-<in-memory sequence>` |
| Duplicated node | `<source-id>-copy-<Date.now()>-<in-memory sequence>` |
| Added condition rule | `rule-<Date.now()>` |
| New empty draft | `workflow-new-<Date.now()>-<in-memory sequence>` |
| Saved workflow | `workflow-<crypto.randomUUID()>` |

The in-memory counters reset on reload. These IDs are adequate for the MVP editor, but they are not a cross-device identity strategy.

## Dirty state and persistence

Dirty state is calculated by serializing the current draft and comparing its JSON string with the last saved request snapshot. Selection, validation styling, and other React Flow-only state are removed by the serializer, so they do not make the workflow dirty.

After a successful save:

1. the request and compact response are stored together in localStorage;
2. the exact request becomes the provider's clean snapshot;
3. the review reducer enters the success state.

On reload, the stored request rebuilds the editable draft and the response ID becomes its ID. The JSON Server database and localStorage serve different purposes: the database provides mock HTTP persistence, while localStorage restores the browser editor without a GET-on-mount flow.

See [Graph model and validation](05-graph-model-and-validation.md) for derived validation and [API and persistence](06-api-and-persistence.md) for the save contract.

