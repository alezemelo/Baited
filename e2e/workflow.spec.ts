import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const mockApiBaseUrl = 'http://127.0.0.1:3002/api'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem('baited-e2e-initialized')) {
      window.localStorage.clear()
      window.sessionStorage.setItem('baited-e2e-initialized', 'true')
    }
  })
})

test('completes save error, retry and refresh recovery', async ({
  page,
  request,
}) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.goto('/workflow')
  await page.getByLabel('Nome workflow').fill('Workflow E2E')
  await page.getByRole('button', { name: 'Apri workflow' }).press('Enter')
  await page.getByRole('button', { name: 'Carica workflow di esempio' }).click()

  await page.getByText('Training di base', { exact: true }).click()
  await page.getByLabel('Target campagna Q3').check()
  await page.getByText('Email aperta?', { exact: true }).click({ force: true })
  await page.getByLabel('Timeout valutazione (minuti)').fill('60')
  await page.getByRole('button', { name: 'Vai alla revisione' }).press('Enter')
  await expect(page.getByText('9 connessioni')).toBeVisible()

  const saveButton = page.getByRole('button', { name: 'Salva workflow' })
  await expect(saveButton).toBeEnabled()
  await page.getByLabel('Simula un errore al prossimo tentativo').check()
  await saveButton.click()
  await expect(
    page.getByText('Salvataggio non riuscito', { exact: true }),
  ).toBeVisible()
  const failedRecordsResponse = await request.get(
    `${mockApiBaseUrl}/workflows`,
  )
  expect(failedRecordsResponse.ok()).toBe(true)
  expect(await failedRecordsResponse.json()).toEqual([])
  consoleErrors.length = 0

  await page.getByRole('button', { name: 'Riprova' }).click()
  await expect(page.getByText('Workflow salvato')).toBeVisible()
  const savedId = await page.getByText(/^ID: workflow-/).textContent()

  expect(savedId).toBeTruthy()
  const workflowId = savedId!.replace('ID: ', '')
  const persistedResponse = await request.get(
    `${mockApiBaseUrl}/workflows/${workflowId}`,
  )
  expect(persistedResponse.ok()).toBe(true)
  expect(await persistedResponse.json()).toMatchObject({
    id: workflowId,
    version: 1,
    status: 'saved',
    metadata: { name: 'Campagna Q3 — Sicurezza email' },
  })
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('baited:last-saved-workflow'),
    ),
  ).toContain(workflowId)
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('baited:last-saved-workflow'),
    ),
  ).toContain('"waitForMinutes":60')
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('baited:last-saved-workflow'),
    ),
  ).toContain('"kind":"generate_scenario_from_osint"')

  await page.getByRole('link', { name: 'Workflow salvati' }).click()
  await expect(page).toHaveURL('/workflows')
  await expect(
    page.getByRole('heading', { name: 'Workflow salvati' }),
  ).toBeVisible()
  await expect(page.getByText('Campagna Q3 — Sicurezza email')).toBeVisible()
  await expect(page.getByText(workflowId)).toBeVisible()
  await expect(page.getByText('9 nodi')).toBeVisible()
  await page.getByRole('link', { name: 'Workflow', exact: true }).click()

  await page.reload()
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByRole('button', { name: 'Vai alla revisione' }).click()
  await expect(page.getByText(savedId!)).toBeVisible()
  await expect(page.getByText('Draft allineato')).toBeVisible()

  await page.getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL('/')
  const recentWorkflow = page.getByRole('region', { name: 'Ultimo workflow' })
  await expect(
    recentWorkflow.getByText('Campagna Q3 — Sicurezza email', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('9 nodi')).toBeVisible()
  await expect(page.getByText('9 connessioni')).toBeVisible()

  await page.getByRole('link', { name: 'Workflow salvati' }).click()
  await page
    .getByRole('button', {
      name: 'Elimina workflow Campagna Q3 — Sicurezza email',
    })
    .click()
  await page
    .getByRole('button', { name: 'Elimina workflow', exact: true })
    .click()
  await expect(page.getByText('Nessun workflow salvato')).toBeVisible()
  const deletedWorkflowResponse = await request.get(
    `${mockApiBaseUrl}/workflows/${workflowId}`,
  )
  expect(deletedWorkflowResponse.status()).toBe(404)
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('baited:last-saved-workflow'),
    ),
  ).toBeNull()
  await page.getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByText('Nessun workflow salvato')).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('supports keyboard block creation and warns about unsaved changes', async ({ page }) => {
  await page.goto('/workflow')
  await expect(page.getByLabel('Nome workflow')).toHaveValue('')
  await page.getByLabel('Nome workflow').fill('Workflow da zero')
  await page.getByRole('button', { name: 'Apri workflow' }).press('Enter')
  await expect(page.getByText('Inizia dal nodo Start')).toBeVisible()

  const addStart = page.getByRole('button', {
    name: 'Aggiungi Target selezionati al canvas',
  })
  await addStart.focus()
  await addStart.press('Enter')

  const addOsint = page.getByRole('button', {
    name: 'Aggiungi Analisi OSINT al canvas',
  })
  await addOsint.focus()
  await addOsint.press('Enter')

  await expect(page.getByLabel('Tipo OSINT')).toBeVisible()
  const addScenario = page.getByRole('button', {
    name: 'Aggiungi Genera scenario OSINT al canvas',
  })
  await addScenario.focus()
  await addScenario.press('Enter')
  await expect(page.getByLabel('Scenario predefinito')).toBeVisible()
  expect(
    await page.evaluate(() => {
      const event = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(event)
      return event.defaultPrevented
    }),
  ).toBe(true)

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('modifiche non salvate')
    await dialog.accept()
  })
  await page.getByRole('button', { name: 'Nuovo workflow' }).click()
  await expect(page.getByLabel('Nome workflow')).toHaveValue('')
})

