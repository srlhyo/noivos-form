export const formSteps = [
  {
    id: 1,
    title: "Dados Principais",
    subtitle: "Informações base sobre os noivos e o evento",
    fields: [
      { id: "nomeNoivo", label: "Nome do Noivo", type: "text", required: true },
      { id: "nomeNoiva", label: "Nome da Noiva", type: "text", required: true },
      { id: "contactoPrincipal", label: "Contacto Principal", type: "tel", required: true },
      { id: "email", label: "E-mail", type: "email", required: true },
      { id: "morada", label: "Morada", type: "text", required: false },
      { id: "dataEvento", label: "Data do Evento", type: "date", required: true },
      { id: "localEvento", label: "Local do Evento", type: "text", required: true },
      { id: "numeroConvidados", label: "Nº Final de Convidados", type: "number", required: true },
      { id: "horaInicio", label: "Hora de Início", type: "time", required: true },
      { id: "horaTermino", label: "Hora de Término", type: "time", required: false },
      { id: "horaMontagem", label: "Hora disponível para montagem", type: "time", required: false },
      { id: "horaLimiteMontagem", label: "Hora limite para conclusão da montagem", type: "time", required: false },
      { id: "horaRecolha", label: "Hora prevista para recolha", type: "time", required: false },
      { id: "recolhaDiaSeguinte", label: "Existe possibilidade de recolha no dia seguinte?", type: "radio", required: true, options: ["Sim", "Não"] },
    ]
  },
  {
    id: 2,
    title: "Contacto e Estilo",
    subtitle: "Quem contactar no dia e a visão estética do evento",
    fields: [
      { id: "nomeResponsavel", label: "Nome do Responsável no Dia", type: "text", required: true },
      { id: "contactoResponsavel", label: "Contacto Telefónico", type: "tel", required: true },
      { id: "relacaoResponsavel", label: "Relação com os Noivos", type: "text", required: false },
      { id: "estiloEvento", label: "Estilo Pretendido", type: "checkbox", required: true, options: ["Clássico", "Elegante", "Romântico", "Moderno", "Luxo Editorial", "Minimalista", "Outro"] },
      { id: "estiloOutro", label: "Se outro, especificar", type: "text", required: false },
      { id: "paletaCores", label: "Paleta de Cores", type: "checkbox", required: false, options: ["Branco", "Creme", "Bege", "Dourado", "Champanhe", "Rosa", "Azul", "Verde", "Preto", "Outra"] },
      { id: "paletaObservacoes", label: "Tons exactos / observações da paleta", type: "textarea", required: false },
    ]
  },
  {
    id: 3,
    title: "Detalhes Decorativos",
    subtitle: "Mesa dos noivos e cenário de palco",
    fields: [
      { id: "mesaNoivos", label: "Mesa dos Noivos", type: "checkbox", required: false, options: ["Mesa simples", "Mesa com destaque floral", "Mesa com velas", "Toalha / tecido especial", "Letras / identificação", "Outro"] },
      { id: "cartoesPratos", label: "Querem cartões personalizados nos pratos?", type: "radio", required: true, options: ["Sim", "Não", "Talvez"] },
      { id: "observacoesCartoes", label: "Observações dos cartões", type: "textarea", required: false },
      { id: "descricaoMesaNoivos", label: "Descrição pretendida para a mesa dos noivos", type: "textarea", required: false },
      { id: "cenarioPalco", label: "Cenário de Palco", type: "checkbox", required: false, options: ["Painel branco / claro", "Cortina / tecido", "Arranjos florais", "Estrutura arqueada", "Luzes decorativas", "Tapete / alcatifa"] },
      { id: "descricaoCenario", label: "Descrição do cenário de palco", type: "textarea", required: false },
      { id: "medidasEspaco", label: "Medidas / limitações do espaço", type: "textarea", required: false },
    ]
  },
  {
    id: 4,
    title: "Convidados e Placa",
    subtitle: "Mesas dos convidados e placa de boas-vindas",
    fields: [
      { id: "centrosMesa", label: "Centros de Mesa", type: "checkbox", required: false, options: ["Centros de mesa baixos", "Centros de mesa altos", "Mistura de alturas"] },
      { id: "tipoFlores", label: "Tipo de Flores", type: "checkbox", required: false, options: ["Flores naturais", "Flores artificiais premium", "Velas"] },
      { id: "numeroMesas", label: "Número de Mesas", type: "number", required: false },
      { id: "formatoMesas", label: "Formato das Mesas", type: "text", required: false },
      { id: "lugaresporMesa", label: "Nº de Lugares por Mesa", type: "number", required: false },
      { id: "observacoesMesas", label: "Observações sobre as mesas dos convidados", type: "textarea", required: false },
      { id: "textoPrincipalPlaca", label: "Texto Principal da Placa de Boas-Vindas", type: "text", required: false },
      { id: "textoSecundarioPlaca", label: "Texto Secundário / Data / Nomes", type: "text", required: false },
      { id: "estiloPlaca", label: "Estilo da Placa", type: "checkbox", required: false, options: ["Com moldura", "Sem moldura", "Com cavalete", "Outro"] },
      { id: "notasPlaca", label: "Notas sobre estilo da placa", type: "textarea", required: false },
    ]
  },
  {
    id: 5,
    title: "Logística e Observações",
    subtitle: "Detalhes de acesso e notas finais",
    fields: [
      { id: "moradaExacta", label: "Morada exacta do local", type: "textarea", required: false },
      { id: "pessoaAbreEspaco", label: "Pessoa que abre o espaço", type: "text", required: false },
      { id: "contactoPessoaAbre", label: "Contacto", type: "tel", required: false },
      { id: "acessoLocal", label: "Acesso para cargas/descargas", type: "checkbox", required: false, options: ["Elevador disponível", "Escadas", "Estacionamento próximo"] },
      { id: "notasAcesso", label: "Notas importantes de acesso, horários ou restrições", type: "textarea", required: false },
      { id: "observacoesGerais", label: "Observações Gerais", type: "textarea", required: false },
    ]
  }
]