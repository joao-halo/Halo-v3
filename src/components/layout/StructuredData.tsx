import { site } from "../../data/site";

/**
 * JSON-LD LocalBusiness.
 * ⚠️ Os campos vêm de src/data/site.ts — todos os PLACEHOLDER precisam
 * ser substituídos por dados reais antes de publicar (ver CONTEUDO.md).
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    legalName: site.legalName,
    description: site.positioning,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      // schema.org não tem campo de bairro; no Brasil ele vai no logradouro
      streetAddress: `${site.address.street} - ${site.address.district}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    // omitido enquanto as coordenadas forem desconhecidas
    ...(site.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.latitude,
            longitude: site.geo.longitude,
          },
        }
      : {}),
    areaServed: [
      { "@type": "City", name: "Belo Horizonte" },
      { "@type": "AdministrativeArea", name: "Região Metropolitana de Belo Horizonte" },
      { "@type": "AdministrativeArea", name: "Minas Gerais" },
    ],
    sameAs: [site.instagram],
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/brand/halo-mark.svg`,
    knowsAbout: [
      "Sistemas fotovoltaicos",
      "Armazenamento de energia",
      "Infraestrutura de recarga para veículos elétricos",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // conteúdo estático próprio, montado a partir de src/data/site.ts
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
