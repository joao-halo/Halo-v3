/**
 * Todo o texto visível do site.
 *
 * Regra do projeto: nenhum componente de seção contém texto hardcoded.
 * Para trocar qualquer palavra da página, edite este arquivo.
 */

import { waMessages } from "./site";

/* ---------------------------------------------------------------- Header */

export const header = {
  logoAlt: "Halo Solar Energy",
  homeLabel: "Ir para o início",
  ctaLabel: "Solicitar proposta ↗",
  ctaMessage: waMessages.header,
  menuOpenLabel: "Abrir menu de navegação",
  menuCloseLabel: "Fechar menu de navegação",
  menuTitle: "Navegação",
  skipToContent: "Pular para o conteúdo",
};

/* ------------------------------------------------------------ 1. Hero */

export const hero = {
  id: "inicio",
  eyebrow: "ENERGIA SOLAR, ARMAZENAMENTO E RECARGA EM BELO HORIZONTE",
  title: "Energia projetada com engenharia.",
  paragraph:
    "Analisamos consumo, perfil de carga e infraestrutura elétrica antes de qualquer proposta. Projeto, execução e homologação acompanhados até a conexão.",
  primaryCta: { label: "Solicitar análise ↗", message: waMessages.hero },
  secondaryCta: { label: "Conhecer as soluções ↓", href: "#solucoes" },
  proofs: [
    "Projeto elétrico e homologação",
    "Belo Horizonte e região metropolitana",
    "Fotovoltaico · Armazenamento · Recarga VE",
  ],
};

/* --------------------------------------------------------- 2. Projetos */

export interface ProjectCard {
  category: string;
  title: string;
  image: string;
  alt: string;
  /** Dimensões intrínsecas do arquivo — reservam espaço e evitam CLS. */
  width: number;
  height: number;
}

export const projects = {
  id: "projetos",
  eyebrow: "HALO EM CAMPO",
  title: "Obras entregues antes de promessas.",
  subtitle:
    "Uma amostra de instalações executadas e acompanhadas pela equipe técnica da Halo.",
  items: [
    {
      category: "FOTOVOLTAICO RESIDENCIAL",
      title: "Geração em telhado cerâmico",
      image: "/images/projeto-fotovoltaico-residencial-telhado-ceramico.jpg",
      alt: "Módulos fotovoltaicos instalados sobre telhado cerâmico de residência",
      width: 800,
      height: 600,
    },
    {
      category: "FOTOVOLTAICO COMERCIAL",
      title: "Cobertura metálica em galpão",
      image: "/images/projeto-fotovoltaico-comercial-galpao.jpg",
      alt: "Usina fotovoltaica sobre cobertura metálica de galpão comercial",
      width: 800,
      height: 600,
    },
    {
      category: "FOTOVOLTAICO RURAL",
      title: "Usina em solo para propriedade rural",
      image: "/images/projeto-fotovoltaico-rural-usina-solo.jpg",
      alt: "Usina fotovoltaica montada em estrutura de solo em propriedade rural",
      width: 800,
      height: 600,
    },
    {
      category: "ARMAZENAMENTO",
      title: "Banco de baterias com backup de cargas críticas",
      image: "/images/projeto-armazenamento-banco-baterias.jpg",
      alt: "Banco de baterias e inversor híbrido instalados em sala técnica",
      width: 800,
      height: 600,
    },
    {
      category: "ELETROMOBILIDADE",
      title: "Pontos de recarga em condomínio",
      image: "/images/projeto-eletromobilidade-condominio.jpg",
      alt: "Carregadores para veículos elétricos instalados na garagem de um condomínio",
      width: 800,
      height: 600,
    },
    {
      category: "ELETROMOBILIDADE",
      title: "Recarga para frota corporativa",
      image: "/images/projeto-eletromobilidade-frota-corporativa.jpg",
      alt: "Estação de recarga para frota de veículos elétricos em pátio corporativo",
      width: 800,
      height: 600,
    },
  ] satisfies ProjectCard[],
};

/* ------------------------------------------------------ 3. Engenharia */

export const engineering = {
  id: "engenharia",
  eyebrow: "O PRINCÍPIO HALO",
  title: "Antes de falar em equipamento, entendemos a sua carga.",
  subtitle:
    "A especificação é consequência do diagnóstico elétrico — nunca o contrário.",
  items: [
    {
      number: "01",
      title: "Dimensionamento pelo consumo real",
      description:
        "Histórico de doze meses, curva de carga e sazonalidade definem a potência. Sem estimativa por metro quadrado ou por média de mercado.",
    },
    {
      number: "02",
      title: "Engenharia elétrica integrada",
      description:
        "Padrão de entrada, quadros, condutores, aterramento e proteções entram no projeto desde o início, e não como ajuste depois da instalação.",
    },
    {
      number: "03",
      title: "Execução e homologação acompanhadas",
      description:
        "Equipe própria em obra, comissionamento documentado e acompanhamento do processo junto à distribuidora até a conexão efetiva.",
    },
  ],
};

