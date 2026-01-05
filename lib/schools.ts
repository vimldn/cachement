import { supabase } from './supabase'

export interface School {
  urn: string
  name: string
  slug: string
  phase: 'primary' | 'secondary' | 'all-through'
  type: string
  street: string
  town: string
  postcode: string
  lat: number
  lng: number
  ofsted_rating: number | null
  ofsted_date: string | null
  pupils: number | null
  age_low: number
  age_high: number
  website?: string
  distance_km?: number
}

/**
 * Slugify a school name for URL
 */
export function slugify(name: string, urn: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${urn}`
}

/**
 * Get school by URL slug
 */
export async function getSchoolBySlug(slug: string): Promise<School | null> {
  // Extract URN from end of slug
  const match = slug.match(/-(\d+)$/)
  if (!match) return null
  
  const urn = match[1]
  
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('urn', urn)
    .single()
  
  if (error || !data) return null
  return data as School
}

/**
 * Get schools within radius of coordinates
 */
export async function getNearbySchools(
  lat: number, 
  lng: number, 
  radiusKm: number = 3
): Promise<School[]> {
  const { data, error } = await supabase.rpc('nearby_schools', {
    search_lat: lat,
    search_lng: lng,
    radius_km: radiusKm
  })
  
  if (error) {
    console.error('Error fetching nearby schools:', error)
    return []
  }
  
  return data as School[]
}

/**
 * Get schools in a specific area/town
 */
export async function getSchoolsInArea(areaSlug: string): Promise<School[]> {
  // This would use a lookup table of area -> postcodes or coordinates
  // For now, simplified version
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .ilike('town', `%${areaSlug.replace(/-/g, ' ')}%`)
    .order('ofsted_rating', { ascending: true, nullsFirst: false })
  
  if (error) {
    console.error('Error fetching schools in area:', error)
    return []
  }
  
  return data as School[]
}

/**
 * Find similar schools (same phase, nearby, similar performance)
 */
export async function getSimilarSchools(school: School, limit: number = 5): Promise<School[]> {
  const { data, error } = await supabase.rpc('similar_schools', {
    target_urn: school.urn,
    target_lat: school.lat,
    target_lng: school.lng,
    target_phase: school.phase,
    radius_km: 5,
    limit_count: limit
  })
  
  if (error) {
    console.error('Error fetching similar schools:', error)
    return []
  }
  
  return data as School[]
}

/**
 * Get all schools (for static generation)
 */
export async function getAllSchools(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('schools')
    .select('slug')
  
  if (error) {
    console.error('Error fetching all schools:', error)
    return []
  }
  
  return data
}
