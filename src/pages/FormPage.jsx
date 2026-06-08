import { useState } from 'react'
import { formSteps } from '../data/formSteps'
import ProgressBar from '../components/form/ProgressBar'
import FormStep from '../components/form/FormStep'
import { supabase } from '../lib/supabase'

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    const payload = {
      nome_noivo: formData.nomeNoivo,
      nome_noiva: formData.nomeNoiva,
      contacto_principal: formData.contactoPrincipal,
      email: formData.email,
      morada: formData.morada,
      data_evento: formData.dataEvento || null,
      local_evento: formData.localEvento,
      numero_convidados: formData.numeroConvidados ? parseInt(formData.numeroConvidados) : null,
      hora_inicio: formData.horaInicio || null,
      hora_termino: formData.horaTermino || null,
      hora_montagem: formData.horaMontagem || null,
      hora_limite_montagem: formData.horaLimiteMontagem || null,
      hora_recolha: formData.horaRecolha || null,
      recolha_dia_seguinte: formData.recolhaDiaSeguinte,
      nome_responsavel: formData.nomeResponsavel,
      contacto_responsavel: formData.contactoResponsavel,
      relacao_responsavel: formData.relacaoResponsavel,
      estilo_evento: formData.estiloEvento || [],
      estilo_outro: formData.estiloOutro,
      paleta_cores: formData.paletaCores || [],
      paleta_observacoes: formData.paletaObservacoes,
      mesa_noivos: formData.mesaNoivos || [],
      cartoes_pratos: formData.cartoesPratos,
      observacoes_cartoes: formData.observacoesCartoes,
      descricao_mesa_noivos: formData.descricaoMesaNoivos,
      cenario_palco: formData.cenarioPalco || [],
      descricao_cenario: formData.descricaoCenario,
      medidas_espaco: formData.medidasEspaco,
      centros_mesa: formData.centrosMesa || [],
      tipo_flores: formData.tipoFlores || [],
      numero_mesas: formData.numeroMesas ? parseInt(formData.numeroMesas) : null,
      formato_mesas: formData.formatoMesas,
      lugares_por_mesa: formData.lugaresporMesa ? parseInt(formData.lugaresporMesa) : null,
      observacoes_mesas: formData.observacoesMesas,
      texto_principal_placa: formData.textoPrincipalPlaca,
      texto_secundario_placa: formData.textoSecundarioPlaca,
      estilo_placa: formData.estiloPlaca || [],
      notas_placa: formData.notasPlaca,
      morada_exacta: formData.moradaExacta,
      pessoa_abre_espaco: formData.pessoaAbreEspaco,
      contacto_pessoa_abre: formData.contactoPessoaAbre,
      acesso_local: formData.acessoLocal || [],
      notas_acesso: formData.notasAcesso,
      observacoes_gerais: formData.observacoesGerais,
    }

    const { error } = await supabase.from('submissions').insert([payload])

    if (error) {
      setError('Ocorreu um erro ao submeter. Por favor tenta novamente.')
      console.error(error)
    } else {
      setSubmitted(true)
    }

    setSubmitting(false)
  }

  // Ecrã de sucesso
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-5xl mb-6">💍</div>
          <h2 className="text-2xl mb-3" style={{ color: 'var(--gold)' }}>
            Obrigado!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--gray-mid)' }}>
            O vosso questionário foi submetido com sucesso. Entraremos em contacto brevemente para confirmar todos os detalhes do vosso dia especial.
          </p>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold-light)' }}>
            Planeamento · Personalização · Organização · Detalhes
          </p>
        </div>
      </div>
    )
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

          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitle={step.title}
          />

          <FormStep
            step={step}
            formData={formData}
            onChange={handleChange}
          />

          {/* Erro */}
          {error && (
            <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
          )}

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
                disabled={submitting}
                className="px-8 py-2 rounded-full text-sm text-white transition-all duration-200"
                style={{ backgroundColor: submitting ? 'var(--gold-light)' : 'var(--gold)' }}
              >
                {submitting ? 'A enviar...' : 'Submeter ✓'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6 tracking-widest uppercase" style={{ color: 'var(--gold-light)' }}>
          Planeamento · Personalização · Organização · Detalhes
        </p>

      </div>
    </div>
  )
}