/* -------------------------------------------------------- 4. Soluções */

export const solutionsSection = {
  id: "solucoes",
  eyebrow: "TRÊS FRENTES, UMA ENGENHARIA",
  title: "Gerar, armazenar e abastecer.",
  subtitle:
    "Três linhas de atuação que se combinam ou operam de forma independente.",
};

/* --------------------------------------------------- 5. Fotovoltaico */

export const photovoltaic = {
  id: "fotovoltaico",
  eyebrow: "GERAÇÃO SOLAR",
  title: "Produzir a própria energia com projeto elétrico.",
  subtitle:
    "Da leitura da conta à troca do medidor, com responsabilidade técnica em cada etapa.",
  paragraph:
    "O sistema é definido pelo que a instalação consome e pelo que a estrutura suporta. Antes do módulo, vem o levantamento elétrico.",
  applicationsLabel: "APLICAÇÕES",
  applications: ["Residencial", "Comercial", "Industrial", "Rural"],
  items: [
    {
      title: "Análise da conta e do perfil de carga",
      description:
        "Doze meses de histórico, demanda contratada e distribuição do consumo ao longo do dia.",
    },
    {
      title: "Projeto elétrico",
      description:
        "Diagramas, dimensionamento de condutores e proteções, memorial e responsabilidade técnica.",
    },
    {
      title: "Estruturas e proteções",
      description:
        "Fixação compatível com o telhado ou o solo, aterramento e dispositivos de proteção contra surtos.",
    },
    {
      title: "Homologação junto à distribuidora",
      description:
        "Protocolo, acompanhamento da análise, vistoria e troca do medidor conduzidos pela Halo.",
    },
    {
      title: "Monitoramento",
      description:
        "Leitura de geração por inversor e string, para identificar perda de desempenho cedo.",
    },
  ],
  image: "/images/fotovoltaico-instalacao-modulos.jpg",
  imageAlt:
    "Técnico da Halo instalando módulos fotovoltaicos sobre estrutura metálica",
  imageWidth: 900,
  imageHeight: 1100,
  cta: { label: "Falar sobre geração solar ↗", message: waMessages.photovoltaic },
};

/* ------------------------------------------------- 6. Armazenamento */

export const storage = {
  id: "armazenamento",
  eyebrow: "ARMAZENAMENTO DE ENERGIA",
  title: "Energia disponível quando a rede não está.",
  subtitle:
    "Baterias e sistemas BESS dimensionados pela criticidade das cargas.",
  paragraph:
    "Armazenar energia resolve três problemas distintos: continuidade durante falta de fornecimento, aproveitamento da geração própria e custo do horário de ponta. Cada um leva a um projeto diferente.",
  items: [
    {
      title: "Backup em falta de energia",
      description:
        "Transferência automática das cargas essenciais para o banco de baterias, sem interrupção perceptível.",
    },
    {
      title: "Aumento do autoconsumo",
      description:
        "A geração solar excedente do meio-dia é armazenada e usada à noite, no lugar da energia da rede.",
    },
    {
      title: "Gestão de demanda e horário de ponta",
      description:
        "Deslocamento de consumo para fora do horário de ponta e limitação de picos de demanda contratada.",
    },
    {
      title: "Sistemas híbridos solar + bateria",
      description:
        "Inversor híbrido operando geração, banco de baterias e rede sob uma única lógica de controle.",
    },
    {
      title: "Dimensionamento por criticidade de carga",
      description:
        "A lista de cargas essenciais define a capacidade útil e a potência do banco — não o inverso.",
    },
  ],
  useCasesLabel: "CASOS DE USO",
  useCases: [
    {
      title: "Residência",
      description:
        "Continuidade em circuitos essenciais e aproveitamento noturno da geração solar.",
    },
    {
      title: "Comércio",
      description:
        "Operação preservada durante interrupções, protegendo refrigeração, caixa e atendimento.",
    },
    {
      title: "Indústria",
      description:
        "Controle de demanda, redução de consumo na ponta e suporte a processos sensíveis a queda.",
    },
    {
      title: "Híbrido off-grid",
      description:
        "Locais com rede precária ou ausente, combinando geração, banco de baterias e gerador de apoio.",
    },
  ],
  image: "/images/armazenamento-banco-baterias-sala-tecnica.jpg",
  imageAlt:
    "Banco de baterias e inversor híbrido instalados em sala técnica com quadro de comando",
  imageWidth: 900,
  imageHeight: 1100,
  cta: { label: "Falar sobre armazenamento ↗", message: waMessages.storage },
};

