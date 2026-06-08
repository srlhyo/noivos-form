import { useState } from 'react'
import { formSteps } from '../data/formSteps'
import ProgressBar from '../components/form/ProgressBar'
import FormStep from '../components/form/FormStep'

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const totalSteps = formSteps.length
  const step = formSteps[currentStep - 1]

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = () => {
    console.log('Dados do formulário:', formData)
    alert('Formulário submetido! (por agora só no console)')
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-xl mx-auto">

        {/* Cabeçalho da marca */}
        <div className="text-center mb-10">
          <h1 className="text-3xl mb-1" style={{ color: 'var(--gold)' }}>
            Do Luxo à Mesa
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--gray-mid)' }}>
            Questionário dos Noivos
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Barra de progresso */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitle={step.title}
          />

          {/* Passo atual */}
          <FormStep
            step={step}
            formData={formData}
            onChange={handleChange}
          />

          {/* Navegação */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 rounded-full text-sm border transition-all duration-200"
              style={{
                borderColor: currentStep === 1 ? 'var(--gold-light)' : 'var(--gold)',
                color: currentStep === 1 ? 'var(--gold-light)' : 'var(--gold)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Anterior
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-2 rounded-full text-sm text-white transition-all duration-200"
                style={{ backgroundColor: 'var(--gold)' }}
              >
                Seguinte →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-2 rounded-full text-sm text-white transition-all duration-200"
                style={{ backgroundColor: 'var(--gold)' }}
              >
                Submeter ✓
              </button>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs mt-6 tracking-widest uppercase" style={{ color: 'var(--gold-light)' }}>
          Planeamento · Personalização · Organização · Detalhes
        </p>

      </div>
    </div>
  )
}