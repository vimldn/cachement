import { supabase } from './supabase'

/**
 * Admissions data structure
 * This is the key differentiator - "last distance offered" data
 * compiled from council admissions booklets
 */
export interface AdmissionsData {
  urn: string
  year: number
  
  // Capacity and applications
  pan: number                      // Published Admission Number (places available)
  applications: number             // Total applications received
  offers: number                   // Offers made
  
  // Distance data (the gold)
  lastDistanceMetres: number | null     // Furthest distance admitted
  lastDistanceMiles: number | null      // Same in miles for display
  
  // Breakdown by priority group (where available)
  offersLookedAfter?: number       // Looked after children
  offersSiblings?: number          // Siblings
  offersDistance?: number          // Distance-based offers
  offersOther?: number             // Other criteria (faith, catchment area, etc.)
  
  // Appeal data
  appeals?: number
  appealsSuccessful?: number
  
  // Source info
  source: string                   // e.g. "Camden Council Admissions Booklet 2024"
  sourceUrl?: string
}

/**
 * Historical trend for charting
 */
export interface AdmissionsTrend {
  year: number
  lastDistanceMetres: number
  applications: number
  offers: number
}

/**
 * Get admissions data for a school
 * Returns the most recent year's data
 */
export async function getAdmissionsData(urn: string): Promise<AdmissionsData | null> {
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .eq('urn', urn)
    .order('year', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !data) return null
  return data as AdmissionsData
}

/**
 * Get historical admissions trends (last 5 years)
 */
export async function getAdmissionsTrend(urn: string): Promise<AdmissionsTrend[]> {
  const { data, error } = await supabase
    .from('admissions')
    .select('year, last_distance_metres, applications, offers')
    .eq('urn', urn)
    .order('year', { ascending: true })
    .limit(5)
  
  if (error || !data) return []
  
  return data.map(row => ({
    year: row.year,
    lastDistanceMetres: row.last_distance_metres,
    applications: row.applications,
    offers: row.offers
  }))
}

/**
 * Calculate if an address is likely within catchment
 */
export function isLikelyInCatchment(
  distanceFromSchool: number,   // in metres
  lastDistanceAdmitted: number  // in metres
): 'likely' | 'possible' | 'unlikely' {
  const ratio = distanceFromSchool / lastDistanceAdmitted
  
  if (ratio < 0.7) return 'likely'
  if (ratio < 1.0) return 'possible'
  return 'unlikely'
}

/**
 * Format distance for display
 */
export function formatDistance(metres: number): string {
  if (metres < 1000) {
    return `${Math.round(metres)}m`
  }
  const miles = metres / 1609.34
  if (miles < 0.1) {
    return `${Math.round(metres)}m`
  }
  return `${miles.toFixed(2)} miles`
}

/**
 * Convert metres to miles
 */
export function metresToMiles(metres: number): number {
  return metres / 1609.34
}

/**
 * Get oversubscription ratio
 */
export function getOversubscriptionRatio(admissions: AdmissionsData): number {
  if (!admissions.applications || !admissions.pan) return 0
  return admissions.applications / admissions.pan
}

/**
 * Describe competitiveness
 */
export function getCompetitivenessLabel(ratio: number): string {
  if (ratio < 1) return 'Undersubscribed'
  if (ratio < 1.5) return 'Slightly oversubscribed'
  if (ratio < 2) return 'Moderately competitive'
  if (ratio < 3) return 'Very competitive'
  return 'Highly competitive'
}