/* ---------------------------------------------- 7. Eletromobilidade */

export const emobility = {
  id: "eletromobilidade",
  eyebrow: "ELETROMOBILIDADE",
  title: "Infraestrutura de recarga feita por engenharia elétrica.",
  subtitle:
    "Do carregador doméstico à estação de frota, com a instalação dimensionada para suportar.",
  paragraph:
    "Instalar um carregador é uma intervenção elétrica: exige avaliar padrão de entrada, condutores, proteções e o comportamento da carga ao longo do dia.",
  chargersLabel: "CARREGADORES",
  chargers: [
    {
      title: "AC 7,4 kW",
      description: "Monofásico, uso residencial com quilometragem moderada.",
    },
    {
      title: "AC 11 kW",
      description: "Trifásico, recarga noturna completa para uso intenso.",
    },
    {
      title: "AC 22 kW",
      description: "Trifásico, dois veículos ou reposição rápida em uso comercial.",
    },
    {
      title: "DC fast",
      description: "Corrente contínua para frota e estabelecimento com alta rotatividade.",
    },
  ],
  scopeLabel: "ESCOPO DE ENTREGA",
  scope: [
    {
      number: "01",
      title: "Projeto de infraestrutura elétrica",
      description:
        "Levantamento do padrão de entrada, dimensionamento de circuito, proteções e caminhamento.",
    },
    {
      number: "02",
      title: "Gestão e balanceamento de carga",
      description:
        "Vários pontos operando em conjunto sem ultrapassar a capacidade disponível na instalação.",
    },
    {
      number: "03",
      title: "Recarga em condomínio com rateio",
      description:
        "Infraestrutura compartilhada, medição individual por vaga e regras claras de cobrança.",
    },
    {
      number: "04",
      title: "Frotas e estabelecimentos comerciais",
      description:
        "Estações múltiplas dimensionadas por rotina de uso, tempo de parada e energia reposta por dia.",
    },
  ],
  cta: { label: "Falar sobre recarga ↗", message: waMessages.emobility },
};

/* --------------------------------------------------- 8. Como funciona */

export const process = {
  id: "processo",
  eyebrow: "COMO FUNCIONA",
  title: "Da análise à conexão.",
  subtitle: "Quatro etapas, com responsabilidade técnica definida em cada uma.",
  steps: [
    {
      number: "01",
      title: "Análise técnica",
      description:
        "Leitura da conta, curva de carga, visita ao local e avaliação do padrão de entrada.",
    },
    {
      number: "02",
      title: "Projeto e proposta",
      description:
        "Dimensionamento, diagramas, lista de equipamentos e escopo de serviço abertos na proposta.",
    },
    {
      number: "03",
      title: "Instalação e comissionamento",
      description:
        "Execução por equipe própria, testes de proteção e registro documentado da entrega.",
    },
    {
      number: "04",
      title: "Homologação e acompanhamento",
      description:
        "Protocolo junto à distribuidora, vistoria, troca do medidor e acompanhamento de desempenho.",
    },
  ],
};

/* ----------------------------------------------------- 9. Simuladores */

export const simulators = {
  id: "simuladores",
  eyebrow: "SIMULADORES",
  title: "Ordem de grandeza antes da conversa.",
  subtitle:
    "Duas estimativas rápidas para situar o projeto. A análise técnica vem depois.",
  tabsLabel: "Escolha o simulador",
  tabs: [
    { id: "savings", label: "Economia solar" },
    { id: "ev", label: "Recarga de veículo elétrico" },
  ],
  disclaimer:
    "Estimativa de referência. O resultado real depende do consumo, da tarifa da distribuidora, da irradiação local e das condições do imóvel. A Halo realiza análise técnica antes de qualquer proposta.",
  savings: {
    title: "Economia com geração solar",
    billLabel: "Conta de energia média por mês",
    billHint: "Arraste para ajustar. Use as setas do teclado para precisão.",
    profileLabel: "Perfil da unidade consumidora",
    profiles: [
      { id: "residential", label: "Residencial" },
      { id: "commercial", label: "Comercial" },
      { id: "industrial", label: "Industrial" },
    ],
    results: [
      { key: "monthly", label: "Economia mensal estimada" },
      { key: "yearly", label: "Em 12 meses" },
      { key: "horizon", label: "Em 25 anos, com reajuste de 8% ao ano" },
      { key: "power", label: "Potência estimada do sistema" },
    ],
    cta: { label: "Quero uma análise real ↗", message: waMessages.savingsSimulator },
  },
  ev: {
    title: "Custo de recarga contra combustível",
    distanceLabel: "Quilometragem por mês",
    vehicleLabel: "Tipo de veículo",
    tariffLabel: "Tarifa de energia (R$/kWh)",
    fuelPriceLabel: "Preço do combustível (R$/L)",
    fuelEfficiencyLabel: "Eficiência do carro a combustão (km/L)",
    vehicles: [
      { id: "compact", label: "Compacto — 14 kWh/100 km", consumption: 14 },
      { id: "sedan", label: "Sedã — 17 kWh/100 km", consumption: 17 },
      { id: "suv", label: "SUV — 20 kWh/100 km", consumption: 20 },
      { id: "pickup", label: "Picape — 24 kWh/100 km", consumption: 24 },
    ],
    electricLabel: "Elétrico",
    combustionLabel: "Combustão",
    energyLabel: "Energia por mês",
    costLabel: "Custo por mês",
    perKmLabel: "Custo por quilômetro",
    savingsLabel: "Diferença mensal",
    chargerLabel: "Carregador recomendado",
    dailyEnergyLabel: "Energia reposta por dia",
    cta: { label: "Quero instalar um carregador ↗", message: waMessages.evSimulator },
  },
};

