export default function ProgressBar({ currentStep, totalSteps, stepTitle }) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--gray-mid)' }}>
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Barra */}
      <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--gold-light)' }}>
        <div
          className="h-1 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%`, backgroundColor: 'var(--gold)' }}
        />
      </div>

      {/* Título do passo */}
      <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: 'var(--gray-mid)' }}>
        {stepTitle}
      </p>
    </div>
  )
}