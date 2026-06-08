export default function FormField({ field, value, onChange }) {
  const baseInput = "w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-200 bg-white"
  const borderStyle = { borderColor: 'var(--gold-light)' }
  const focusClass = "focus:ring-2"

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--gold-light)'
    e.target.style.boxShadow = 'none'
  }

  // Campo de texto, email, tel, number, date, time
  if (['text', 'email', 'tel', 'number', 'date', 'time'].includes(field.type)) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
          {field.label}
          {field.required && <span style={{ color: 'var(--gold)' }}> *</span>}
        </label>
        <input
          type={field.type}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={baseInput}
          style={borderStyle}
        />
      </div>
    )
  }

  // Textarea
  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
          {field.label}
          {field.required && <span style={{ color: 'var(--gold)' }}> *</span>}
        </label>
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${baseInput} resize-none`}
          style={borderStyle}
        />
      </div>
    )
  }

  // Radio
  if (field.type === 'radio') {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
          {field.label}
          {field.required && <span style={{ color: 'var(--gold)' }}> *</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {field.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(field.id, option)}
              className="px-5 py-2 rounded-full text-sm border transition-all duration-200"
              style={{
                borderColor: value === option ? 'var(--gold)' : 'var(--gold-light)',
                backgroundColor: value === option ? 'var(--gold)' : 'white',
                color: value === option ? 'white' : 'var(--charcoal)',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Checkbox (múltipla escolha)
  if (field.type === 'checkbox') {
    const selected = value || []
    const toggle = (option) => {
      const next = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
      onChange(field.id, next)
    }

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
          {field.label}
          {field.required && <span style={{ color: 'var(--gold)' }}> *</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className="px-4 py-2 rounded-full text-sm border transition-all duration-200"
              style={{
                borderColor: selected.includes(option) ? 'var(--gold)' : 'var(--gold-light)',
                backgroundColor: selected.includes(option) ? 'var(--gold)' : 'white',
                color: selected.includes(option) ? 'white' : 'var(--charcoal)',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}