# Extending the App

This guide follows the current typed architecture. The disabled “custom block” button is not a runtime plugin system; new supported blocks are code changes.

## Add a routed page

1. Create a `Page`-suffixed component under `src/pages/` and preserve the existing shell tokens and landmarks.
2. Add a lazy import and route in `App.tsx`; choose an explicit path and fallback behavior.
3. Convert the matching disabled rail item into a `NavLink`. Active state must come from the route, not a static flag.
4. If leaving the page can discard state, add a React Router blocker as well as any required `beforeunload` protection.
5. Cover direct URL loading, rail navigation, back/forward, keyboard use, unknown-route behavior, and an axe audit.
6. Update system overview, bootstrap/runtime, state flow, and testing documentation in the same session.

## Add a template that reuses an existing kind

Use this path when only defaults, label, icon, or category differ—for example, the existing email and SMS campaign presets.

1. Add one catalog item in [`catalog.ts`](../src/features/workflow/catalog.ts) with a unique template `id`.
2. Reuse the existing `kind`, compatible `defaultData`, and connection rules.
3. Ensure any default required fields are intentionally complete or explicitly documented as incomplete.
4. Add catalog/library coverage and update the inventory in [Workflow blocks](04-workflow-blocks.md).

No serializer change is needed because nodes are serialized generically.

## Add a new node kind

Complete every step:

1. **Domain types:** extend `WorkflowNodeKind`, define its config and node-data interface, and add that interface to `WorkflowNodeData`.
2. **Catalog:** add a template with defaults, icon, category, library visibility, and explicit input/output limits.
3. **Visuals:** extend `WorkflowIconName` and [`WorkflowIcon.tsx`](../src/components/workflow/WorkflowIcon.tsx) when a new icon is required; add any kind-specific card styling in `WorkflowNodeCard.tsx`.
4. **Inspector:** add typed controls and route the new discriminator in [`NodeInspector.tsx`](../src/components/workflow/NodeInspector.tsx). Extend completion validation, subtitle derivation, and status derivation.
5. **Domain validation:** add required-field checks and any cross-node prerequisite to `validateWorkflow.ts`. Put reusable traversal logic in `graph.ts`.
6. **Provider behavior:** change `WorkflowProvider` only if the kind needs special connection handles or edge metadata synchronization.
7. **Tests:** cover catalog exposure, configuration editing, required fields, connection behavior, and any cross-node rule.
8. **Documentation:** add exactly one template row to [Workflow blocks](04-workflow-blocks.md) and describe new graph rules in [Graph model and validation](05-graph-model-and-validation.md).

## Add or change a configuration field

Update the field in this order:

1. its config interface in `types.ts`;
2. every catalog default and example fixture for that kind;
3. inspector control and option domain;
4. completion subtitle/status if the field affects presentation;
5. node-level and graph-level validation;
6. serializer/API tests to prove the field survives structured cloning and serialization;
7. block and API examples in this documentation when the public payload changes.

Avoid maintaining independent defaults in the UI: the catalog factory should create every node from one canonical `defaultData` object.

## Add condition behavior

Condition branches are not ordinary action outputs. Preserve these invariants:

- every rule and the final else branch have stable IDs;
- the React Flow `sourceHandle` equals the branch ID;
- edge `branchId`, `branchType`, and label stay synchronized;
- one branch can have only one outgoing edge;
- rule order is meaningful for display and future evaluation;
- at least one rule and one final else branch remain.

If string comparison is introduced in the inspector, update the control so it no longer coerces all values to boolean, add field-aware validation, and cover serialization. An actual condition evaluator would be a new backend/runtime capability, not an inspector-only change.

## Change the API contract

Treat request or response changes as a versioned cross-layer change:

1. update request/response interfaces and runtime response guards in [`workflows.ts`](../src/features/workflow/api/workflows.ts);
2. update serialization without leaking React Flow UI-only state;
3. update the mock server's validation, stored record, and compact response;
4. decide how existing localStorage records and database records migrate or fail closed;
5. update API integration and E2E persistence assertions;
6. update [API and persistence](06-api-and-persistence.md).

Do not silently reinterpret `version: 1`. Introduce a new version when compatibility is broken.

## Definition of done

An extension is complete when:

- the discriminated union narrows correctly without unsafe casts;
- catalog defaults produce a renderable node;
- the inspector can configure all required fields accessibly;
- provider connection guards and the pure validator agree;
- invalid drafts cannot be saved and valid drafts serialize correctly;
- domain/component tests cover the new behavior and critical journeys have E2E coverage;
- the documentation inventory, validation rules, and API examples match the code.

Use [Testing and development](07-testing-and-development.md) for commands and isolation behavior.
