# Testing and Development

## Test layers

| Layer | Tooling | Coverage |
| --- | --- | --- |
| Domain and API integration | TypeScript compilation plus Node test runner | Serialization, real JSON Server process, storage restoration, DAG algorithms, configuration, and OSINT rules |
| Component | Vitest, Testing Library, user-event, jsdom | Home empty/saved states, route-aware rail, details focus, node inspector fields, keyboard library use, provider dirty/reset behavior, and delete confirmation |
| End to end | Playwright Chromium and axe | Home/editor navigation, dirty SPA/history blocking, save error/retry/persistence/reload, keyboard creation, unsaved-change warning, and accessibility audits |

Primary test sources are [`tests/`](../tests), component `*.test.tsx` files under [`src/`](../src), and [`e2e/workflow.spec.ts`](../e2e/workflow.spec.ts).

## Commands

```bash
npm run test          # domain/API tests followed by component tests
npm run test:domain   # compile and run Node domain/API tests
npm run test:unit     # run Vitest component tests
npm run test:e2e      # run Playwright Chromium scenarios
npm run build         # TypeScript project build and Vite production build
npm run lint          # oxlint
```

Install the Playwright browser once if it is unavailable:

```bash
npx playwright install chromium
```

## API test isolation

Domain/API tests allocate an available loopback port, spawn `mocks/server.cjs`, set the simulated delay to zero, and use a temporary database directory. Teardown terminates the child process and removes that directory.

Playwright uses a separate fixed API on port 3002 with `mocks/data/e2e-db.json`. The `mock:api:e2e` command resets that database at suite startup. Vite runs on port 4173 and receives `VITE_MOCK_API_TARGET=http://127.0.0.1:3002`.

Development data on port 3001 is therefore not read or modified by automated tests.

## Accessibility coverage

The E2E suite runs axe on Home, Details, and Review. Component and browser tests also cover route links, accessible labels, error announcements, focus movement, keyboard block creation, and destructive-action confirmation.

The documented MVP exception is React Flow's visual pan, zoom, and edge-creation interaction, which requires a pointing device. Adding blocks, configuring them, reviewing errors, and saving remain keyboard accessible.

## Expected change workflow

For a normal application change:

1. update the typed model and implementation;
2. add the narrowest domain or component test that proves the behavior;
3. add or update E2E coverage only for critical cross-layer journeys;
4. run `npm run test`, `npm run test:e2e`, `npm run build`, and `npm run lint` when the change crosses layers;
5. update the relevant document in this folder.

The repository's agentic workflow also requires reading [`agentic/START-SESSION.md`](../agentic/START-SESSION.md) before changes and [`agentic/END-SESSION.md`](../agentic/END-SESSION.md) before handoff.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Save shows a network error | Confirm the API is running and Vite proxies to the correct `VITE_MOCK_API_TARGET` |
| API cannot bind | Check ports 3001 for development and 3002 for E2E |
| Tests see unexpected records | Confirm the appropriate reset command and isolated database path are used |
| Restored UI differs from server data | Inspect `baited:last-saved-workflow`; reload restoration uses localStorage, not an API GET |
| Playwright cannot launch | Run `npx playwright install chromium` |
| Workflow cannot save | Inspect structured validation issues in Review and focus the associated node |
| A changed branch shows an invalid edge | Reconnect edges whose `sourceHandle` refers to a removed condition rule |
| Refreshing `/workflow` returns a server 404 | Configure the production host with an SPA fallback to `index.html` |

For implementation touchpoints, continue with [Extending the app](08-extending-the-app.md).
