# API and Persistence

## Server lifecycle

The local API is implemented by [`mocks/server.cjs`](../mocks/server.cjs) on JSON Server 0.17.4. It creates `mocks/data/db.json` from [`db.seed.json`](../mocks/db.seed.json) when the runtime database is absent or `--reset` is supplied.

The runtime `mocks/data/` directory is ignored by Git. Normal development retains records between API restarts; reset mode replaces them with:

```json
{
  "workflows": []
}
```

To clear all saved mock workflows, stop any running API process and run:

```bash
npm run mock:api:reset
```

After reset, `/workflows` and the Home "Ultimo workflow" card are empty because both read from `GET /api/workflows`. The reset does not clear browser localStorage. If `/workflow` without an ID still restores an old local draft, clear the editor restore record in the browser console:

```js
localStorage.removeItem('baited:last-saved-workflow')
```

The server defaults to host `127.0.0.1`, port `3001`, and a simulated delay of 500 ms. It accepts `HOST`, `PORT`, and `MOCK_API_DELAY_MS` environment variables plus `--host`, `--port`, `--db`, and `--reset` CLI options.

## Supported application endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Readiness response `{ "status": "ok" }` |
| `POST` | `/api/workflows` | Validate the top-level shape, persist a complete record, and return compact save metadata |
| `GET` | `/api/workflows` | List persisted mock workflow records |
| `GET` | `/api/workflows/:id` | Read one persisted record; missing IDs return JSON Server's 404 |
| `DELETE` | `/api/workflows/:id` | Remove one persisted mock workflow record |

The underlying JSON Server router also exposes generic mutation routes. The frontend does not use them, and they are not part of the application-level contract documented here.

## Create request

[`serializeWorkflow`](../src/features/workflow/api/workflows.ts) removes transient React Flow UI state and sends:

```json
{
  "version": 1,
  "metadata": {
    "name": "Campaign Q3",
    "description": "Multichannel simulation",
    "category": "Phishing simulation",
    "targetGroupId": "target-group-q3"
  },
  "nodes": [
    {
      "id": "targets",
      "type": "baitedWorkflow",
      "position": { "x": 20, "y": 230 },
      "data": {
        "kind": "workflow_start",
        "label": "Selected targets",
        "subtitle": "1 target group",
        "category": "Trigger",
        "icon": "users",
        "status": "pronto",
        "config": { "targetsIncluded": ["target-group-q3"] }
      }
    }
  ],
  "edges": []
}
```

The server checks only `version === 1`, a non-null metadata object, and array-valued `nodes` and `edges`. Detailed graph validation is currently a browser responsibility.

## Create response and stored record

A successful request returns HTTP `201`:

```json
{
  "id": "workflow-550e8400-e29b-41d4-a716-446655440000",
  "version": 1,
  "status": "saved",
  "createdAt": "2026-07-06T12:00:00.000Z"
}
```

The database record contains the complete request plus those four response fields. IDs use `crypto.randomUUID()` with a `workflow-` prefix.

`GET /api/workflows` returns an array of those complete database records. [`WorkflowsPage`](../src/pages/WorkflowsPage.tsx) sorts them newest-first in the browser and displays workflow name, category, target, ID, saved date, node count, and edge count. [`HomePage`](../src/pages/HomePage.tsx) uses the same list endpoint to show the newest workflow under "Ultimo workflow".

`GET /api/workflows/:id` is used by `/workflow/:workflowId` to open a saved workflow directly from the mock database. The fetched record is converted into the editable draft passed to `WorkflowProvider`.

`DELETE /api/workflows/:id` removes a record from the mock database. The archive page requires confirmation before calling it, keeps the record visible if deletion fails, and updates the in-memory list after success.

## Error responses

| Status | Trigger | Body |
| --- | --- | --- |
| `400` | Invalid top-level request shape | `{ "message": "Payload workflow non valido." }` |
| `503` | Header `x-baited-simulate-error: true` | `{ "message": "Errore mock: salvataggio non riuscito. Riprova." }` |

The simulated `503` happens before persistence. The review checkbox applies the header to one attempt and clears itself before the request, so the next retry can succeed.

The API client parses the JSON body, turns non-2xx responses into `WorkflowApiError`, and rejects successful responses that do not contain a valid ID, version, status, and timestamp.

## Browser persistence

After a successful save, the frontend separately stores this structure under `baited:last-saved-workflow`:

```ts
interface SavedWorkflowRecord {
  request: CreateWorkflowRequest
  response: CreateWorkflowResponse
}
```

This localStorage record restores the editor on reload. It does not replace the mock database: the two copies exist for different demo behaviors, as explained in [Frontend state and data flow](03-frontend-state-and-data-flow.md).

The saved-workflows page and Home latest-workflow card no longer write API records into localStorage before opening the editor; they link to `/workflow/:id`, which fetches by ID. If a workflow matching `baited:last-saved-workflow` is deleted from the archive, the page still removes the localStorage record so `/workflow` without an ID does not restore a workflow that no longer exists in the mock database.

## curl and Postman

Start the API alone when testing it outside the UI:

```bash
npm run mock:api:reset
```

Then verify health, create a record, and list records:

```bash
curl http://127.0.0.1:3001/api/health

curl --request POST http://127.0.0.1:3001/api/workflows \
  --header 'content-type: application/json' \
  --data '{"version":1,"metadata":{"name":"curl test","description":"","category":"Test","targetGroupId":"test-group"},"nodes":[],"edges":[]}'

curl http://127.0.0.1:3001/api/workflows

curl --request DELETE http://127.0.0.1:3001/api/workflows/workflow-id-here
```

In Postman, use the same URL, select a raw JSON body, and set `Content-Type: application/json`. Add `x-baited-simulate-error: true` to test the `503` path. Copy the returned ID into `GET /api/workflows/:id` to inspect the complete persisted record.

## Production boundary

This API is a local mock with permissive CORS, no authentication, shallow validation, and file-based storage. It must not be exposed as a production backend. A real service should preserve or explicitly version the client contract, provide authoritative validation, and route `/api` appropriately.
