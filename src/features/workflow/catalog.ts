import type {
  CreateWorkflowNodeOptions,
  NodeLibraryBlock,
  WorkflowNode,
  WorkflowNodeCatalogItem,
} from './types'

const singleInputSingleOutput = {
  allowIncoming: true,
  allowOutgoing: true,
  maxIncoming: 1,
  maxOutgoing: 1,
} as const

export const workflowNodeCatalog = [
  {
    id: 'workflow-start',
    kind: 'workflow_start',
    label: 'Target selezionati',
    description: 'Avvia il workflow sui target',
    category: 'Trigger',
    icon: 'users',
    availableInLibrary: false,
    connectionRules: {
      allowIncoming: false,
      allowOutgoing: true,
      maxIncoming: 0,
      maxOutgoing: 1,
    },
    defaultData: {
      kind: 'workflow_start',
      label: 'Target selezionati',
      subtitle: '124 destinatari',
      category: 'Trigger',
      icon: 'users',
      status: 'pronto',
      config: { targetsIncluded: ['target-group-q3'] },
    },
  },
  {
    id: 'create-campaign-email',
    kind: 'create_campaign',
    label: 'Campagna email',
    description: 'Invio mirato e tracciabile',
    category: 'Campagne',
    icon: 'mail',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'create_campaign',
      label: 'Campagna email',
      subtitle: 'Scenario: accesso Microsoft 365',
      category: 'Email',
      icon: 'mail',
      status: 'attivo',
      config: {
        campaignId: 'campaign-email-q3',
        channel: 'email',
        elapsedTimeMinutes: 2880,
        targetsIncluded: ['target-group-q3'],
      },
    },
  },
  {
    id: 'create-campaign-sms',
    kind: 'create_campaign',
    label: 'Campagna SMS',
    description: 'Messaggio su canale mobile',
    category: 'Campagne',
    icon: 'message',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'create_campaign',
      label: 'Invia campagna SMS',
      subtitle: 'Solo target non ingaggiati',
      category: 'SMS',
      icon: 'message',
      status: 'bozza',
      config: {
        campaignId: 'campaign-sms-follow-up',
        channel: 'sms',
        elapsedTimeMinutes: 1440,
        targetsIncluded: ['target-group-q3'],
      },
    },
  },
  {
    id: 'condition-email-opened',
    kind: 'condition',
    label: 'Condizione',
    description: 'Crea un branch if / else',
    category: 'Logica',
    icon: 'branch',
    availableInLibrary: true,
    connectionRules: {
      allowIncoming: true,
      allowOutgoing: true,
      maxIncoming: 1,
      maxOutgoing: null,
    },
    defaultData: {
      kind: 'condition',
      label: 'Email aperta?',
      subtitle: 'Attendi fino a 48 ore',
      category: 'Condizione',
      icon: 'branch',
      status: 'pronto',
      config: {
        waitForMinutes: 2880,
        rules: [
          {
            id: 'yes',
            label: 'Aperta',
            field: 'email_opened',
            operator: 'equals',
            value: true,
          },
        ],
        elseBranch: { id: 'no', label: 'Non aperta' },
      },
    },
  },
  {
    id: 'add-target-high-risk',
    kind: 'add_target_to_group',
    label: 'Aggiungi al gruppo',
    description: 'Aggiorna il rischio del target',
    category: 'Target',
    icon: 'shield',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'add_target_to_group',
      label: 'Gruppo alto rischio',
      subtitle: 'Aggiungi target coinvolti',
      category: 'Target',
      icon: 'shield',
      status: 'pronto',
      config: { groupId: 'high-risk', targets: [] },
    },
  },
  {
    id: 'start-awareness-basic',
    kind: 'start_awareness_campaign',
    label: 'Avvia training',
    description: 'Assegna formazione mirata',
    category: 'Awareness',
    icon: 'training',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'start_awareness_campaign',
      label: 'Training di base',
      subtitle: 'Percorso: phishing awareness',
      category: 'Awareness',
      icon: 'training',
      status: 'bozza',
      config: {
        campaignId: 'awareness-basic',
        elapsedTimeMinutes: 0,
        targetsIncluded: [],
      },
    },
  },
  {
    id: 'start-osint-social',
    kind: 'start_osint_on_targets',
    label: 'Analisi OSINT',
    description: 'Raccogli informazioni aperte',
    category: 'Intelligence',
    icon: 'search',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'start_osint_on_targets',
      label: 'Analisi OSINT',
      subtitle: 'Fonti social e professionali',
      category: 'Intelligence',
      icon: 'search',
      status: 'pronto',
      config: { targets: ['target-group-q3'], type: 'social' },
    },
  },
  {
    id: 'generate-scenario-osint',
    kind: 'generate_scenario_from_osint',
    label: 'Genera scenario OSINT',
    description: 'Crea uno scenario dalle evidenze',
    category: 'Intelligence',
    icon: 'sparkles',
    availableInLibrary: true,
    connectionRules: singleInputSingleOutput,
    defaultData: {
      kind: 'generate_scenario_from_osint',
      label: 'Scenario OSINT mirato',
      subtitle: 'Credential harvest · Email',
      category: 'Intelligence',
      icon: 'sparkles',
      status: 'pronto',
      config: {
        scenarioTemplate: 'credential_harvest',
        channel: 'email',
        evidenceStrategy: 'most_relevant',
      },
    },
  },
  {
    id: 'workflow-end',
    kind: 'workflow_end',
    label: 'Fine workflow',
    description: 'Conclude il flusso',
    category: 'Fine',
    icon: 'flag',
    availableInLibrary: false,
    connectionRules: {
      allowIncoming: true,
      allowOutgoing: false,
      maxIncoming: null,
      maxOutgoing: 0,
    },
    defaultData: {
      kind: 'workflow_end',
      label: 'Campagna completata',
      subtitle: 'Salva risultati e metriche',
      category: 'Fine',
      icon: 'flag',
      status: 'pronto',
      config: { outcome: 'completed' },
    },
  },
] satisfies readonly WorkflowNodeCatalogItem[]

let generatedNodeSequence = 0

function createGeneratedNodeId(kind: string) {
  generatedNodeSequence += 1
  return `${kind}-${Date.now()}-${generatedNodeSequence}`
}

export const nodeLibraryBlocks: NodeLibraryBlock[] = workflowNodeCatalog
  .filter((item) => item.availableInLibrary)
  .map(({ category, description, icon, id, kind, label }) => ({
    id,
    label,
    description,
    category,
    icon,
    kind,
  }))

export function getWorkflowNodeConnectionRules(kind: WorkflowNodeCatalogItem['kind']) {
  return workflowNodeCatalog.find((item) => item.kind === kind)?.connectionRules
}

export function createWorkflowNode(
  templateId: string,
  options: CreateWorkflowNodeOptions = {},
): WorkflowNode | null {
  const template = workflowNodeCatalog.find((item) => item.id === templateId)

  if (!template) {
    return null
  }

  return {
    id: options.id ?? createGeneratedNodeId(template.kind),
    type: 'baitedWorkflow',
    position: options.position ?? { x: 0, y: 0 },
    data: structuredClone(template.defaultData),
  }
}
