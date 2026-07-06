# Graph Model and Validation

## Draft shape

The domain model in [`types.ts`](../src/features/workflow/types.ts) wraps React Flow nodes and edges in a versioned draft:

```ts
interface WorkflowDraft {
  id: string
  version: 1
  status: 'draft'
  metadata: WorkflowMetadata
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}
```

`WorkflowNodeData` is a discriminated union keyed by `kind`. Each kind owns a specific `config` shape, so an editor or validator can narrow the data without casts. Every serialized node uses the React Flow type `baitedWorkflow`.

Edges contain `source` and `target` node IDs. Condition edges additionally use `sourceHandle` to identify a branch and may carry:

```ts
interface WorkflowEdgeData {
  branchId?: string
  branchType?: 'rule' | 'else'
}
```

The handle, edge label, and edge metadata are kept aligned when a condition branch is edited.

## Graph invariants

[`validateWorkflow`](../src/features/workflow/validation/validateWorkflow.ts) is a pure function. A draft is valid only when all of these hold:

- exactly one start exists;
- at least one end exists;
- every edge references existing nodes and respects connection rules;
- no self-loop, duplicate edge, or directed cycle exists;
- every non-start node has an incoming edge;
- every node is reachable from the unique start;
- every node reachable from start can reach at least one end;
- every condition branch has exactly one outgoing edge and no stale branch handle;
- scenario-generation nodes are downstream from an OSINT node;
- required per-kind configuration is complete.

The provider also prevents many invalid connections at interaction time. Full validation remains necessary because imported, restored, or previously connected data can still become invalid after configuration changes.

## Validation issues

Every issue has `severity: "error"` and may identify a node, edge, branch, or field. The UI uses those IDs to highlight graph elements and return focus from review to the relevant node.

| Code | Meaning |
| --- | --- |
| `missing_start` | No start node exists |
| `multiple_start` | More than one start exists |
| `missing_end` | No end node exists |
| `invalid_connection` | An endpoint, direction, limit, or branch cardinality is invalid |
| `self_loop` | An edge targets its own source |
| `duplicate_edge` | The same source, branch handle, target, and target handle are repeated |
| `cycle_detected` | One or more nodes participate in a directed cycle |
| `orphan_node` | A non-start node has no incoming edge |
| `unreachable_node` | A node cannot be reached from the unique start |
| `unterminated_path` | A reachable node cannot eventually reach any end |
| `missing_condition_branch` | A declared condition branch has no outgoing edge |
| `dangling_condition_branch` | An edge references a removed or inconsistent branch |
| `missing_osint_source` | Scenario generation is not downstream from OSINT |
| `missing_required_field` | A node configuration field is incomplete or invalid |

## Required configuration

All node labels must be non-empty. Additional checks are:

| Kind family | Required data |
| --- | --- |
| Start | At least one included target group |
| Campaign | Campaign ID and at least one included target group |
| Awareness | Awareness campaign ID and at least one included target group |
| Target group update | Destination group ID |
| OSINT | At least one target |
| Scenario generation | Template, output channel, and evidence strategy |
| Condition | Finite non-negative timeout, at least one named rule, and named else branch |
| End | The outcome is constrained by the TypeScript union and inspector options |

Numeric inputs use minutes. `waitForMinutes` is the maximum delay before branch evaluation; `elapsedTimeMinutes` belongs to campaign or awareness actions and describes their own configured wait.

## Algorithms

Graph helpers in [`graph.ts`](../src/features/workflow/validation/graph.ts) build forward and reverse adjacency maps:

- breadth-first traversal from start determines reachability;
- reverse traversal from all end nodes identifies nodes that can terminate;
- forward traversal from all OSINT nodes establishes scenario prerequisites;
- depth-first traversal identifies existing cycle members;
- a prospective connection is rejected if a path already exists from its target back to its source.

The reachability and termination passes are O(V + E). Validation does not mutate the draft.

## Save gating

The review step disables saving whenever `validation.isValid` is false. Validation is client-side; the mock server performs only shallow request-shape checks. A production backend must not rely on the browser and would need authoritative schema and graph validation.

See [Workflow blocks](04-workflow-blocks.md) for per-template defaults and [API and persistence](06-api-and-persistence.md) for the serialized wire format.

