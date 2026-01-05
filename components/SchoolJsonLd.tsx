import type { School } from '@/lib/schools'
import type { Results } from '@/lib/results'

interface Props {
  school: School
  results: Results[] | null
}

export function SchoolJsonLd({ school, results }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: school.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.street,
      addressLocality: school.town,
      postalCode: school.postcode,
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: school.lat,
      longitude: school.lng
    },
    ...(school.ofsted_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5 - school.ofsted_rating, // Invert: 1=Outstanding=4 stars
        bestRating: 4,
        worstRating: 1,
        ratingCount: 1
      }
    }),
    ...(school.website && { url: school.website })
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
