// Todo campo marcado com PREENCHER deve ser substituído pela marca antes do lançamento.
export const PREENCHER = (descricao: string) => `[PREENCHER: ${descricao}]`;

export function ehPreencher(valor?: string | null): boolean {
  if (!valor) return false;
  return valor.trim().startsWith("[PREENCHER:");
}

export type IconePasso = "escolha" | "organize" | "acompanhe";
export type IconeBeneficio =
  | "visualizacao"
  | "antecipacao"
  | "participacao"
  | "autonomia"
  | "adaptacao";
export type IconeAtividade =
  | "acordar"
  | "dentes"
  | "cafe"
  | "escola"
  | "brincar"
  | "atendimentos"
  | "descansar"
  | "dormir";

export const site = {
  // Altere para false antes de publicar caso queira ocultar avisos auxiliares de edição nas fotos ilustrativas
  mostrarAvisosPlaceholderMidia: true,

  marca: {
    nome: "Rotina com Carinho",
    logo: null as string | null, // PREENCHER: caminho do logo em /public (ex.: "/logo.svg")
    assinatura: "Sua rotina, do seu jeito!",
    destaquePublico: "Organização visual semanal para crianças e famílias",
  },

  contato: {
    // Formato obrigatório: 55 + DDD + número apenas com dígitos (ex.: "5515999999999")
    whatsappNumero: "5515996154764",
    whatsappNumeroExibicao: "+55 (15) 99615-4764",
    whatsappMensagemPadrao:
      "Olá! Vim pelo site e quero conhecer o quadro Rotina com Carinho.",
    email: "rrotinacomamor@gmail.com",
    instagram: "https://www.instagram.com/rrotinacomamor",
    outrasRedes: [
      {
        nome: "www.rotinacomamor.com",
        url: "https://www.rotinacomamor.com",
      },
    ],
  },

  // Cada CTA pode sobrescrever a mensagem do WhatsApp para identificar a origem do clique
  ctas: {
    header: {
      texto: "Quero conhecer o quadro",
      msg: "Olá! Quero conhecer o quadro Rotina com Carinho.",
    },
    heroPrim: {
      texto: "Quero organizar nossa rotina",
      msg: "Olá! Quero organizar a rotina da minha família com o quadro.",
    },
    heroSec: {
      texto: "Veja como funciona",
      href: "#como-funciona",
    },
    final: {
      texto: "Falar pelo WhatsApp",
      msg: "Olá! Gostaria de mais informações sobre o quadro visual semanal.",
    },
    flutuante: {
      rotulo: "Falar com a Rotina com Carinho pelo WhatsApp",
      msg: "Olá! Vim pelo site e quero conhecer o quadro Rotina com Carinho.",
    },
  },

  menu: [
    { texto: "Início", href: "#inicio" },
    { texto: "Como funciona", href: "#como-funciona" },
    { texto: "Benefícios", href: "#beneficios" },
    { texto: "Agenda da Mãe", href: "/agenda" },
    { texto: "Jogo 3D das Crianças", href: "/jogo" },
    { texto: "Perguntas frequentes", href: "#perguntas-frequentes" },
    { texto: "Contato", href: "#contato" },
  ],

  hero: {
    titulo: "Uma rotina mais leve começa com pequenos passos.",
    subtitulo:
      "Organize a semana da sua família de forma visual, prática e personalizada, respeitando o tempo e as necessidades de cada criança.",
    imagem: {
      src: "./assets/aistudio/Gemini_Generated_Image_qmusziqmusziqmus_11f00455.jpg",
      alt: "Quadro visual semanal Rotina com Carinho com cartões ilustrados organizados por dias da semana e assinatura Sua rotina, do seu jeito",
      largura: 1200,
      altura: 900,
      placeholderFoto: "",
    },
  },

  produto: {
    rotuloSecao: "Conheça o quadro",
    titulo: "Mais clareza para o dia. Mais carinho em cada etapa.",
    texto:
      "O Rotina com Carinho é um quadro visual semanal com cartões removíveis que ajuda a tornar as atividades do dia a dia mais fáceis de visualizar. Uma maneira prática de apresentar a rotina, acompanhar os combinados e adaptar a semana à realidade da sua família.",
    imagemPrincipal: {
      src: "./assets/aistudio/Quadro_visual_semanal_com_rotina_infantil_23b8f474.png",
      alt: "Foto frontal do quadro visual semanal Rotina com Carinho com colunas de Domingo a Sábado e cartões ilustrados de atividades",
      largura: 1600,
      altura: 900,
      legenda:
        "Visão geral do quadro semanal pensado para facilitar a visualização dos combinados de cada dia.",
      placeholderFoto: "",
    },
    detalhes: [
      {
        src: "./assets/aistudio/Gemini_Generated_Image_rh6asrrh6asrrh6a_609a4332.jpg",
        alt: "Mãe e criança com fone de ouvido manuseando e escolhendo com carinho o cartão visual de atividade para o quadro de rotina",
        largura: 800,
        altura: 600,
        titulo: "Cartões visuais removíveis",
        legenda:
          "Ilustrações claras que apoiam a identificação visual de cada momento do dia.",
        placeholderFoto: "",
      },
      {
        src: "./assets/aistudio/_47A8FCDA-E129-401A-9AC7-5FCB0D81544F__451438e6.png",
        alt: "Mãe e criança interagindo juntas e acompanhando as etapas no quadro de rotina com cartões ilustrados",
        largura: 800,
        altura: 600,
        titulo: "Organização ao longo da semana",
        legenda:
          "Disposição pensada para distribuir e ajustar as atividades conforme a realidade familiar.",
        placeholderFoto: "",
      },
      {
        src: "./assets/aistudio/content_989339a9.png",
        alt: "Pai e criança sorrindo juntos ao organizar os cartões de rotina diária no quadro visual",
        largura: 800,
        altura: 600,
        titulo: "Acompanhamento no dia a dia",
        legenda:
          "Convida a criança a participar dos combinados e visualizar o que vem a seguir.",
        placeholderFoto: "",
      },
    ],
  },

  comoFunciona: {
    rotuloSecao: "Passo a passo",
    titulo: "Como funciona",
    subtitulo:
      "Três etapas simples para montar e acompanhar os combinados da semana junto com a criança.",
  },

  passos: [
    {
      numero: 1,
      titulo: "Escolha as atividades da rotina.",
      icone: "escolha" as IconePasso,
    },
    {
      numero: 2,
      titulo: "Organize os cartões ao longo da semana.",
      icone: "organize" as IconePasso,
    },
    {
      numero: 3,
      titulo: "Acompanhe com a criança e ajuste quando necessário.",
      icone: "acompanhe" as IconePasso,
    },
  ],

  beneficiosCabecalho: {
    rotuloSecao: "Por que usar o quadro visual",
    titulo: "Benefícios para a rotina da família",
    subtitulo:
      "Um recurso visual acolhedor que apoia a organização diária com leveza e previsibilidade.",
  },

  beneficios: [
    {
      texto: "Facilita a visualização das atividades.",
      icone: "visualizacao" as IconeBeneficio,
    },
    {
      texto: "Ajuda a antecipar os próximos momentos do dia.",
      icone: "antecipacao" as IconeBeneficio,
    },
    {
      texto: "Incentiva a participação da criança.",
      icone: "participacao" as IconeBeneficio,
    },
    {
      texto: "Apoia a construção gradual de autonomia.",
      icone: "autonomia" as IconeBeneficio,
    },
    {
      texto: "Permite adaptar a organização à rotina familiar.",
      icone: "adaptacao" as IconeBeneficio,
    },
  ],

  atividades: {
    rotuloSecao: "Dia a dia ilustrado",
    titulo: "Exemplos de atividades",
    subtitulo:
      "Veja alguns exemplos de momentos que podem compor a organização semanal da criança.",
    itens: [
      {
        nome: "Acordar",
        icone: "acordar" as IconeAtividade,
        imagem: "./assets/aistudio/Gemini_Generated_Image_lqybm1lqybm1lqyb_73ef9f1d.jpg",
      },
      {
        nome: "Escovar os dentes",
        icone: "dentes" as IconeAtividade,
        imagem: "./assets/aistudio/Ir_para_escola_3c215afb.jpg",
      },
      {
        nome: "Tomar café",
        icone: "cafe" as IconeAtividade,
        imagem: "./assets/aistudio/tomar_cafe_e5ca323f.jpg",
      },
      {
        nome: "Ir à escola",
        icone: "escola" as IconeAtividade,
        imagem: "./assets/aistudio/Gemini_Generated_Image_c4lfcpc4lfcpc4lf_f77f3b70.jpg",
      },
      {
        nome: "Brincar",
        icone: "brincar" as IconeAtividade,
        imagem: "./assets/aistudio/brincar_bd987619.jpg",
      },
      {
        nome: "Participar de atendimentos",
        icone: "atendimentos" as IconeAtividade,
        imagem: "./assets/aistudio/PARTICIPAR_DE_ATENDIMENTO_ace0abf0.jpg",
      },
      {
        nome: "Descansar",
        icone: "descansar" as IconeAtividade,
        imagem: "./assets/aistudio/Descansar_811f8709.jpg",
      },
      {
        nome: "Dormir",
        icone: "dormir" as IconeAtividade,
        imagem: "./assets/aistudio/dormir_ba348315.jpg",
      },
    ],
    aviso:
      "Exemplos ilustrativos de organização. Os cartões disponíveis no quadro devem ser confirmados com a nossa equipe.",
  },

  emocional: {
    rotuloSecao: "Nosso jeito de acolher",
    titulo: "Cada família tem seu ritmo. Cada conquista merece carinho.",
    texto:
      "A rotina não precisa ser perfeita para fazer sentido. Com pequenos combinados e uma organização que a criança possa visualizar, é possível construir momentos de participação, conexão e aprendizado no dia a dia.",
  },

  faqCabecalho: {
    rotuloSecao: "Tire suas dúvidas",
    titulo: "Perguntas frequentes",
    subtitulo:
      "Respostas claras sobre o funcionamento do quadro e o atendimento pelo WhatsApp.",
  },

  faq: [
    {
      pergunta: "Como o quadro funciona?",
      resposta:
        "O quadro funciona em três passos práticos: você escolhe as atividades que fazem parte da rotina da criança, distribui os cartões removíveis ao longo dos dias da semana e acompanha cada etapa junto com ela, ajustando sempre que necessário.",
      complementar: null as string | null,
    },
    {
      pergunta: "Posso personalizar a rotina?",
      resposta:
        "Sim. Os cartões removíveis permitem adaptar a ordem e a distribuição das atividades conforme os combinados e as mudanças da semana da sua família.",
      complementar: PREENCHER("opções de personalização oferecidas"),
    },
    {
      pergunta: "Quais cartões acompanham o quadro?",
      resposta: PREENCHER("lista de cartões incluídos"),
      complementar: null as string | null,
    },
    {
      pergunta: "Como limpar e conservar o quadro?",
      resposta: PREENCHER("material e instruções de limpeza"),
      complementar: null as string | null,
    },
    {
      pergunta: "Como funciona a entrega?",
      resposta: PREENCHER("regiões atendidas, prazos e formas de envio"),
      complementar: null as string | null,
    },
    {
      pergunta: "Como faço para comprar?",
      resposta:
        "No momento, as compras são feitas pelo WhatsApp. Fale com a gente para tirar dúvidas e fazer seu pedido.",
      complementar: null as string | null,
    },
  ],

  chamadaFinal: {
    rotuloSecao: "Atendimento próximo e acolhedor",
    titulo: "Vamos construir uma rotina com mais carinho?",
    texto:
      "Conheça o quadro visual semanal e descubra como ele pode fazer parte do dia a dia da sua família.",
    avisoWhatsappPendente: PREENCHER(
      "defina site.contato.whatsappNumero em src/data/site.ts (ex.: 5515999999999) para ativar o redirecionamento direto ao WhatsApp"
    ),
  },

  rodape: {
    linksLegais: [
      { texto: "Política de privacidade", href: "/privacidade" },
    ],
    cnpj: "", // PREENCHER (opcional): ex. "00.000.000/0001-00"
    textoDireitos: "Todos os direitos reservados.",
    tituloContato: "Contato",
    tituloNavegacao: "Navegação",
    rotuloWhatsapp: "Atendimento via WhatsApp",
    rotuloEmail: "E-mail",
    rotuloInstagram: "Instagram (@rrotinacomamor)",
  },

  privacidade: {
    titulo: "Política de Privacidade",
    voltarTexto: "Voltar para o início",
    atualizacao: "Outubro de 2026 (em conformidade com a LGPD - Lei nº 13.709/18)",
    resumo:
      "Esta Política de Privacidade explica como coletamos, utilizamos, protegemos e compartilhamos os seus dados pessoais quando você visita nosso site ou se comunica conosco. Respeitar a sua privacidade e assegurar a segurança dos seus dados é fundamental para nós.",
  },

  acessibilidade: {
    pularParaConteudo: "Pular para o conteúdo principal",
    abrirMenu: "Abrir menu de navegação",
    fecharMenu: "Fechar menu de navegação",
    menuPrincipal: "Menu principal",
    abreNovaAba: "(abre em nova aba)",
    campoEditavel: "Informação pendente da marca:",
  },

  seo: {
    titulo:
      "Rotina com Carinho | Quadro visual semanal para a rotina da família",
    descricao:
      "Quadro visual semanal com cartões removíveis para organizar a rotina das crianças de forma prática, visual e personalizada.",
    url: "https://www.rotinacomamor.com",
    ogImage: "/og-image.svg",
  },
} as const;