test('selects and deletes an existing workflow connection', async ({ page }) => {
  await page.goto('/workflow')
  await page.getByLabel('Nome workflow').fill('Workflow connessioni')
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByRole('button', { name: 'Carica workflow di esempio' }).click()

  await page
    .locator('.react-flow__edge[data-id="targets-osint"] .react-flow__edge-path')
    .click({ force: true })
  await expect(
    page.getByRole('heading', {
      name: 'Target selezionati → Analisi OSINT',
    }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Elimina connessione' }).click()
  const confirmation = page.getByRole('alertdialog', {
    name: 'Conferma eliminazione connessione',
  })
  await expect(confirmation).toBeVisible()
  await confirmation
    .getByRole('button', { name: 'Elimina connessione' })
    .click()

  await page.getByRole('button', { name: 'Vai alla revisione' }).click()
  await expect(page.getByText('8 connessioni')).toBeVisible()
  await expect(page.getByText(/errori strutturali/)).toBeVisible()

  await page
    .getByRole('button', {
      name: /Vai a nodo osint: Analisi OSINT non ha connessioni in ingresso\./,
    })
    .click()
  await expect(
    page.getByLabel('Proprietà del nodo').getByRole('heading', {
      name: 'Analisi OSINT',
    }),
  ).toBeVisible()
})

test('reconnects an existing workflow connection endpoint', async ({ page }) => {
  await page.goto('/workflow')
  await page.getByLabel('Nome workflow').fill('Workflow reconnect')
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByRole('button', { name: 'Carica workflow di esempio' }).click()

  const edge = page.locator('.react-flow__edge[data-id="risk-training"]')
  await edge.locator('.react-flow__edge-path').click({ force: true })
  await expect(
    page.getByRole('heading', {
      name: 'Gruppo alto rischio → Training di base',
    }),
  ).toBeVisible()
  await page.waitForTimeout(500)

  const updaterBox = await edge
    .locator('.react-flow__edgeupdater-target')
    .boundingBox()
  const targetBox = await page
    .locator('.react-flow__node[data-id="end"] .react-flow__handle.target')
    .boundingBox()

  expect(updaterBox).not.toBeNull()
  expect(targetBox).not.toBeNull()

  await page.mouse.move(
    updaterBox!.x + updaterBox!.width / 2,
    updaterBox!.y + updaterBox!.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    targetBox!.x + targetBox!.width / 2,
    targetBox!.y + targetBox!.height / 2,
    { steps: 12 },
  )
  await page.mouse.up()

  await expect(
    page.getByRole('heading', {
      name: 'Gruppo alto rischio → Campagna completata',
    }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Vai alla revisione' }).click()
  await expect(page.getByText('9 connessioni')).toBeVisible()
  await expect(page.getByText(/errori strutturali/)).toBeVisible()
})

test('has no detectable accessibility violations in details and review', async ({ page }) => {
  await page.goto('/route-inesistente')
  await expect(page).toHaveURL('/')
  await expect(
    page.getByRole('heading', {
      name: 'Progetta ogni risposta, dal primo segnale alla formazione.',
    }),
  ).toBeVisible()

  const homeAudit = await new AxeBuilder({ page }).analyze()
  expect(homeAudit.violations).toEqual([])

  const workflowLink = page.getByRole('link', {
    name: 'Workflow',
    exact: true,
  })
  await workflowLink.focus()
  await workflowLink.press('Enter')
  await expect(page).toHaveURL('/workflow')
  await expect(page.locator('header img[alt="Baited"]')).toBeVisible()

  const wizardProgress = page.getByRole('navigation', {
    name: 'Avanzamento creazione workflow',
  })
  await expect(
    wizardProgress.getByRole('heading', { name: 'Workflow accessibile' }),
  ).toHaveCount(0)

  const detailsAudit = await new AxeBuilder({ page }).analyze()
  expect(detailsAudit.violations).toEqual([])

  await page.getByLabel('Nome workflow').fill('Workflow accessibile')
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await expect(
    wizardProgress.getByRole('heading', { name: 'Workflow accessibile' }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Workflow accessibile', level: 2 }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Carica workflow di esempio' }).click()
  await page.getByText('Training di base', { exact: true }).click()
  await page.getByLabel('Target campagna Q3').check()
  await page.getByRole('button', { name: 'Vai alla revisione' }).click()
  await expect(
    wizardProgress.getByRole('heading', {
      name: 'Campagna Q3 — Sicurezza email',
    }),
  ).toHaveCount(0)

  const reviewAudit = await new AxeBuilder({ page }).analyze()
  expect(reviewAudit.violations).toEqual([])
})

test('protects a dirty workflow during SPA and history navigation', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Workflow', exact: true }).click()
  await page.getByLabel('Nome workflow').fill('Workflow protetto')
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByRole('button', {
    name: 'Aggiungi Target selezionati al canvas',
  }).click()

  const rejectedDialogPromise = page.waitForEvent('dialog')
  const rejectedNavigation = page.getByRole('link', { name: 'Home' }).click()
  const rejectedDialog = await rejectedDialogPromise
  expect(rejectedDialog.message()).toContain('modifiche non salvate')
  await rejectedDialog.dismiss()
  await rejectedNavigation
  await expect(page).toHaveURL('/workflow')

  const acceptedDialogPromise = page.waitForEvent('dialog')
  const acceptedNavigation = page.goBack()
  const acceptedDialog = await acceptedDialogPromise
  expect(acceptedDialog.message()).toContain('modifiche non salvate')
  await acceptedDialog.accept()
  await acceptedNavigation
  await expect(page).toHaveURL('/')

  await page.goForward()
  await expect(page).toHaveURL('/workflow')
})
