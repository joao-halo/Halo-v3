import { contact, emobility, photovoltaic, storage } from "../../data/content";
import { faq } from "../../data/faq";
import { site } from "../../data/site";

/**
 * Dados estruturados em grafo aninhado (`@graph`).
 *
 * Cada entidade tem um `@id` estável, e as referências entre elas usam esse
 * identificador em vez de repetir a descrição. É o que permite ao mecanismo de
 * IA ligar as arestas do grafo — a organização que presta o serviço, o serviço
 * que atende a região, a página que descreve a organização — em vez de ler
 * objetos soltos sem relação declarada.
 *
 * O bloco é renderizado no HTML pelo passo de pré-renderização do build, então
 * existe mesmo para rastreador que não executa JavaScript.
 *
 * ⚠️ Os dados vêm de src/data/. Ver CONTEUDO.md antes de publicar.
 */

const url = site.url;
const ID = {
  organizacao: `${url}/#organizacao`,
  negocio: `${url}/#negocio`,
  site: `${url}/#site`,
  pagina: `${url}/#pagina`,
  logo: `${url}/#logo`,
  faq: `${url}/#duvidas`,
  fotovoltaico: `${url}/#servico-fotovoltaico`,
  armazenamento: `${url}/#servico-armazenamento`,
  eletromobilidade: `${url}/#servico-eletromobilidade`,
} as const;

const areaAtendida = [
  { "@type": "City", name: "Belo Horizonte", "@id": "https://www.wikidata.org/wiki/Q42800" },
  { "@type": "AdministrativeArea", name: "Região Metropolitana de Belo Horizonte" },
  { "@type": "AdministrativeArea", name: "Minas Gerais" },
];

const servico = (
  id: string,
  nome: string,
  tipo: string,
  descricao: string,
  ancora: string,
) => ({
  "@type": "Service",
  "@id": id,
  name: nome,
  serviceType: tipo,
  description: descricao,
  provider: { "@id": ID.organizacao },
  areaServed: areaAtendida,
  url: `${url}/${ancora}`,
});

export function StructuredData() {
  const grafo = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ID.organizacao,
        name: site.name,
        legalName: site.legalName,
        taxID: site.cnpj,
        url,
        description: site.positioning,
        slogan: site.tagline,
        email: site.email,
        telephone: site.phone,
        logo: {
          "@type": "ImageObject",
          "@id": ID.logo,
          url: `${url}/brand/halo-mark.svg`,
          caption: site.name,
        },
        image: { "@id": ID.logo },
        // Âncoras de identidade. Quanto mais registros externos, menor a chance
        // de a IA confundir a Halo com outra empresa de nome parecido.
        sameAs: site.sameAs,
        areaServed: areaAtendida,
        knowsAbout: [
          "Sistemas fotovoltaicos",
          "Geração distribuída",
          "Lei 14.300",
          "Armazenamento de energia",
          "Sistemas BESS",
          "Infraestrutura de recarga para veículos elétricos",
          "Sistema de Alimentação de Veículos Elétricos (SAVE)",
          "ABNT NBR 17019",
          "ABNT NBR 17193",
          "ABNT NBR 16274",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "vendas",
          telephone: site.phone,
          email: site.email,
          areaServed: "BR",
          availableLanguage: "Portuguese",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": ID.negocio,
        name: site.name,
        parentOrganization: { "@id": ID.organizacao },
        url,
        telephone: site.phone,
        email: site.email,
        image: { "@id": ID.logo },
        address: {
          "@type": "PostalAddress",
          // schema.org não tem campo de bairro; no Brasil ele vai no logradouro
          streetAddress: `${site.address.street} - ${site.address.district}`,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        ...(site.geo
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: site.geo.latitude,
                longitude: site.geo.longitude,
              },
            }
          : {}),
        areaServed: areaAtendida,
        openingHours: "Mo-Fr 08:00-18:00",
        makesOffer: [
          { "@id": ID.fotovoltaico },
          { "@id": ID.armazenamento },
          { "@id": ID.eletromobilidade },
        ],
      },
      {
        "@type": "WebSite",
        "@id": ID.site,
        url,
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": ID.organizacao },
      },
      {
        "@type": "WebPage",
        "@id": ID.pagina,
        url: `${url}/`,
        name: site.name,
        isPartOf: { "@id": ID.site },
        about: { "@id": ID.organizacao },
        inLanguage: "pt-BR",
        dateModified: __BUILD_DATE__,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${url}/og.jpg`,
          width: 1200,
          height: 630,
        },
      },
      servico(
        ID.fotovoltaico,
        photovoltaic.title,
        "Instalação de sistema fotovoltaico",
        photovoltaic.paragraph,
        `#${photovoltaic.id}`,
      ),
      servico(
        ID.armazenamento,
        storage.title,
        "Instalação de sistema de armazenamento de energia",
        storage.paragraph,
        `#${storage.id}`,
      ),
      servico(
        ID.eletromobilidade,
        emobility.title,
        "Instalação de infraestrutura de recarga para veículos elétricos",
        emobility.paragraph,
        `#${emobility.id}`,
      ),
      {
        "@type": "FAQPage",
        "@id": ID.faq,
        isPartOf: { "@id": ID.pagina },
        inLanguage: "pt-BR",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "ContactPage",
        "@id": `${url}/#${contact.id}`,
        isPartOf: { "@id": ID.pagina },
        name: contact.title,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // conteúdo estático próprio, montado a partir de src/data/
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
