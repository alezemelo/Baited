import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type {
  AddTargetToGroupNodeData,
  CampaignChannel,
  ConditionField,
  ConditionNodeData,
  ConditionOperator,
  ConditionRule,
  CreateCampaignNodeData,
  GenerateScenarioFromOsintNodeData,
  OsintEvidenceStrategy,
  OsintType,
  ScenarioTemplate,
  StartAwarenessCampaignNodeData,
  StartOsintOnTargetsNodeData,
  WorkflowEndNodeData,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeStatus,
  WorkflowStartNodeData,
} from '../../features/workflow/types'
import {
  MultiSelectField,
  NumberField,
  SelectField,
  TextField,
} from './config/FormControls'

interface NodeInspectorProps {
  node: WorkflowNode
  onUpdate: (
    updater: (currentData: WorkflowNodeData) => WorkflowNodeData,
  ) => void
}

const targetGroupOptions = [
  { label: 'Target campagna Q3', value: 'target-group-q3' },
  { label: 'Target alto rischio', value: 'high-risk' },
  { label: 'Nuovi assunti', value: 'new-hires' },
] as const

const campaignOptions = [
  { label: 'Microsoft 365 login', value: 'campaign-email-q3' },
  { label: 'Follow-up SMS', value: 'campaign-sms-follow-up' },
  { label: 'Executive spear phishing', value: 'campaign-exec' },
] as const

const awarenessOptions = [
  { label: 'Phishing awareness', value: 'awareness-basic' },
  { label: 'Security onboarding', value: 'awareness-onboarding' },
  { label: 'Executive coaching', value: 'awareness-executive' },
] as const

const channelOptions: readonly {
  label: string
  value: CampaignChannel
}[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Instant message', value: 'im' },
]

const osintOptions: readonly {
  label: string
  value: OsintType
}[] = [
  { label: 'Social', value: 'social' },
  { label: 'Azienda', value: 'company' },
  { label: 'Dominio', value: 'domain' },
]

const scenarioTemplateOptions: readonly {
  label: string
  value: ScenarioTemplate
}[] = [
  { label: 'Raccolta credenziali', value: 'credential_harvest' },
  { label: 'Impersonificazione executive', value: 'executive_impersonation' },
  { label: 'Frode fornitore', value: 'supplier_fraud' },
]

const evidenceStrategyOptions: readonly {
  label: string
  value: OsintEvidenceStrategy
}[] = [
  { label: 'Evidenze più rilevanti', value: 'most_relevant' },
  { label: 'Copertura ampia', value: 'broad' },
  { label: 'Evidenze recenti', value: 'recent' },
]

const outcomeOptions: readonly {
  label: string
  value: WorkflowEndNodeData['config']['outcome']
}[] = [
  { label: 'Completato', value: 'completed' },
  { label: 'Alto rischio', value: 'high_risk' },
  { label: 'Interrotto', value: 'stopped' },
]

const conditionFieldOptions: readonly {
  label: string
  value: ConditionField
}[] = [
  { label: 'Email aperta', value: 'email_opened' },
  { label: 'Link cliccato', value: 'link_clicked' },
  { label: 'Credenziali inviate', value: 'credentials_submitted' },
  { label: 'Stato campagna', value: 'campaign_status' },
]

const conditionOperatorOptions: readonly {
  label: string
  value: ConditionOperator
}[] = [
  { label: 'È uguale a', value: 'equals' },
  { label: 'È diverso da', value: 'not_equals' },
]

const booleanOptions = [
  { label: 'Sì', value: 'true' },
  { label: 'No', value: 'false' },
] as const

