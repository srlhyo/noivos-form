import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const STATUS_OPTIONS = ['Recebido', 'Em Preparação', 'Confirmado', 'Concluído']

const STATUS_COLORS = {
  'Recebido':      { bg: '#FEF9EC', color: '#C9A84C', border: '#E8D5A3' },
  'Em Preparação': { bg: '#EFF6FF', color: '#3B82F6', border: '#BFDBFE' },
  'Confirmado':    { bg: '#F0FDF4', color: '#22C55E', border: '#BBF7D0' },
  'Concluído':     { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
}

const PIE_COLORS = ['#C9A84C', '#3B82F6', '#22C55E', '#6B7280']
const GOLD_SHADES = ['#C9A84C', '#A07830', '#E8D5A3', '#7A5C20', '#F5ECD7']

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ marginBottom: '10px' }}>
      <p style={{ fontSize: '11px', color: 'var(--gray-mid)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>
        {label}
      </p>
      <p style={{ fontSize: '14px', color: 'var(--charcoal)', margin: 0 }}>{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{
        fontSize: '11px', fontWeight: '600', color: 'var(--gold)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        borderBottom: '1px solid var(--gold-light)', paddingBottom: '6px',
        marginBottom: '12px', margin: '0 0 12px 0'
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px', padding: '24px 20px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '20px'
    }}>
      <p style={{
        fontSize: '12px', fontWeight: '600', color: 'var(--gray-mid)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '20px', margin: '0 0 20px 0'
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--gold-light)', fontSize: '13px' }}>Sem dados suficientes ainda</p>
    </div>
  )
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [activeTab, setActiveTab] = useState('clientes')
  const navigate = useNavigate()

  useEffect(() => { fetchSubmissions() }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('data_evento', { ascending: true })
    if (!error) setSubmissions(data)
    setLoading(false)
  }

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from('submissions').update({ status: newStatus }).eq('id', id)
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status: newStatus }))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const filtered = filterStatus === 'Todos'
    ? submissions
    : submissions.filter((s) => s.status === filterStatus)

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const eventosPorMes = () => {
    const counts = {}
    submissions.forEach((s) => {
      if (!s.data_evento) return
      const mes = new Date(s.data_evento).toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' })
      counts[mes] = (counts[mes] || 0) + 1
    })
    return Object.entries(counts).map(([mes, total]) => ({ mes, total }))
  }

  const estilosMaisPedidos = () => {
    const counts = {}
    submissions.forEach((s) => {
      (s.estilo_evento || []).forEach((e) => { counts[e] = (counts[e] || 0) + 1 })
    })
    return Object.entries(counts).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor)
  }

  const paletasMaisPopulares = () => {
    const counts = {}
    submissions.forEach((s) => {
      (s.paleta_cores || []).forEach((c) => { counts[c] = (counts[c] || 0) + 1 })
    })
    return Object.entries(counts).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor)
  }

  const pipelineData = STATUS_OPTIONS
    .map((status, i) => ({
      status,
      total: submissions.filter((s) => s.status === status).length,
      fill: PIE_COLORS[i]
    }))
    .filter(p => p.total > 0)

  const mediaConvidados = () => {
    const validos = submissions.filter((s) => s.numero_convidados)
    if (!validos.length) return 0
    return Math.round(validos.reduce((sum, s) => sum + s.numero_convidados, 0) / validos.length)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)', fontFamily: 'Inter, sans-serif' }}>

      {/* Header — largura total, conteúdo alinhado com o resto */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gold-light)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '960px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', color: 'var(--gold)', fontFamily: 'Playfair Display, serif', margin: 0, lineHeight: 1.2 }}>
              Do Luxo à Mesa
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--gray-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Painel de Gestão
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px', padding: '8px 20px', borderRadius: '999px',
              border: '1px solid var(--gold-light)', color: 'var(--gray-mid)',
              backgroundColor: 'white', cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>

        {/* Tabs dentro do header, alinhadas */}
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex' }}>
          {[{ id: 'clientes', label: '👥 Clientes' }, { id: 'dashboard', label: '📊 Dashboard' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px', fontSize: '13px', fontWeight: '500',
                border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--gray-mid)',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ---- TAB CLIENTES ---- */}
        {activeTab === 'clientes' && (
          <>
            {/* Estatísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
              {STATUS_OPTIONS.map((status) => {
                const count = submissions.filter((s) => s.status === status).length
                const colors = STATUS_COLORS[status]
                return (
                  <div key={status} style={{
                    backgroundColor: 'white', borderRadius: '14px', padding: '20px',
                    textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    borderTop: `3px solid ${colors.color}`
                  }}>
                    <p style={{ fontSize: '30px', fontWeight: '600', color: colors.color, margin: '0 0 4px 0' }}>{count}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-mid)', margin: 0 }}>{status}</p>
                  </div>
                )
              })}
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {['Todos', ...STATUS_OPTIONS].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 16px', borderRadius: '999px', fontSize: '13px',
                    border: `1px solid ${filterStatus === status ? 'var(--gold)' : 'var(--gold-light)'}`,
                    backgroundColor: filterStatus === status ? 'var(--gold)' : 'white',
                    color: filterStatus === status ? 'white' : 'var(--charcoal)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Lista */}
            {loading ? (
              <p style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-mid)', fontSize: '14px' }}>A carregar...</p>
            ) : filtered.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-mid)', fontSize: '14px' }}>Nenhum formulário encontrado.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((s) => {
                  const colors = STATUS_COLORS[s.status] || STATUS_COLORS['Recebido']
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelected(s)}
                      style={{
                        backgroundColor: 'white', borderRadius: '14px', padding: '18px 22px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '12px', borderLeft: `4px solid ${colors.color}`,
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--charcoal)', margin: '0 0 4px 0' }}>
                          {s.nome_noivo || '—'} & {s.nome_noiva || '—'}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--gray-mid)', margin: 0 }}>
                          {formatDate(s.data_evento)} · {s.local_evento || 'Local não definido'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '12px', padding: '4px 12px', borderRadius: '999px',
                          backgroundColor: colors.bg, color: colors.color, border: `1px solid ${colors.border}`
                        }}>
                          {s.status}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--gold)' }}>Ver detalhes →</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ---- TAB DASHBOARD ---- */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
              {[
                { label: 'Total de Eventos', value: submissions.length, color: 'var(--gold)' },
                { label: 'Média de Convidados', value: mediaConvidados(), color: '#3B82F6' },
                { label: 'Eventos Activos', value: submissions.filter(s => s.status !== 'Concluído').length, color: '#22C55E' },
              ].map((kpi) => (
                <div key={kpi.label} style={{
                  backgroundColor: 'white', borderRadius: '14px', padding: '24px 20px',
                  textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontSize: '36px', fontWeight: '600', color: kpi.color, margin: '0 0 6px 0' }}>{kpi.value}</p>
                  <p style={{ fontSize: '12px', color: 'var(--gray-mid)', margin: 0 }}>{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Eventos por mês */}
            <ChartCard title="Eventos por Mês">
              {eventosPorMes().length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={eventosPorMes()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--gray-mid)' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--gray-mid)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid var(--gold-light)', fontSize: '13px' }}
                      cursor={{ fill: 'rgba(201,168,76,0.08)' }}
                    />
                    <Bar dataKey="total" fill="var(--gold)" radius={[6, 6, 0, 0]} name="Eventos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Pipeline — dois gráficos lado a lado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

              <ChartCard title="Pipeline de Estados">
                {pipelineData.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        dataKey="total"
                        nameKey="status"
                        cx="50%"
                        cy="45%"
                        outerRadius={85}
                        innerRadius={40}
                      >
                        {pipelineData.map((entry) => (
                          <Cell key={entry.status} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid var(--gold-light)', fontSize: '13px' }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ fontSize: '12px', color: 'var(--charcoal)' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard title="Paletas Mais Populares">
                {paletasMaisPopulares().length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={paletasMaisPopulares()}
                        dataKey="valor"
                        nameKey="nome"
                        cx="50%"
                        cy="45%"
                        outerRadius={85}
                        innerRadius={40}
                      >
                        {paletasMaisPopulares().map((entry, index) => (
                          <Cell key={entry.nome} fill={GOLD_SHADES[index % GOLD_SHADES.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid var(--gold-light)', fontSize: '13px' }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ fontSize: '12px', color: 'var(--charcoal)' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

            </div>

            {/* Estilos mais pedidos */}
            <ChartCard title="Estilos Mais Pedidos">
              {estilosMaisPedidos().length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={estilosMaisPedidos()} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--gray-mid)' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="nome" width={130} tick={{ fontSize: 12, fill: 'var(--gray-mid)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid var(--gold-light)', fontSize: '13px' }}
                      cursor={{ fill: 'rgba(201,168,76,0.08)' }}
                    />
                    <Bar dataKey="valor" fill="var(--gold)" radius={[0, 6, 6, 0]} name="Pedidos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </>
        )}
      </div>

      {/* Drawer */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white', width: '100%', maxWidth: '480px',
              height: '100%', overflowY: 'auto', padding: '28px 24px',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'var(--charcoal)', margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif' }}>
                  {selected.nome_noivo} & {selected.nome_noiva}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--gray-mid)', margin: 0 }}>{formatDate(selected.data_evento)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ fontSize: '20px', color: 'var(--gray-mid)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gray-mid)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Estado do Evento
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {STATUS_OPTIONS.map((status) => {
                  const colors = STATUS_COLORS[status]
                  const isActive = selected.status === status
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selected.id, status)}
                      style={{
                        padding: '6px 14px', borderRadius: '999px', fontSize: '12px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: isActive ? colors.color : colors.bg,
                        color: isActive ? 'white' : colors.color,
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {status}
                    </button>
                  )
                })}
              </div>
            </div>

            <Section title="Dados Principais">
              <DetailRow label="Contacto" value={selected.contacto_principal} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Morada" value={selected.morada} />
              <DetailRow label="Local do Evento" value={selected.local_evento} />
              <DetailRow label="Nº Convidados" value={selected.numero_convidados} />
              <DetailRow label="Hora Início" value={selected.hora_inicio} />
              <DetailRow label="Hora Término" value={selected.hora_termino} />
              <DetailRow label="Hora Montagem" value={selected.hora_montagem} />
              <DetailRow label="Hora Limite Montagem" value={selected.hora_limite_montagem} />
              <DetailRow label="Hora Recolha" value={selected.hora_recolha} />
              <DetailRow label="Recolha Dia Seguinte" value={selected.recolha_dia_seguinte} />
            </Section>
            <Section title="Contacto no Dia">
              <DetailRow label="Responsável" value={selected.nome_responsavel} />
              <DetailRow label="Contacto" value={selected.contacto_responsavel} />
              <DetailRow label="Relação" value={selected.relacao_responsavel} />
            </Section>
            <Section title="Estilo e Cores">
              <DetailRow label="Estilo" value={selected.estilo_evento?.join(', ')} />
              <DetailRow label="Outro Estilo" value={selected.estilo_outro} />
              <DetailRow label="Paleta de Cores" value={selected.paleta_cores?.join(', ')} />
              <DetailRow label="Observações Paleta" value={selected.paleta_observacoes} />
            </Section>
            <Section title="Detalhes Decorativos">
              <DetailRow label="Mesa dos Noivos" value={selected.mesa_noivos?.join(', ')} />
              <DetailRow label="Cartões nos Pratos" value={selected.cartoes_pratos} />
              <DetailRow label="Obs. Cartões" value={selected.observacoes_cartoes} />
              <DetailRow label="Descrição Mesa Noivos" value={selected.descricao_mesa_noivos} />
              <DetailRow label="Cenário de Palco" value={selected.cenario_palco?.join(', ')} />
              <DetailRow label="Descrição Cenário" value={selected.descricao_cenario} />
              <DetailRow label="Medidas / Limitações" value={selected.medidas_espaco} />
            </Section>
            <Section title="Convidados e Placa">
              <DetailRow label="Centros de Mesa" value={selected.centros_mesa?.join(', ')} />
              <DetailRow label="Tipo de Flores" value={selected.tipo_flores?.join(', ')} />
              <DetailRow label="Nº Mesas" value={selected.numero_mesas} />
              <DetailRow label="Formato Mesas" value={selected.formato_mesas} />
              <DetailRow label="Lugares por Mesa" value={selected.lugares_por_mesa} />
              <DetailRow label="Obs. Mesas" value={selected.observacoes_mesas} />
              <DetailRow label="Texto Principal Placa" value={selected.texto_principal_placa} />
              <DetailRow label="Texto Secundário Placa" value={selected.texto_secundario_placa} />
              <DetailRow label="Estilo Placa" value={selected.estilo_placa?.join(', ')} />
              <DetailRow label="Notas Placa" value={selected.notas_placa} />
            </Section>
            <Section title="Logística">
              <DetailRow label="Morada Exacta" value={selected.morada_exacta} />
              <DetailRow label="Pessoa que Abre" value={selected.pessoa_abre_espaco} />
              <DetailRow label="Contacto" value={selected.contacto_pessoa_abre} />
              <DetailRow label="Acesso Local" value={selected.acesso_local?.join(', ')} />
              <DetailRow label="Notas Acesso" value={selected.notas_acesso} />
              <DetailRow label="Observações Gerais" value={selected.observacoes_gerais} />
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}