/* --------------------------------------------------------- 10. Dúvidas */

export const faqSection = {
  id: "duvidas",
  eyebrow: "DÚVIDAS FREQUENTES",
  title: "Respostas diretas antes de começar.",
  subtitle: "O que costuma ser perguntado antes da primeira visita técnica.",
  contactIntro: "Ficou uma dúvida que não está aqui?",
  phoneLabel: "Telefone",
  whatsappLabel: "WhatsApp",
  whatsappCta: "Falar no WhatsApp ↗",
  whatsappMessage: waMessages.faq,
};

/* --------------------------------------------------------- 11. Contato */

export const contact = {
  id: "contato",
  eyebrow: "CONTATO",
  title: "Comece pela análise.",
  subtitle:
    "Envie os dados abaixo e a equipe técnica retorna com os próximos passos.",
  argument:
    "A primeira conversa é técnica: entender consumo, local de instalação e objetivo. Só depois disso faz sentido falar em equipamento e investimento.",
  detailsLabel: "DADOS DE CONTATO",
  addressLabel: "Atendimento",
  whatsappCta: "Prefiro falar no WhatsApp ↗",
  whatsappMessage: waMessages.contact,
  form: {
    title: "Solicitar análise",
    submitLabel: "Enviar solicitação",
    submittingLabel: "Enviando…",
    successTitle: "Solicitação enviada.",
    successMessage:
      "Recebemos seus dados. A equipe técnica entra em contato em horário comercial.",
    errorTitle: "Não foi possível enviar.",
    errorMessage:
      "Ocorreu uma falha no envio. Tente novamente ou fale com a equipe pelo WhatsApp.",
    requiredHint: "Campos marcados com * são obrigatórios.",
    fields: {
      name: { label: "Nome", placeholder: "Seu nome completo" },
      email: { label: "E-mail", placeholder: "voce@email.com" },
      phone: { label: "Telefone / WhatsApp", placeholder: "(31) 90000-0000" },
      city: { label: "Cidade", placeholder: "Belo Horizonte" },
      interest: {
        label: "Interesse",
        placeholder: "Selecione uma opção",
        options: [
          { value: "photovoltaic", label: "Fotovoltaico" },
          { value: "storage", label: "Armazenamento" },
          { value: "emobility", label: "Eletromobilidade" },
          { value: "multiple", label: "Mais de um" },
        ],
      },
      bill: {
        label: "Valor médio da conta de energia",
        placeholder: "R$ 800 (opcional)",
      },
      message: {
        label: "Mensagem",
        placeholder: "Conte o que você precisa: local, consumo, objetivo.",
      },
    },
  },
};

/* ----------------------------------------------------------- Footer */

export const footer = {
  positioning:
    "Engenharia elétrica aplicada a geração, armazenamento e recarga de veículos elétricos.",
  navTitle: "Navegação",
  solutionsTitle: "Soluções",
  contactTitle: "Contato",
  solutionLinks: [
    { label: "Sistemas fotovoltaicos", href: "#fotovoltaico" },
    { label: "Armazenamento de energia", href: "#armazenamento" },
    { label: "Eletromobilidade", href: "#eletromobilidade" },
    { label: "Simuladores", href: "#simuladores" },
  ],
  copyright: "© 2026 Halo Solar Energy. Todos os direitos reservados.",
  backToTop: "Voltar ao topo ↑",
  instagramLabel: "Instagram",
};

/* -------------------------------------------------- Botão flutuante */

export const floatingCta = {
  label: "Falar no WhatsApp",
  ariaLabel: "Abrir conversa no WhatsApp",
  message: waMessages.floating,
};
