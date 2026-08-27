/**
 * Todo o texto visível do site.
 *
 * Regra do projeto: nenhum componente de seção contém texto hardcoded.
 * Para trocar qualquer palavra da página, edite este arquivo.
 */

import { waMessages } from "./site";

/* ---------------------------------------------------------------- Header */

export const header = {
  logoAlt: "Halo Energy",
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
  title: "Energia para gerar, armazenar e abastecer.",
  primaryCta: { label: "Solicitar análise ↗", message: waMessages.hero },
  secondaryCta: { label: "Simulador rápido ↓", href: "#simuladores" },

  /**
   * Vídeo de fundo da capa.
   *
   * Deixe `null` para a capa voltar ao fundo em gradiente. Com o objeto
   * preenchido, o vídeo roda em laço, mudo e sem som, atrás de um véu grafite
   * que garante contraste do texto por cima de qualquer quadro.
   *
   * Coloque os arquivos em public/video/. O `poster` aparece antes do vídeo
   * carregar, em conexão limitada e para quem pediu menos animação no sistema.
   */
  video: {
    // Sem WebM: nesta fonte o VP9 ficou maior que o H.264, então seria peso
    // no repositório sem economia de banda. Reavaliar se o vídeo mudar.
    mp4: "/video/capa.mp4",
    poster: "/images/capa-poster.jpg",
    /** Descrição para leitor de tela. O vídeo é decorativo, mas o rótulo ajuda. */
    label: "Vídeo de apresentação da Halo Energy",
    pauseLabel: "Pausar vídeo de fundo",
    playLabel: "Reproduzir vídeo de fundo",
  } as {
    webm?: string;
    mp4: string;
    poster: string;
    label: string;
    pauseLabel: string;
    playLabel: string;
  } | null,
};

/**
 * Faixa logo abaixo da capa.
 *
 * Recebe o que saiu do vídeo de fundo: o rótulo de posicionamento, o parágrafo
 * de abertura e as três micro-provas. O conteúdo continua no topo da página e
 * na primeira dobra da leitura, sem disputar espaço com a imagem em movimento.
 */
