/**
 * UK areas/towns/boroughs for SEO landing pages
 */

export interface Area {
  slug: string
  name: string
  type: 'borough' | 'city' | 'town' | 'district'
  council?: string
  region?: string
}

export const AREAS: Area[] = [
  // London Boroughs
  { slug: 'barnet', name: 'Barnet', type: 'borough', council: 'Barnet Council', region: 'London' },
  { slug: 'brent', name: 'Brent', type: 'borough', council: 'Brent Council', region: 'London' },
  { slug: 'bromley', name: 'Bromley', type: 'borough', council: 'Bromley Council', region: 'London' },
  { slug: 'camden', name: 'Camden', type: 'borough', council: 'Camden Council', region: 'London' },
  { slug: 'croydon', name: 'Croydon', type: 'borough', council: 'Croydon Council', region: 'London' },
  { slug: 'ealing', name: 'Ealing', type: 'borough', council: 'Ealing Council', region: 'London' },
  { slug: 'greenwich', name: 'Greenwich', type: 'borough', council: 'Greenwich Council', region: 'London' },
  { slug: 'hackney', name: 'Hackney', type: 'borough', council: 'Hackney Council', region: 'London' },
  { slug: 'hammersmith-fulham', name: 'Hammersmith & Fulham', type: 'borough', council: 'Hammersmith & Fulham Council', region: 'London' },
  { slug: 'haringey', name: 'Haringey', type: 'borough', council: 'Haringey Council', region: 'London' },
  { slug: 'islington', name: 'Islington', type: 'borough', council: 'Islington Council', region: 'London' },
  { slug: 'kensington-chelsea', name: 'Kensington & Chelsea', type: 'borough', council: 'Kensington & Chelsea Council', region: 'London' },
  { slug: 'lambeth', name: 'Lambeth', type: 'borough', council: 'Lambeth Council', region: 'London' },
  { slug: 'lewisham', name: 'Lewisham', type: 'borough', council: 'Lewisham Council', region: 'London' },
  { slug: 'newham', name: 'Newham', type: 'borough', council: 'Newham Council', region: 'London' },
  { slug: 'southwark', name: 'Southwark', type: 'borough', council: 'Southwark Council', region: 'London' },
  { slug: 'tower-hamlets', name: 'Tower Hamlets', type: 'borough', council: 'Tower Hamlets Council', region: 'London' },
  { slug: 'wandsworth', name: 'Wandsworth', type: 'borough', council: 'Wandsworth Council', region: 'London' },
  { slug: 'westminster', name: 'Westminster', type: 'borough', council: 'Westminster Council', region: 'London' },
  
  // Major Cities
  { slug: 'manchester', name: 'Manchester', type: 'city', council: 'Manchester City Council', region: 'North West' },
  { slug: 'birmingham', name: 'Birmingham', type: 'city', council: 'Birmingham City Council', region: 'West Midlands' },
  { slug: 'leeds', name: 'Leeds', type: 'city', council: 'Leeds City Council', region: 'Yorkshire' },
  { slug: 'liverpool', name: 'Liverpool', type: 'city', council: 'Liverpool City Council', region: 'North West' },
  { slug: 'bristol', name: 'Bristol', type: 'city', council: 'Bristol City Council', region: 'South West' },
  { slug: 'sheffield', name: 'Sheffield', type: 'city', council: 'Sheffield City Council', region: 'Yorkshire' },
  { slug: 'newcastle', name: 'Newcastle', type: 'city', council: 'Newcastle City Council', region: 'North East' },
  { slug: 'nottingham', name: 'Nottingham', type: 'city', council: 'Nottingham City Council', region: 'East Midlands' },
  { slug: 'cambridge', name: 'Cambridge', type: 'city', council: 'Cambridge City Council', region: 'East' },
  { slug: 'oxford', name: 'Oxford', type: 'city', council: 'Oxford City Council', region: 'South East' },
  { slug: 'york', name: 'York', type: 'city', council: 'City of York Council', region: 'Yorkshire' },
  { slug: 'bath', name: 'Bath', type: 'city', council: 'Bath & NE Somerset Council', region: 'South West' },
  
  // Major Towns
  { slug: 'reading', name: 'Reading', type: 'town', council: 'Reading Borough Council', region: 'South East' },
  { slug: 'brighton', name: 'Brighton', type: 'town', council: 'Brighton & Hove Council', region: 'South East' },
  { slug: 'guildford', name: 'Guildford', type: 'town', council: 'Guildford Borough Council', region: 'South East' },
  { slug: 'st-albans', name: 'St Albans', type: 'town', council: 'St Albans City & District Council', region: 'East' },
  { slug: 'cheltenham', name: 'Cheltenham', type: 'town', council: 'Cheltenham Borough Council', region: 'South West' },
  { slug: 'harrogate', name: 'Harrogate', type: 'town', council: 'North Yorkshire Council', region: 'Yorkshire' },
  { slug: 'sevenoaks', name: 'Sevenoaks', type: 'town', council: 'Sevenoaks District Council', region: 'South East' },
  { slug: 'winchester', name: 'Winchester', type: 'town', council: 'Winchester City Council', region: 'South East' },
]

/**
 * Get area by slug
 */
export function getArea(slug: string): Area | undefined {
  return AREAS.find(a => a.slug === slug)
}

/**
 * Get areas by region
 */
export function getAreasByRegion(region: string): Area[] {
  return AREAS.filter(a => a.region === region)
}

/**
 * Get London boroughs
 */
export function getLondonBoroughs(): Area[] {
  return AREAS.filter(a => a.region === 'London')
}
