import FormField from './FormField'

export default function FormStep({ step, formData, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Título do passo */}
      <div className="mb-2">
        <h2 className="text-2xl mb-1" style={{ color: 'var(--charcoal)' }}>
          {step.title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--gray-mid)' }}>
          {step.subtitle}
        </p>
      </div>

      {/* Campos */}
      {step.fields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={onChange}
        />
      ))}
    </div>
  )
}