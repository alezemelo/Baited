import type {
  WorkflowDraft,
  WorkflowEdgeData,
  WorkflowMetadata,
  WorkflowNodeData,
} from '../types'

export const LAST_SAVED_WORKFLOW_KEY = 'baited:last-saved-workflow'

export interface SerializedWorkflowNode {
  id: string
  type: 'baitedWorkflow'
  position: { x: number; y: number }
  data: WorkflowNodeData
}

export interface SerializedWorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  type?: string
  label?: string
  data?: WorkflowEdgeData
}

export interface CreateWorkflowRequest {
  version: 1
  metadata: WorkflowMetadata
  nodes: SerializedWorkflowNode[]
  edges: SerializedWorkflowEdge[]
}

export interface CreateWorkflowResponse {
  id: string
  version: 1
  status: 'saved'
  createdAt: string
}

export interface SavedWorkflowRecord {
  request: CreateWorkflowRequest
  response: CreateWorkflowResponse
}

export type SavedWorkflowResource = CreateWorkflowRequest &
  CreateWorkflowResponse

export interface WorkflowStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export type WorkflowSaveState =
  | { status: 'idle'; savedWorkflow: null }
  | { status: 'loading'; savedWorkflow: SavedWorkflowRecord | null }
  | { status: 'success'; savedWorkflow: SavedWorkflowRecord }
  | {
      status: 'error'
      savedWorkflow: SavedWorkflowRecord | null
      message: string
    }

export type WorkflowSaveAction =
  | { type: 'save_started' }
  | { type: 'save_succeeded'; record: SavedWorkflowRecord }
  | { type: 'save_failed'; message: string }

interface SaveWorkflowOptions {
  endpoint?: string
  simulateError?: boolean
}

interface ListWorkflowsOptions {
  endpoint?: string
  signal?: AbortSignal
}

export class WorkflowApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'WorkflowApiError'
    this.status = status
  }
}

export function serializeWorkflow(
  draft: WorkflowDraft,
): CreateWorkflowRequest {
  return {
    version: 1,
    metadata: structuredClone(draft.metadata),
    nodes: draft.nodes.map((node) => ({
      id: node.id,
      type: 'baitedWorkflow',
      position: { ...node.position },
      data: structuredClone(node.data),
    })),
    edges: draft.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      ...(edge.sourceHandle !== undefined
        ? { sourceHandle: edge.sourceHandle }
        : {}),
      ...(edge.targetHandle !== undefined
        ? { targetHandle: edge.targetHandle }
        : {}),
      ...(edge.type ? { type: edge.type } : {}),
      ...(typeof edge.label === 'string' ? { label: edge.label } : {}),
      ...(edge.data ? { data: structuredClone(edge.data) } : {}),
    })),
  }
}

export async function saveWorkflow(
  request: CreateWorkflowRequest,
  options: SaveWorkflowOptions = {},
): Promise<CreateWorkflowResponse> {
  const response = await fetch(options.endpoint ?? '/api/workflows', {
    body: JSON.stringify(request),
    headers: {
      'content-type': 'application/json',
      ...(options.simulateError
        ? { 'x-baited-simulate-error': 'true' }
        : {}),
    },
    method: 'POST',
  })
  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new WorkflowApiError(getApiErrorMessage(body), response.status)
  }

  if (!isCreateWorkflowResponse(body)) {
    throw new WorkflowApiError('La risposta API non è valida.', response.status)
  }

  return body
}

export async function listSavedWorkflows(
  options: ListWorkflowsOptions = {},
): Promise<SavedWorkflowResource[]> {
  const response = await fetch(options.endpoint ?? '/api/workflows', {
    signal: options.signal,
  })
  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new WorkflowApiError(getApiErrorMessage(body), response.status)
  }

  if (!Array.isArray(body) || !body.every(isSavedWorkflowResource)) {
    throw new WorkflowApiError('La risposta API non è valida.', response.status)
  }

  return [...body].sort(
    (first, second) =>
      Date.parse(second.createdAt) - Date.parse(first.createdAt),
  )
}

export function getWorkflowResourceRecord(
  workflow: SavedWorkflowResource,
): SavedWorkflowRecord {
  const { createdAt, id, status, version, ...request } = workflow

  return {
    request: {
      version,
      metadata: structuredClone(request.metadata),
      nodes: structuredClone(request.nodes),
      edges: structuredClone(request.edges),
    },
    response: { createdAt, id, status, version },
  }
}

export function persistLastSavedWorkflow(
  record: SavedWorkflowRecord,
  storage: WorkflowStorage,
) {
  storage.setItem(LAST_SAVED_WORKFLOW_KEY, JSON.stringify(record))
}

export function loadLastSavedWorkflow(
  storage: WorkflowStorage,
): SavedWorkflowRecord | null {
  const serializedRecord = storage.getItem(LAST_SAVED_WORKFLOW_KEY)

  if (!serializedRecord) {
    return null
  }

  try {
    const record: unknown = JSON.parse(serializedRecord)
    return isSavedWorkflowRecord(record) ? record : null
  } catch {
    return null
  }
}

export function restoreWorkflowDraft(
  record: SavedWorkflowRecord,
): WorkflowDraft {
  return {
    id: record.response.id,
    version: record.request.version,
    status: 'draft',
    metadata: structuredClone(record.request.metadata),
    nodes: structuredClone(record.request.nodes),
    edges: structuredClone(record.request.edges),
  }
}

export function workflowSaveReducer(
  state: WorkflowSaveState,
  action: WorkflowSaveAction,
): WorkflowSaveState {
  if (action.type === 'save_started') {
    return { status: 'loading', savedWorkflow: state.savedWorkflow }
  }

  if (action.type === 'save_succeeded') {
    return { status: 'success', savedWorkflow: action.record }
  }

  return {
    status: 'error',
    savedWorkflow: state.savedWorkflow,
    message: action.message,
  }
}

export function createInitialWorkflowSaveState(
  savedWorkflow: SavedWorkflowRecord | null,
): WorkflowSaveState {
  return savedWorkflow
    ? { status: 'success', savedWorkflow }
    : { status: 'idle', savedWorkflow: null }
}

function getApiErrorMessage(body: unknown) {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message
  }

  return 'Non è stato possibile salvare il workflow.'
}

function isSavedWorkflowRecord(value: unknown): value is SavedWorkflowRecord {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Partial<SavedWorkflowRecord>

  return (
    isCreateWorkflowRequest(record.request) &&
    isCreateWorkflowResponse(record.response)
  )
}

function isCreateWorkflowRequest(
  value: unknown,
): value is CreateWorkflowRequest {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const request = value as Partial<CreateWorkflowRequest>

  return (
    request.version === 1 &&
    typeof request.metadata === 'object' &&
    request.metadata !== null &&
    Array.isArray(request.nodes) &&
    Array.isArray(request.edges)
  )
}

function isCreateWorkflowResponse(
  value: unknown,
): value is CreateWorkflowResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const response = value as Partial<CreateWorkflowResponse>

  return (
    typeof response.id === 'string' &&
    response.id.length > 0 &&
    response.version === 1 &&
    response.status === 'saved' &&
    typeof response.createdAt === 'string' &&
    !Number.isNaN(Date.parse(response.createdAt))
  )
}

function isSavedWorkflowResource(
  value: unknown,
): value is SavedWorkflowResource {
  return isCreateWorkflowRequest(value) && isCreateWorkflowResponse(value)
}
