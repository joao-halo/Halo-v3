export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Dúvidas frequentes (#duvidas) — cobre as três frentes.
 * Respostas técnicas e sóbrias: nada de promessa de retorno garantido.
 */
export const faq: FaqItem[] = [
  {
    question: "Quanto custa um sistema fotovoltaico?",
    answer:
      "O investimento depende da potência instalada, do tipo de telhado ou estrutura, da distância até o quadro geral e das proteções exigidas pela distribuidora. Não trabalhamos com preço de tabela: o orçamento sai depois da análise da conta, do perfil de carga e da visita técnica, com a lista de equipamentos e serviços aberta.",
  },
  {
    question: "Como vocês dimensionam o sistema?",
    answer:
      "Partimos do histórico de consumo dos últimos doze meses, do perfil de carga ao longo do dia e da irradiação local. Sobre isso entram as restrições físicas: área útil, orientação, inclinação, sombreamento e capacidade do padrão de entrada. O resultado é a potência em kWp e o arranjo de módulos e inversores.",
  },
  {
    question: "A conta de luz zera?",
    answer:
      "Não. Mesmo com geração excedente, permanecem o custo de disponibilidade da distribuidora, a iluminação pública e os tributos incidentes. O sistema compensa a parcela de energia consumida da rede; a fatura continua existindo, com valor reduzido. Qualquer estimativa de economia depende da tarifa vigente e das regras de compensação em vigor.",
  },
  {
    question: "E nos dias nublados e à noite?",
    answer:
      "A geração cai em dias nublados e é nula à noite. Em sistemas conectados à rede, o excedente gerado durante o dia vira crédito de energia usado nesses períodos. Se a exigência for continuidade de fornecimento durante falta de energia, o caminho é um sistema com armazenamento, não apenas geração.",
  },
  {
    question: "Qual o prazo de homologação em Minas Gerais?",
    answer:
      "O prazo de análise e vistoria é definido pela distribuidora e pela regulamentação vigente, e varia conforme a potência e a complexidade da conexão. Cuidamos do processo do protocolo à troca do medidor e informamos o andamento em cada etapa, sem prometer data que não depende de nós.",
  },
  {
    question: "Qual a garantia dos equipamentos?",
    answer:
      "Módulos, inversores e baterias têm garantias próprias de fabricante, distintas entre si e com prazos diferentes para defeito de fabricação e para desempenho. As condições e os prazos de cada item vêm discriminados na proposta, junto com a garantia de serviço de instalação.",
  },
  {
    question: "O que é um sistema de armazenamento de energia?",
    answer:
      "É um banco de baterias com inversor e sistema de gestão que armazena energia — da geração solar ou da própria rede — para uso em outro momento. Serve a três objetivos: manter cargas críticas durante falta de energia, aumentar o autoconsumo da geração e deslocar consumo do horário de ponta para períodos de tarifa menor.",
  },
  {
    question: "Quanto tempo a bateria mantém a casa ou a empresa funcionando?",
    answer:
      "A autonomia é a capacidade útil do banco dividida pela potência das cargas que se quer manter. Por isso o dimensionamento começa pela lista de cargas críticas: manter um circuito essencial por algumas horas é um projeto; manter a operação inteira é outro, com custo muito diferente.",
  },
  {
    question: "Qual carregador escolher para o meu veículo elétrico?",
    answer:
      "Depende da energia que você repõe por dia e do tempo disponível para recarga. Uso doméstico com baixa quilometragem costuma ser atendido por carregadores AC de 7,4 kW; quilometragem alta ou dois veículos pedem 11 ou 22 kW; recarga rápida para frota ou estabelecimento comercial entra no domínio DC. A definição final considera a capacidade do padrão de entrada e o carregador de bordo do veículo.",
  },
  {
    question: "É possível instalar carregador em condomínio?",
    answer:
      "Sim. O projeto avalia a capacidade do padrão de entrada e da prumada, define a infraestrutura compartilhada e a forma de medição individual para rateio, e prevê balanceamento de carga para que vários pontos operem sem exceder o limite do prédio. A instalação é precedida de aprovação em assembleia e do projeto elétrico correspondente.",
  },
  {
    question: "Que manutenção o sistema exige?",
    answer:
      "Sistemas fotovoltaicos exigem limpeza periódica dos módulos, inspeção de estruturas, conexões e dispositivos de proteção, e acompanhamento dos dados de geração para detectar perda de desempenho. Bancos de bateria e carregadores têm rotinas próprias de inspeção e atualização de firmware. A periodicidade é definida por ambiente e porte da instalação.",
  },
  {
    question: "Vocês atendem fora de Belo Horizonte?",
    answer:
      "Atuamos em Belo Horizonte e na região metropolitana. Projetos fora dessa área são avaliados caso a caso, considerando deslocamento de equipe, logística de materiais e as condições de atendimento pós-instalação.",
  },
];
