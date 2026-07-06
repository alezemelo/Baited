# Workflow Blocks

## Catalog model

The node library is generated from [`workflowNodeCatalog`](../src/features/workflow/catalog.ts). The catalog currently contains **nine draggable templates** representing **eight node kinds**. Email and SMS are two presets of the same `create_campaign` kind.

All templates are mock workflow descriptions: placing or saving one does not execute its external action.

Connection notation below uses `incoming → outgoing`. `∞` means the catalog has no numeric limit; condition outputs are still limited to one edge per branch.

## Template inventory

| Template ID | Kind | Purpose and resulting role | Default configuration | Connections | Requirements and prerequisites |
| --- | --- | --- | --- | --- | --- |
| `workflow-start` | `workflow_start` | Establish the target population and unique entry point | `targetsIncluded: ["target-group-q3"]` | `0 → 1` | Exactly one start is allowed; at least one target group is required |
| `create-campaign-email` | `create_campaign` | Describe a trackable email campaign action | `campaignId: "campaign-email-q3"`, `channel: "email"`, `elapsedTimeMinutes: 2880`, Q3 targets | `1 → 1` | Campaign ID and at least one target group are required |
| `create-campaign-sms` | `create_campaign` | Describe an SMS follow-up campaign action | `campaignId: "campaign-sms-follow-up"`, `channel: "sms"`, `elapsedTimeMinutes: 1440`, Q3 targets | `1 → 1` | Campaign ID and at least one target group are required |
| `condition-email-opened` | `condition` | Wait, evaluate ordered rules, and branch through `if`/`else if`/`else` outputs | `waitForMinutes: 2880`; rule `email_opened equals true`; else “Non aperta” | `1 → ∞` | At least one named rule and a named else branch are required; every branch needs exactly one outgoing edge before save |
| `add-target-high-risk` | `add_target_to_group` | Describe adding matching targets to a destination group | `groupId: "high-risk"`, `targets: []` | `1 → 1` | Destination group is required; specific targets are optional |
| `start-awareness-basic` | `start_awareness_campaign` | Describe assigning a basic awareness-training path | `campaignId: "awareness-basic"`, `elapsedTimeMinutes: 0`, `targetsIncluded: []` | `1 → 1` | Training ID and at least one target group are required; the default is intentionally incomplete |
| `start-osint-social` | `start_osint_on_targets` | Describe collecting open-source intelligence for selected targets | `targets: ["target-group-q3"]`, `type: "social"` | `1 → 1` | At least one target is required |
| `generate-scenario-osint` | `generate_scenario_from_osint` | Describe generating a campaign scenario from earlier OSINT evidence | `scenarioTemplate: "credential_harvest"`, `channel: "email"`, `evidenceStrategy: "most_relevant"` | `1 → 1` | All three fields are required, and the node must be downstream from an OSINT node |
| `workflow-end` | `workflow_end` | Terminate one or more workflow paths with a recorded outcome | `outcome: "completed"` | `∞ → 0` | At least one end must exist; every reachable path must be able to reach an end |

## Configuration domains

- Campaign channels: `email`, `sms`, `im`.
- OSINT types: `social`, `company`, `domain`.
- Scenario templates: `credential_harvest`, `executive_impersonation`, `supplier_fraud`.
- Evidence strategies: `most_relevant`, `broad`, `recent`.
- End outcomes: `completed`, `high_risk`, `stopped`.
- Condition fields: `email_opened`, `link_clicked`, `credentials_submitted`, `campaign_status`.
- Condition operators: `equals`, `not_equals`.

The inspector currently offers fixed demo options for campaigns, awareness paths, and target groups. These values are local UI constants, not records loaded from an API.

## Condition operator and value semantics

A condition rule is serialized as:

```json
{
  "id": "yes",
  "label": "Aperta",
  "field": "email_opened",
  "operator": "equals",
  "value": true
}
```

`field` identifies the future campaign result to inspect. `operator` describes equality or inequality, and `value` is the expected comparison value. Rule order represents `if`, then zero or more `else if` branches; the final `else` has no comparison.

In the current MVP, these rules are **not evaluated by an execution engine**. They are editor metadata used for handles, labels, validation, and serialization. The TypeScript model permits `boolean | string`, but the current inspector presents only Yes/No and writes a boolean for every field, including `campaign_status`.

## Node presentation state

Every node has an editable label plus catalog-provided category, icon, subtitle, and status. Inspector updates derive the subtitle from the configuration. Incomplete required fields set the node to `bozza` with `Config incompleta`; a complete campaign becomes `attivo`, while other complete nodes become `pronto`.

For graph-wide rules and save blocking, continue with [Graph model and validation](05-graph-model-and-validation.md). To add another template or kind, use [Extending the app](08-extending-the-app.md).

