import { MarkerType, type Edge, type Node } from '@xyflow/react'
import type { NodeLibraryBlock, WorkflowNodeData } from './types'

export type BaitedWorkflowNode = Node<WorkflowNodeData, 'baitedWorkflow'>

export const nodeLibraryBlocks: NodeLibraryBlock[] = [
  {
    id: 'campaign-email',
    label: 'Campagna email',
    description: 'Invio mirato e tracciabile',
    category: 'Campagne',
    icon: 'mail',
    kind: 'campaign',
  },
  {
    id: 'campaign-sms',
    label: 'Campagna SMS',
    description: 'Messaggio su canale mobile',
    category: 'Campagne',
    icon: 'message',
    kind: 'campaign',
  },
  {
    id: 'condition',
    label: 'Condizione',
    description: 'Crea un branch if / else',
    category: 'Logica',
    icon: 'branch',
    kind: 'condition',
  },
  {
    id: 'risk-group',
    label: 'Aggiungi al gruppo',
    description: 'Aggiorna il rischio del target',
    category: 'Target',
    icon: 'shield',
    kind: 'action',
  },
  {
    id: 'training',
    label: 'Avvia training',
    description: 'Assegna formazione mirata',
    category: 'Awareness',
    icon: 'training',
    kind: 'training',
  },
  {
    id: 'osint',
    label: 'Analisi OSINT',
    description: 'Raccogli informazioni aperte',
    category: 'Intelligence',
    icon: 'search',
    kind: 'action',
  },
]

export const initialWorkflowNodes: BaitedWorkflowNode[] = [
  {
    id: 'targets',
    type: 'baitedWorkflow',
    position: { x: 20, y: 230 },
    data: {
      label: 'Target selezionati',
      subtitle: '124 destinatari',
      category: 'Trigger',
      icon: 'users',
      kind: 'trigger',
      status: 'pronto',
    },
  },
  {
    id: 'email',
    type: 'baitedWorkflow',
    position: { x: 270, y: 230 },
    data: {
      label: 'Campagna email',
      subtitle: 'Scenario: accesso Microsoft 365',
      category: 'Email',
      icon: 'mail',
      kind: 'campaign',
      status: 'attivo',
    },
  },
  {
    id: 'opened',
    type: 'baitedWorkflow',
    position: { x: 530, y: 230 },
    data: {
      label: 'Email aperta?',
      subtitle: 'Attendi fino a 48 ore',
      category: 'Condizione',
      icon: 'branch',
      kind: 'condition',
      status: 'pronto',
    },
  },
  {
    id: 'sms',
    type: 'baitedWorkflow',
    position: { x: 800, y: 80 },
    data: {
      label: 'Invia campagna SMS',
      subtitle: 'Solo target non ingaggiati',
      category: 'SMS',
      icon: 'message',
      kind: 'campaign',
      status: 'bozza',
    },
  },
  {
    id: 'risk',
    type: 'baitedWorkflow',
    position: { x: 800, y: 380 },
    data: {
      label: 'Gruppo alto rischio',
      subtitle: 'Aggiungi target coinvolti',
      category: 'Target',
      icon: 'shield',
      kind: 'action',
      status: 'pronto',
    },
  },
  {
    id: 'training',
    type: 'baitedWorkflow',
    position: { x: 1060, y: 380 },
    data: {
      label: 'Training di base',
      subtitle: 'Percorso: phishing awareness',
      category: 'Awareness',
      icon: 'training',
      kind: 'training',
      status: 'bozza',
    },
  },
  {
    id: 'end',
    type: 'baitedWorkflow',
    position: { x: 1060, y: 80 },
    data: {
      label: 'Campagna completata',
      subtitle: 'Salva risultati e metriche',
      category: 'Fine',
      icon: 'flag',
      kind: 'end',
      status: 'pronto',
    },
  },
]

const markerEnd = { type: MarkerType.ArrowClosed, color: '#4de082' }

export const initialWorkflowEdges: Edge[] = [
  {
    id: 'targets-email',
    source: 'targets',
    target: 'email',
    markerEnd,
  },
  {
    id: 'email-opened',
    source: 'email',
    target: 'opened',
    markerEnd,
  },
  {
    id: 'opened-sms',
    source: 'opened',
    sourceHandle: 'no',
    target: 'sms',
    label: 'Non aperta',
    markerEnd,
  },
  {
    id: 'sms-end',
    source: 'sms',
    target: 'end',
    markerEnd,
  },
  {
    id: 'opened-risk',
    source: 'opened',
    sourceHandle: 'yes',
    target: 'risk',
    label: 'Aperta',
    markerEnd,
  },
  {
    id: 'risk-training',
    source: 'risk',
    target: 'training',
    markerEnd,
  },
]
