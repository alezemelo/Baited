import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem('baited-e2e-initialized')) {
      window.localStorage.clear()
      window.sessionStorage.setItem('baited-e2e-initialized', 'true')
    }
  })
})

test('completes save error, retry and refresh recovery', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Apri workflow' }).press('Enter')

  await page.getByText('Training di base', { exact: true }).click()
  await page.getByLabel('Target campagna Q3').check()
  await page.getByRole('button', { name: 'Vai alla revisione' }).press('Enter')

  const saveButton = page.getByRole('button', { name: 'Salva workflow' })
  await expect(saveButton).toBeEnabled()
  await page.getByLabel('Simula un errore al prossimo tentativo').check()
  await saveButton.click()
  await expect(
    page.getByText('Salvataggio non riuscito', { exact: true }),
  ).toBeVisible()
  consoleErrors.length = 0

  await page.getByRole('button', { name: 'Riprova' }).click()
  await expect(page.getByText('Workflow salvato')).toBeVisible()
  const savedId = await page.getByText(/^ID: workflow-/).textContent()

  expect(savedId).toBeTruthy()
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('baited:last-saved-workflow'),
    ),
  ).toContain(savedId!.replace('ID: ', ''))

  await page.reload()
  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByRole('button', { name: 'Vai alla revisione' }).click()
  await expect(page.getByText(savedId!)).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('supports keyboard block creation and warns about unsaved changes', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Apri workflow' }).press('Enter')

  const addOsint = page.getByRole('button', {
    name: 'Aggiungi Analisi OSINT al canvas',
  })
  await addOsint.focus()
  await addOsint.press('Enter')

  await expect(page.getByLabel('Tipo OSINT')).toBeVisible()
  expect(
    await page.evaluate(() => {
      const event = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(event)
      return event.defaultPrevented
    }),
  ).toBe(true)
})

test('has no detectable accessibility violations in details and review', async ({ page }) => {
  await page.goto('/')

  const detailsAudit = await new AxeBuilder({ page }).analyze()
  expect(detailsAudit.violations).toEqual([])

  await page.getByRole('button', { name: 'Apri workflow' }).click()
  await page.getByText('Training di base', { exact: true }).click()
  await page.getByLabel('Target campagna Q3').check()
  await page.getByRole('button', { name: 'Vai alla revisione' }).click()

  const reviewAudit = await new AxeBuilder({ page }).analyze()
  expect(reviewAudit.violations).toEqual([])
})
