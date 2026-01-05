import { supabase } from './supabase'

export interface PriceData {
  avg: number
  median: number
  min: number
  max: number
  count: number
}

/**
 * Get aggregated house prices for a postcode
 */
export async function getPostcodePrices(postcode: string): Promise<PriceData | null> {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  
  const { data, error } = await supabase
    .from('postcode_prices')
    .select('*')
    .eq('postcode', cleaned)
    .single()
  
  if (error || !data) return null
  
  return {
    avg: data.avg_price,
    median: data.median_price,
    min: data.min_price,
    max: data.max_price,
    count: data.sales_count
  }
}

/**
 * Get prices near a location (within radius)
 */
export async function getNearbyPrices(
  lat: number, 
  lng: number, 
  radiusKm: number = 1
): Promise<PriceData | null> {
  // Use PostGIS to find nearby postcodes and aggregate
  const { data, error } = await supabase.rpc('nearby_prices', {
    search_lat: lat,
    search_lng: lng,
    radius_km: radiusKm
  })
  
  if (error || !data) return null
  return data as PriceData
}

/**
 * Get prices for an area
 */
export async function getAreaPrices(areaSlug: string): Promise<PriceData | null> {
  // This would need a lookup of area -> postcodes
  // Simplified: aggregate all matching postcodes
  const { data, error } = await supabase.rpc('area_prices', {
    area_slug: areaSlug
  })
  
  if (error || !data) return null
  return data as PriceData
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `£${(price / 1000000).toFixed(2)}m`
  }
  return `£${Math.round(price / 1000)}k`
}

/**
 * Get price band label
 */
export function getPriceBand(price: number): string {
  if (price < 200000) return 'Budget'
  if (price < 400000) return 'Affordable'
  if (price < 600000) return 'Mid-range'
  if (price < 1000000) return 'Premium'
  return 'Luxury'
}
