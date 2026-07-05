import type { ReactNode } from 'react'

interface FieldShellProps {
  children: ReactNode
  error?: string
  hint?: string
  id: string
  label: string
  required?: boolean
}

type CommonFieldProps = Omit<FieldShellProps, 'children'>

interface TextFieldProps extends CommonFieldProps {
  onChange: (value: string) => void
  placeholder?: string
  value: string
}

interface NumberFieldProps extends CommonFieldProps {
  min?: number
  onChange: (value: number) => void
  value: number
}

interface SelectFieldProps<Option extends string> extends CommonFieldProps {
  onChange: (value: Option) => void
  options: readonly {
    label: string
    value: Option
  }[]
  value: Option
}

interface MultiSelectFieldProps extends CommonFieldProps {
  onChange: (values: string[]) => void
  options: readonly {
    label: string
    value: string
  }[]
  values: readonly string[]
}

export function TextField({
  error,
  hint,
  id,
  label,
  onChange,
  placeholder,
  required,
  value,
}: TextFieldProps) {
  return (
    <FieldShell
      error={error}
      hint={hint}
      id={id}
      label={label}
      required={required}
    >
      <input
        aria-describedby={fieldDescriptionId(id, error, hint)}
        aria-invalid={Boolean(error)}
        className={fieldClassName(Boolean(error))}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type="text"
        value={value}
      />
    </FieldShell>
  )
}

export function NumberField({
  error,
  hint,
  id,
  label,
  min = 0,
  onChange,
  required,
  value,
}: NumberFieldProps) {
  return (
    <FieldShell
      error={error}
      hint={hint}
      id={id}
      label={label}
      required={required}
    >
      <input
        aria-describedby={fieldDescriptionId(id, error, hint)}
        aria-invalid={Boolean(error)}
        className={fieldClassName(Boolean(error))}
        id={id}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        required={required}
        type="number"
        value={Number.isFinite(value) ? value : min}
      />
    </FieldShell>
  )
}

export function SelectField<Option extends string>({
  error,
  hint,
  id,
  label,
  onChange,
  options,
  required,
  value,
}: SelectFieldProps<Option>) {
  return (
    <FieldShell
      error={error}
      hint={hint}
      id={id}
      label={label}
      required={required}
    >
      <select
        aria-describedby={fieldDescriptionId(id, error, hint)}
        aria-invalid={Boolean(error)}
        className={fieldClassName(Boolean(error))}
        id={id}
        onChange={(event) => onChange(event.target.value as Option)}
        required={required}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function MultiSelectField({
  error,
  hint,
  id,
  label,
  onChange,
  options,
  required,
  values,
}: MultiSelectFieldProps) {
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((currentValue) => currentValue !== value))
      return
    }

    onChange([...values, value])
  }

  return (
    <fieldset
      aria-describedby={fieldDescriptionId(id, error, hint)}
      className="space-y-2"
    >
      <legend className="font-label text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-muted">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-lowest px-3 py-2 text-xs text-on-surface transition-colors hover:bg-surface-high"
            htmlFor={`${id}-${option.value}`}
            key={option.value}
          >
            <input
              checked={values.includes(option.value)}
              className="size-3 accent-secondary"
              id={`${id}-${option.value}`}
              onChange={() => toggleValue(option.value)}
              type="checkbox"
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldDescription error={error} hint={hint} id={id} />
    </fieldset>
  )
}

function FieldShell({
  children,
  error,
  hint,
  id,
  label,
  required,
}: FieldShellProps) {
  return (
    <div>
      <label
        className="font-label text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-muted"
        htmlFor={id}
      >
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      <FieldDescription error={error} hint={hint} id={id} />
    </div>
  )
}

function FieldDescription({
  error,
  hint,
  id,
}: {
  error?: string
  hint?: string
  id: string
}) {
  if (error) {
    return (
      <p
        className="mt-1.5 font-label text-[10px] font-medium text-primary"
        id={`${id}-error`}
        role="alert"
      >
        {error}
      </p>
    )
  }

  if (hint) {
    return (
      <p
        className="mt-1.5 font-label text-[10px] text-on-surface-muted"
        id={`${id}-hint`}
      >
        {hint}
      </p>
    )
  }

  return null
}

function fieldDescriptionId(
  id: string,
  error?: string,
  hint?: string,
) {
  if (error) {
    return `${id}-error`
  }

  if (hint) {
    return `${id}-hint`
  }

  return undefined
}

function fieldClassName(hasError: boolean) {
  return `w-full rounded-lg border bg-surface-lowest px-3 py-2 text-xs text-on-surface focus:ring-2 focus:outline-none ${
    hasError
      ? 'border-primary focus:border-primary focus:ring-primary/15'
      : 'border-white/10 focus:border-secondary focus:ring-secondary/15'
  }`
}