export const heroSummary = {
  eyebrow: "ENERGIA SOLAR, ARMAZENAMENTO E RECARGA EM BELO HORIZONTE",
  paragraph:
    "Economize energia com painéis solares, armazene sua energia em baterias e abasteça seu carro elétrico. Projeto, instalação e homologação com engenharia própria em Belo Horizonte.",
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
  eyebrow: "HALO ENGENHARIA",
  title: "Obras e projetos realizados pela companhia.",
  subtitle:
    "Uma amostra de instalações de sistemas fotovoltaicos, carregamento veicular e manutenção de usinas.",
  items: [
    {
      category: "FOTOVOLTAICO RESIDENCIAL",
      title: "Geração de energia para sua casa",
      image: "/images/projeto-fotovoltaico-residencial.jpg",
      alt: "Sistema fotovoltaico instalado sobre telhado cerâmico de residência, com os telhados do bairro ao fundo",
      width: 800,
      height: 600,
    },
    {
      category: "FOTOVOLTAICO COMERCIAL",
      title: "Geração de energia para sua empresa",
      image: "/images/projeto-fotovoltaico-comercial.jpg",
      alt: "Usina fotovoltaica em estrutura de solo, instalada em encosta ao lado de área de mata",
      width: 800,
      height: 600,
    },
    {
      category: "FOTOVOLTAICO C&I",
      title: "Invista em geração",
      image: "/images/projeto-fotovoltaico-ci.jpg",
      alt: "Usina fotovoltaica de grande porte em campo aberto, com longas fileiras de módulos e via de acesso central",
      width: 800,
      height: 600,
    },
    {
      category: "BATERIAS",
      title: "Armazene sua energia",
      image: "/images/projeto-baterias-armazenamento.jpg",
      alt: "Inversor híbrido instalado em parede externa, com eletrodutos e módulos fotovoltaicos ao lado",
      width: 800,
      height: 600,
    },
    {
      category: "ELETROMOBILIDADE",
      title: "Instale seu eletroposto",
      image: "/images/projeto-eletromobilidade-eletroposto.jpg",
      alt: "Eletroposto com dois carregadores para veículos elétricos e vagas sinalizadas em verde",
      width: 800,
      height: 600,
    },
    {
      category: "OPERAÇÃO & MANUTENÇÃO",
      title: "Soluções para engenharia de performance",
      image: "/images/projeto-operacao-manutencao.jpg",
      alt: "Técnico inspecionando módulos fotovoltaicos com câmera termográfica",
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
  title: "Painéis solares com segurança, confiabilidade e economia.",
  subtitle:
    "Projeto, instalação e homologação em conformidade com a Lei 14.300 e com as normas ABNT de segurança e comissionamento.",
  paragraph:
    "Economizar na conta de luz depende de duas coisas: um sistema dimensionado pelo consumo real e um projeto que passa na análise da distribuidora. Especificamos cada componente segundo a regulação vigente — do levantamento elétrico ao comissionamento documentado.",
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
  complianceLabel: "REGULAÇÃO E NORMAS",
  complianceTitle: "O que sustenta o projeto.",
  compliance: [
    {
      code: "Lei 14.300/2022",
      name: "Marco legal da geração distribuída",
      description:
        "Institui as regras do Sistema de Compensação de Energia Elétrica — o mecanismo que permite abater da conta a energia que o seu sistema injeta na rede. É o que dá segurança jurídica ao investimento.",
    },
    {
      code: "ABNT NBR 17193:2025",
      name: "Segurança contra incêndio",
      description:
        "Define os requisitos de projeto contra incêndio em instalações fotovoltaicas em edificações: desligamento rápido, espaçamento para acesso do corpo de bombeiros e posicionamento seguro de cabos e dispositivos.",
    },
    {
      code: "ABNT NBR 16274",
      name: "Comissionamento e documentação",
      description:
        "Estabelece os ensaios, a inspeção e o relatório técnico que comprovam que o sistema foi entregue operando como projetado. É o documento que fica com você.",
    },
  ],
  image: "/images/fotovoltaico-residencia-com-modulos.jpg",
  imageAlt:
    "Residência com telhado coberto por módulos fotovoltaicos, inversor e baterias instalados na parede lateral",
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
  image: "/images/armazenamento-residencia-com-baterias.jpg",
  imageAlt:
    "Residência iluminada durante chuva ao anoitecer, com módulos fotovoltaicos no telhado e banco de baterias com inversor na parede lateral",
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
      title: "Wallbox 7,4 kW",
      description:
        "Dá conta da recarga diária do seu carro durante a noite. Opera em 220 V, inclusive em rede bifásica — o padrão de boa parte das residências brasileiras. É o carregador de casa e de condomínio.",
    },
    {
      title: "Wallbox 22 kW",
      description:
        "Trifásico 380 V, o que exige autotransformador na maioria das instalações. Duas saídas: recarrega dois veículos a 11 kW ao mesmo tempo. Indicado para uso comercial intensivo.",
    },
    {
      title: "Carregador rápido",
      description:
        "Recarga de alta potência em corrente contínua, para quando o tempo de parada é curto. É o equipamento dos eletropostos comerciais.",
    },
  ],
  scopeLabel: "ESCOPO DE ENTREGA",
  scope: [
    {
      number: "01",
      title: "Análise de carga com analisador de energia",
      description:
        "Instalamos um analisador de energia e registramos a curva de carga real antes de especificar qualquer equipamento. É o que evita sobrecarregar o padrão de entrada.",
    },
    {
      number: "02",
      title: "Projeto da estação e da instalação",
      description:
        "Desenvolvimento do projeto elétrico completo, do padrão de entrada ao ponto de recarga — para consumidor final e para empresas.",
    },
    {
      number: "03",
      title: "Gestão e balanceamento de carga",
      description:
        "Vários pontos operando em conjunto sem ultrapassar a capacidade disponível na instalação.",
    },
    {
      number: "04",
      title: "Condomínios, frotas e estabelecimentos",
      description:
        "Infraestrutura compartilhada com medição individual para rateio, e estações múltiplas dimensionadas por rotina de uso.",
    },
  ],
  complianceLabel: "SEGURANÇA E REGULAMENTAÇÃO",
  complianceTitle: "Estação de recarga entra na vistoria do Corpo de Bombeiros.",
  complianceIntro:
    "Instalar ponto de recarga em garagem coletiva deixou de ser só uma questão elétrica: a conformidade do SAVE passou a ser verificada junto com o restante da segurança contra incêndio da edificação.",
  compliance: [
    {
      code: "ABNT NBR 17019",
      name: "Requisitos do SAVE",
      description:
        "Define o Sistema de Alimentação de Veículos Elétricos e os requisitos do circuito. Cada ponto de recarga é dimensionado com fator de demanda 1 — salvo quando há controle de recarga instalado, o que muda o porte da infraestrutura.",
    },
    {
      code: "IT 30 · CBMMG",
      name: "AVCB e combate a incêndio",
      description:
        "Em Minas Gerais, a Instrução Técnica nº 30 do Corpo de Bombeiros passou a tratar do SAVE. Estação fora de conformidade vira pendência na emissão e na renovação do Auto de Vistoria do Corpo de Bombeiros.",
    },
    {
      code: "Projeto e comissionamento",
      name: "A documentação da vistoria",
      description:
        "Memorial do SAVE, relatório de conformidade e ART, com as proteções do circuito especificadas em projeto. É o que o condomínio ou o estabelecimento apresenta ao Corpo de Bombeiros.",
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
  title: "Faça uma simulação do seu projeto.",
  subtitle:
    "Duas estimativas rápidas para situar a ordem de grandeza. A análise técnica vem depois.",
  tabsLabel: "Escolha o simulador",
  tabs: [
    { id: "savings", label: "Economia solar" },
    { id: "ev", label: "Recarga de veículo elétrico" },
  ],
  disclaimer:
    "Estimativa de referência, sem validade comercial. O resultado real depende do consumo, da tarifa da distribuidora, da irradiação local e das condições do imóvel. Nenhum número aqui constitui proposta: a Halo faz análise técnica antes de qualquer orçamento.",
  savings: {
    title: "Economia com geração solar",
    billLabel: "Conta de energia média por mês",
    billHint: "Arraste para ajustar. Use as setas do teclado para precisão.",
    tariffLabel: "Tarifa de energia (R$/kWh)",
    tariffHint: "Consulte o valor na sua conta de luz. O padrão é uma referência regional.",
    results: {
      monthly: "Economia mensal estimada",
      payback: "Payback estimado",
      power: "Potência estimada do sistema",
      projectValue: "Valor de referência do projeto",
    },
    notice:
      "Simulação sem validade comercial. Os valores são de referência e não constituem proposta — fale com um consultor da Halo para receber um orçamento baseado na sua conta e no seu imóvel.",
    cta: { label: "Falar com um consultor ↗", message: waMessages.savingsSimulator },
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
        /** Opção já marcada ao abrir o formulário. */
        defaultValue: "photovoltaic",
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
  copyright: "© 2026 Halo Energy. Todos os direitos reservados.",
  backToTop: "Voltar ao topo ↑",
  instagramLabel: "Instagram",
};

/* -------------------------------------------------- Botão flutuante */

export const floatingCta = {
  label: "Falar no WhatsApp",
  ariaLabel: "Abrir conversa no WhatsApp",
  message: waMessages.floating,
};
