/**
 * Dados institucionais e pontos de conversão.
 *
 * ⚠️ TODOS os campos marcados com PLACEHOLDER precisam ser substituídos
 * pelos dados reais da Halo Solar Energy antes de publicar.
 * Ver CONTEUDO.md para a lista completa.
 */

/** WhatsApp comercial (formato internacional, só dígitos): +55 31 99707-3141. */
export const WHATSAPP_NUMBER = "5531997073141";

export const site = {
  name: "Halo Solar Energy",
  legalName: "JVA Energia Inteligente Ltda.",
  cnpj: "45.357.408/0001-53",
  tagline: "Engenharia antes de venda.",
  positioning:
    "Projeto, execução e homologação de sistemas de energia em Belo Horizonte e região metropolitana.",
  url: "https://www.haloenergy.com.br",
  city: "Belo Horizonte",
  state: "MG",
  stateName: "Minas Gerais",
  region: "Belo Horizonte e região metropolitana",
  /** PLACEHOLDER — endereço completo. */
  address: {
    street: "PLACEHOLDER — Rua e número",
    district: "PLACEHOLDER — Bairro",
    city: "Belo Horizonte",
    state: "MG",
    postalCode: "PLACEHOLDER — 00000-000",
    country: "BR",
  },
  /** PLACEHOLDER — coordenadas da sede, usadas no JSON-LD. */
  geo: { latitude: -19.9167, longitude: -43.9345 },
  /**
   * Telefone de contato. É o mesmo número do WhatsApp — se a empresa passar a
   * ter uma linha fixa separada, troque `phone`/`phoneHref` e deixe
   * WHATSAPP_NUMBER com o celular.
   */
  phone: "+55 31 99707-3141",
  phoneHref: "+5531997073141",
  email: "contato@haloenergy.com.br",
  instagram: "https://instagram.com/halosolarpower",
  instagramHandle: "@halosolarpower",
  /** PLACEHOLDER — horário de atendimento. */
  openingHours: "Segunda a sexta, 8h às 18h",
} as const;

/** Monta o link de conversa com mensagem já preenchida. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Mensagem contextual por ponto de conversão. */
export const waMessages = {
  hero: "Olá, Halo! Gostaria de uma análise da minha conta de energia.",
  photovoltaic: "Olá, Halo! Tenho interesse em um sistema fotovoltaico.",
  storage: "Olá, Halo! Tenho interesse em um sistema de armazenamento de energia.",
  emobility: "Olá, Halo! Quero instalar um carregador para veículo elétrico.",
  savingsSimulator:
    "Olá, Halo! Simulei minha economia no site e gostaria de uma análise real.",
  evSimulator:
    "Olá, Halo! Simulei a recarga do meu veículo elétrico e quero instalar um carregador.",
  header: "Olá, Halo! Gostaria de solicitar uma proposta.",
  faq: "Olá, Halo! Tenho uma dúvida sobre soluções de energia.",
  contact: "Olá, Halo! Gostaria de falar com um especialista.",
  floating: "Olá, Halo! Gostaria de falar sobre um projeto de energia.",
} as const;

export const navItems = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Fotovoltaico", href: "#fotovoltaico" },
  { label: "Armazenamento", href: "#armazenamento" },
  { label: "Eletromobilidade", href: "#eletromobilidade" },
  { label: "Como funciona", href: "#processo" },
  { label: "Simuladores", href: "#simuladores" },
  { label: "Contato", href: "#contato" },
] as const;

/** Ids observados pelo scroll-spy, na ordem em que aparecem. */
export const sectionIds = [
  "inicio",
  "projetos",
  "engenharia",
  "solucoes",
  "fotovoltaico",
  "armazenamento",
  "eletromobilidade",
  "processo",
  "simuladores",
  "duvidas",
  "contato",
] as const;

export const seo = {
  title:
    "Energia Solar, Armazenamento e Recarga de Veículos Elétricos em Belo Horizonte | Halo Solar Energy",
  description:
    "Projeto e instalação de sistemas fotovoltaicos, armazenamento de energia e infraestrutura de recarga para veículos elétricos em Belo Horizonte e região metropolitana. Engenharia elétrica e homologação acompanhada.",
  ogImage: "/og.jpg",
  locale: "pt_BR",
} as const;