export function NodeInspector({ node, onUpdate }: NodeInspectorProps) {
  const data = node.data
  const validation = validateNodeData(data)
  const fieldPrefix = `node-${node.id}`

  const updateData = (
    updater: (currentData: WorkflowNodeData) => WorkflowNodeData,
  ) => {
    onUpdate((currentData) => {
      if (currentData.kind !== data.kind) {
        return currentData
      }

      return withValidationState(updater(currentData))
    })
  }

  const updateLabel = (label: string) => {
    updateData((currentData) => ({
      ...currentData,
      label,
    }))
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-surface-container p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-secondary">
            Configurazione
          </p>
          <h3 className="mt-1 text-sm font-semibold text-on-surface">
            {data.label}
          </h3>
        </div>
        <span
          className={`rounded-full px-2 py-1 font-label text-[9px] font-medium uppercase tracking-wide ${
            validation.isComplete
              ? 'bg-secondary/10 text-secondary'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {validation.isComplete ? 'Completo' : 'Incompleto'}
        </span>
      </div>

      <div className="mt-4 space-y-4 border-t border-white/[0.07] pt-4">
        <TextField
          error={validation.errors.label}
          id={`${fieldPrefix}-label`}
          label="Etichetta"
          onChange={updateLabel}
          required
          value={data.label}
        />

        {data.kind === 'workflow_start' ? (
          <WorkflowStartFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'workflow_start'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'create_campaign' ? (
          <CreateCampaignFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'create_campaign'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'start_awareness_campaign' ? (
          <AwarenessFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'start_awareness_campaign'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'add_target_to_group' ? (
          <AddTargetFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'add_target_to_group'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'start_osint_on_targets' ? (
          <OsintFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'start_osint_on_targets'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'generate_scenario_from_osint' ? (
          <GenerateScenarioFromOsintFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'generate_scenario_from_osint'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'condition' ? (
          <ConditionFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'condition'
                  ? updater(currentData)
                  : currentData,
              )
            }
            validation={validation}
          />
        ) : null}

        {data.kind === 'workflow_end' ? (
          <WorkflowEndFields
            data={data}
            fieldPrefix={fieldPrefix}
            onUpdate={(updater) =>
              updateData((currentData) =>
                currentData.kind === 'workflow_end'
                  ? updater(currentData)
                  : currentData,
              )
            }
          />
        ) : null}
      </div>
    </div>
  )
}

function WorkflowStartFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: WorkflowStartNodeData
  fieldPrefix: string
  onUpdate: (updater: (currentData: WorkflowStartNodeData) => WorkflowNodeData) => void
  validation: NodeValidation
}) {
  return (
    <MultiSelectField
      error={validation.errors.targetsIncluded}
      id={`${fieldPrefix}-targets`}
      label="Target inclusi"
      onChange={(targetsIncluded) =>
        onUpdate((currentData) => ({
          ...currentData,
          config: { targetsIncluded },
        }))
      }
      options={targetGroupOptions}
      required
      values={data.config.targetsIncluded}
    />
  )
}

function CreateCampaignFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: CreateCampaignNodeData
  fieldPrefix: string
  onUpdate: (updater: (currentData: CreateCampaignNodeData) => WorkflowNodeData) => void
  validation: NodeValidation
}) {
  return (
    <>
      <SelectField
        error={validation.errors.campaignId}
        id={`${fieldPrefix}-campaign`}
        label="Campagna"
        onChange={(campaignId) =>
          onUpdate((currentData) =>
            withCampaignCategory({
              ...currentData,
              config: { ...currentData.config, campaignId },
            }),
          )
        }
        options={campaignOptions}
        required
        value={data.config.campaignId}
      />
      <SelectField
        id={`${fieldPrefix}-channel`}
        label="Canale"
        onChange={(channel) =>
          onUpdate((currentData) =>
            withCampaignCategory({
              ...currentData,
              icon: channel === 'sms' ? 'message' : 'mail',
              config: { ...currentData.config, channel },
            }),
          )
        }
        options={channelOptions}
        required
        value={data.config.channel}
      />
      <NumberField
        id={`${fieldPrefix}-elapsed`}
        label="Attesa minuti"
        min={0}
        onChange={(elapsedTimeMinutes) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, elapsedTimeMinutes },
          }))
        }
        value={data.config.elapsedTimeMinutes}
      />
      <MultiSelectField
        error={validation.errors.targetsIncluded}
        id={`${fieldPrefix}-targets`}
        label="Target inclusi"
        onChange={(targetsIncluded) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, targetsIncluded },
          }))
        }
        options={targetGroupOptions}
        required
        values={data.config.targetsIncluded}
      />
    </>
  )
}

function AwarenessFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: StartAwarenessCampaignNodeData
  fieldPrefix: string
  onUpdate: (
    updater: (currentData: StartAwarenessCampaignNodeData) => WorkflowNodeData,
  ) => void
  validation: NodeValidation
}) {
  return (
    <>
      <SelectField
        error={validation.errors.campaignId}
        id={`${fieldPrefix}-awareness`}
        label="Percorso awareness"
        onChange={(campaignId) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, campaignId },
          }))
        }
        options={awarenessOptions}
        required
        value={data.config.campaignId}
      />
      <NumberField
        id={`${fieldPrefix}-elapsed`}
        label="Attesa minuti"
        min={0}
        onChange={(elapsedTimeMinutes) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, elapsedTimeMinutes },
          }))
        }
        value={data.config.elapsedTimeMinutes}
      />
      <MultiSelectField
        error={validation.errors.targetsIncluded}
        id={`${fieldPrefix}-targets`}
        label="Target inclusi"
        onChange={(targetsIncluded) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, targetsIncluded },
          }))
        }
        options={targetGroupOptions}
        required
        values={data.config.targetsIncluded}
      />
    </>
  )
}

function AddTargetFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: AddTargetToGroupNodeData
  fieldPrefix: string
  onUpdate: (updater: (currentData: AddTargetToGroupNodeData) => WorkflowNodeData) => void
  validation: NodeValidation
}) {
  return (
    <>
      <SelectField
        error={validation.errors.groupId}
        id={`${fieldPrefix}-group`}
        label="Gruppo destinazione"
        onChange={(groupId) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, groupId },
          }))
        }
        options={targetGroupOptions}
        required
        value={data.config.groupId}
      />
      <MultiSelectField
        id={`${fieldPrefix}-targets`}
        label="Target specifici"
        onChange={(targets) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, targets },
          }))
        }
        options={targetGroupOptions}
        values={data.config.targets}
      />
    </>
  )
}

function OsintFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: StartOsintOnTargetsNodeData
  fieldPrefix: string
  onUpdate: (
    updater: (currentData: StartOsintOnTargetsNodeData) => WorkflowNodeData,
  ) => void
  validation: NodeValidation
}) {
  return (
    <>
      <SelectField
        id={`${fieldPrefix}-type`}
        label="Tipo OSINT"
        onChange={(type) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, type },
          }))
        }
        options={osintOptions}
        required
        value={data.config.type}
      />
      <MultiSelectField
        error={validation.errors.targets}
        id={`${fieldPrefix}-targets`}
        label="Target analizzati"
        onChange={(targets) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, targets },
          }))
        }
        options={targetGroupOptions}
        required
        values={data.config.targets}
      />
    </>
  )
}

function GenerateScenarioFromOsintFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: GenerateScenarioFromOsintNodeData
  fieldPrefix: string
  onUpdate: (
    updater: (currentData: GenerateScenarioFromOsintNodeData) => WorkflowNodeData,
  ) => void
  validation: NodeValidation
}) {
  return (
    <>
      <SelectField
        error={validation.errors.scenarioTemplate}
        id={`${fieldPrefix}-scenario-template`}
        label="Scenario predefinito"
        onChange={(scenarioTemplate) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, scenarioTemplate },
          }))
        }
        options={scenarioTemplateOptions}
        required
        value={data.config.scenarioTemplate}
      />
      <SelectField
        error={validation.errors.channel}
        id={`${fieldPrefix}-channel`}
        label="Canale risultante"
        onChange={(channel) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, channel },
          }))
        }
        options={channelOptions}
        required
        value={data.config.channel}
      />
      <SelectField
        error={validation.errors.evidenceStrategy}
        id={`${fieldPrefix}-evidence-strategy`}
        label="Strategia evidenze OSINT"
        onChange={(evidenceStrategy) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, evidenceStrategy },
          }))
        }
        options={evidenceStrategyOptions}
        required
        value={data.config.evidenceStrategy}
      />
    </>
  )
}

function ConditionFields({
  data,
  fieldPrefix,
  onUpdate,
  validation,
}: {
  data: ConditionNodeData
  fieldPrefix: string
  onUpdate: (updater: (currentData: ConditionNodeData) => WorkflowNodeData) => void
  validation: NodeValidation
}) {
  const updateRule = (ruleId: string, patch: Partial<ConditionRule>) => {
    onUpdate((currentData) => ({
      ...currentData,
      config: {
        ...currentData.config,
        rules: currentData.config.rules.map((rule) =>
          rule.id === ruleId ? { ...rule, ...patch } : rule,
        ),
      },
    }))
  }

  const moveRule = (ruleId: string, direction: -1 | 1) => {
    onUpdate((currentData) => {
      const currentIndex = currentData.config.rules.findIndex(
        (rule) => rule.id === ruleId,
      )
      const targetIndex = currentIndex + direction

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= currentData.config.rules.length
      ) {
        return currentData
      }

      const rules = [...currentData.config.rules]
      const [rule] = rules.splice(currentIndex, 1)
      rules.splice(targetIndex, 0, rule)

      return {
        ...currentData,
        config: { ...currentData.config, rules },
      }
    })
  }

  const addRule = () => {
    onUpdate((currentData) => ({
      ...currentData,
      config: {
        ...currentData.config,
        rules: [
          ...currentData.config.rules,
          {
            id: `rule-${Date.now()}`,
            label: 'Nuova condizione',
            field: 'link_clicked',
            operator: 'equals',
            value: true,
          },
        ],
      },
    }))
  }

  const removeRule = (ruleId: string) => {
    onUpdate((currentData) => {
      if (currentData.config.rules.length <= 1) {
        return currentData
      }

      return {
        ...currentData,
        config: {
          ...currentData.config,
          rules: currentData.config.rules.filter((rule) => rule.id !== ruleId),
        },
      }
    })
  }

  return (
    <div className="space-y-3">
      <NumberField
        error={validation.errors.waitForMinutes}
        hint="Tempo massimo prima di valutare i branch, separato dall'attesa delle azioni."
        id={`${fieldPrefix}-wait-for`}
        label="Timeout valutazione (minuti)"
        min={0}
        onChange={(waitForMinutes) =>
          onUpdate((currentData) => ({
            ...currentData,
            config: { ...currentData.config, waitForMinutes },
          }))
        }
        required
        value={data.config.waitForMinutes}
      />
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-muted">
            Branch condizionali
          </p>
          <button
            className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 font-label text-[10px] text-on-surface-muted transition-colors hover:border-secondary/35 hover:text-secondary"
            onClick={addRule}
            type="button"
          >
            <Plus aria-hidden="true" className="size-3" />
            Else if
          </button>
        </div>
        {validation.errors.rules ? (
          <p
            className="mb-2 font-label text-[10px] font-medium text-primary"
            role="alert"
          >
            {validation.errors.rules}
          </p>
        ) : null}
        <div className="space-y-2">
          {data.config.rules.map((rule, index) => (
            <div
              className="rounded-lg border border-white/[0.07] bg-surface-lowest p-3"
              key={rule.id}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-secondary/10 px-2 py-1 font-label text-[9px] font-medium uppercase tracking-wide text-secondary">
                  {index === 0 ? 'If' : 'Else if'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Sposta regola su"
                    className="flex size-7 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-white/5 hover:text-on-surface disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => moveRule(rule.id, -1)}
                    type="button"
                  >
                    <ArrowUp aria-hidden="true" className="size-3.5" />
                  </button>
                  <button
                    aria-label="Sposta regola giù"
                    className="flex size-7 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-white/5 hover:text-on-surface disabled:opacity-30"
                    disabled={index === data.config.rules.length - 1}
                    onClick={() => moveRule(rule.id, 1)}
                    type="button"
                  >
                    <ArrowDown aria-hidden="true" className="size-3.5" />
                  </button>
                  <button
                    aria-label="Elimina regola"
                    className="flex size-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
                    disabled={data.config.rules.length <= 1}
                    onClick={() => removeRule(rule.id)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <TextField
                  error={validation.errors[`rule-${rule.id}-label`]}
                  id={`${fieldPrefix}-${rule.id}-label`}
                  label="Label branch"
                  onChange={(label) => updateRule(rule.id, { label })}
                  required
                  value={rule.label}
                />
                <SelectField
                  id={`${fieldPrefix}-${rule.id}-field`}
                  label="Campo"
                  onChange={(field) => updateRule(rule.id, { field })}
                  options={conditionFieldOptions}
                  value={rule.field}
                />
                <SelectField
                  id={`${fieldPrefix}-${rule.id}-operator`}
                  label="Operatore"
                  onChange={(operator) => updateRule(rule.id, { operator })}
                  options={conditionOperatorOptions}
                  value={rule.operator}
                />
                <SelectField
                  id={`${fieldPrefix}-${rule.id}-value`}
                  label="Valore"
                  onChange={(value) =>
                    updateRule(rule.id, { value: value === 'true' })
                  }
                  options={booleanOptions}
                  value={String(rule.value === true) as 'true' | 'false'}
                />
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-white/10 bg-surface-lowest p-3">
            <span className="rounded-full bg-primary/10 px-2 py-1 font-label text-[9px] font-medium uppercase tracking-wide text-primary">
              Else
            </span>
            <TextField
              error={validation.errors.elseBranch}
              id={`${fieldPrefix}-else`}
              label="Label branch finale"
              onChange={(label) =>
                onUpdate((currentData) => ({
                  ...currentData,
                  config: {
                    ...currentData.config,
                    elseBranch: {
                      ...currentData.config.elseBranch,
                      label,
                    },
                  },
                }))
              }
              required
              value={data.config.elseBranch.label}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowEndFields({
  data,
  fieldPrefix,
  onUpdate,
}: {
  data: WorkflowEndNodeData
  fieldPrefix: string
  onUpdate: (updater: (currentData: WorkflowEndNodeData) => WorkflowNodeData) => void
}) {
  return (
    <SelectField
      id={`${fieldPrefix}-outcome`}
      label="Esito workflow"
      onChange={(outcome) =>
        onUpdate((currentData) => ({
          ...currentData,
          config: { outcome },
        }))
      }
      options={outcomeOptions}
      value={data.config.outcome}
    />
  )
}

interface NodeValidation {
  errors: Record<string, string>
  isComplete: boolean
}

function validateNodeData(data: WorkflowNodeData): NodeValidation {
  const errors: Record<string, string> = {}

  if (!data.label.trim()) {
    errors.label = 'Etichetta obbligatoria.'
  }

  if (data.kind === 'workflow_start' && data.config.targetsIncluded.length === 0) {
    errors.targetsIncluded = 'Seleziona almeno un gruppo target.'
  }

  if (data.kind === 'create_campaign') {
    if (!data.config.campaignId) {
      errors.campaignId = 'Seleziona una campagna.'
    }

    if (data.config.targetsIncluded.length === 0) {
      errors.targetsIncluded = 'Seleziona almeno un gruppo target.'
    }
  }

  if (data.kind === 'start_awareness_campaign') {
    if (!data.config.campaignId) {
      errors.campaignId = 'Seleziona un percorso awareness.'
    }

    if (data.config.targetsIncluded.length === 0) {
      errors.targetsIncluded = 'Seleziona almeno un gruppo target.'
    }
  }

  if (data.kind === 'add_target_to_group' && !data.config.groupId) {
    errors.groupId = 'Seleziona il gruppo destinazione.'
  }

  if (data.kind === 'start_osint_on_targets' && data.config.targets.length === 0) {
    errors.targets = 'Seleziona almeno un target da analizzare.'
  }

  if (data.kind === 'generate_scenario_from_osint') {
    if (!data.config.scenarioTemplate) {
      errors.scenarioTemplate = 'Seleziona uno scenario predefinito.'
    }

    if (!data.config.channel) {
      errors.channel = 'Seleziona un canale risultante.'
    }

    if (!data.config.evidenceStrategy) {
      errors.evidenceStrategy = 'Seleziona una strategia per le evidenze.'
    }
  }

  if (data.kind === 'condition') {
    if (
      !Number.isFinite(data.config.waitForMinutes) ||
      data.config.waitForMinutes < 0
    ) {
      errors.waitForMinutes = 'Inserisci un timeout uguale o maggiore di zero.'
    }

    if (data.config.rules.length === 0) {
      errors.rules = 'Serve almeno una regola if.'
    }

    data.config.rules.forEach((rule) => {
      if (!rule.label.trim()) {
        errors[`rule-${rule.id}-label`] = 'Label branch obbligatoria.'
      }
    })

    if (!data.config.elseBranch.label.trim()) {
      errors.elseBranch = 'Il branch else deve avere una label.'
    }
  }

  return {
    errors,
    isComplete: Object.keys(errors).length === 0,
  }
}

function withValidationState(data: WorkflowNodeData): WorkflowNodeData {
  const validation = validateNodeData(data)

  if (!validation.isComplete) {
    return {
      ...data,
      status: 'bozza',
      subtitle: 'Config incompleta',
    }
  }

  return {
    ...data,
    status: completedStatus(data),
    subtitle: completedSubtitle(data),
  }
}

function completedStatus(data: WorkflowNodeData): WorkflowNodeStatus {
  if (data.kind === 'create_campaign') {
    return 'attivo'
  }

  return 'pronto'
}

function completedSubtitle(data: WorkflowNodeData) {
  switch (data.kind) {
    case 'workflow_start':
      return `${data.config.targetsIncluded.length} gruppi target`
    case 'create_campaign':
      return `${channelLabel(data.config.channel)} · ${formatDelay(data.config.elapsedTimeMinutes)}`
    case 'start_awareness_campaign':
      return `Training · ${formatDelay(data.config.elapsedTimeMinutes)}`
    case 'add_target_to_group':
      return `Gruppo: ${optionLabel(targetGroupOptions, data.config.groupId)}`
    case 'start_osint_on_targets':
      return `OSINT ${optionLabel(osintOptions, data.config.type)}`
    case 'generate_scenario_from_osint':
      return `${optionLabel(scenarioTemplateOptions, data.config.scenarioTemplate)} · ${channelLabel(data.config.channel)}`
    case 'condition':
      return `Attesa ${formatDelay(data.config.waitForMinutes)} · ${data.config.rules.length} regole + else`
    case 'workflow_end':
      return `Esito: ${optionLabel(outcomeOptions, data.config.outcome)}`
  }
}

function withCampaignCategory(data: CreateCampaignNodeData): CreateCampaignNodeData {
  return {
    ...data,
    category: channelLabel(data.config.channel),
  }
}

function formatDelay(minutes: number) {
  if (minutes <= 0) {
    return 'subito'
  }

  if (minutes % 1440 === 0) {
    const days = minutes / 1440
    return `${days} ${days === 1 ? 'giorno' : 'giorni'}`
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return `${hours} ${hours === 1 ? 'ora' : 'ore'}`
  }

  return `${minutes} min`
}

function channelLabel(channel: CampaignChannel) {
  return optionLabel(channelOptions, channel)
}

function optionLabel<Option extends string>(
  options: readonly {
    label: string
    value: Option
  }[],
  value: Option,
) {
  return options.find((option) => option.value === value)?.label ?? value
}
