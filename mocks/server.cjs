const { randomUUID } = require('node:crypto')
const { copyFileSync, existsSync, mkdirSync } = require('node:fs')
const path = require('node:path')
const jsonServer = require('json-server')

const projectRoot = path.resolve(__dirname, '..')
const seedPath = path.join(__dirname, 'db.seed.json')
const options = parseOptions(process.argv.slice(2))
const databasePath = path.resolve(
  projectRoot,
  options.database ?? 'mocks/data/db.json',
)

mkdirSync(path.dirname(databasePath), { recursive: true })

if (options.reset || !existsSync(databasePath)) {
  copyFileSync(seedPath, databasePath)
}

const app = jsonServer.create()
const router = jsonServer.router(databasePath)
const delayMilliseconds = parseDelay(process.env.MOCK_API_DELAY_MS)

app.use(
  jsonServer.defaults({
    logger: process.env.NODE_ENV !== 'test',
    noCors: false,
  }),
)
app.use(jsonServer.bodyParser)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.post('/api/workflows', async (request, response) => {
  if (delayMilliseconds > 0) {
    await delay(delayMilliseconds)
  }

  if (request.get('x-baited-simulate-error') === 'true') {
    response.status(503).json({
      message: 'Errore mock: salvataggio non riuscito. Riprova.',
    })
    return
  }

  if (!isCreateWorkflowRequest(request.body)) {
    response.status(400).json({ message: 'Payload workflow non valido.' })
    return
  }

  const savedWorkflow = {
    ...request.body,
    id: `workflow-${randomUUID()}`,
    status: 'saved',
    createdAt: new Date().toISOString(),
  }

  await router.db.get('workflows').push(savedWorkflow).write()

  response.status(201).json({
    id: savedWorkflow.id,
    version: savedWorkflow.version,
    status: savedWorkflow.status,
    createdAt: savedWorkflow.createdAt,
  })
})

app.use('/api', router)

const server = app.listen(options.port, options.host, () => {
  console.log(
    `Baited mock API ready at http://${options.host}:${options.port}/api`,
  )
  console.log(`Database: ${databasePath}`)
})

server.on('error', (error) => {
  console.error(`Mock API failed: ${error.message}`)
  process.exitCode = 1
})

function isCreateWorkflowRequest(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.version === 1 &&
    typeof value.metadata === 'object' &&
    value.metadata !== null &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges)
  )
}

function parseOptions(argumentsList) {
  const options = {
    database: undefined,
    host: process.env.HOST || '127.0.0.1',
    port: parsePort(process.env.PORT || '3001'),
    reset: false,
  }

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index]

    if (argument === '--reset') {
      options.reset = true
      continue
    }

    if (argument === '--db' || argument === '--host' || argument === '--port') {
      const value = argumentsList[index + 1]

      if (!value) {
        throw new Error(`Missing value for ${argument}`)
      }

      if (argument === '--db') options.database = value
      if (argument === '--host') options.host = value
      if (argument === '--port') options.port = parsePort(value)
      index += 1
      continue
    }

    throw new Error(`Unknown option: ${argument}`)
  }

  return options
}

function parsePort(value) {
  const port = Number.parseInt(value, 10)

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid port: ${value}`)
  }

  return port
}

function parseDelay(value) {
  if (value === undefined) return 500

  const milliseconds = Number.parseInt(value, 10)
  return Number.isInteger(milliseconds) && milliseconds >= 0 ? milliseconds : 500
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
