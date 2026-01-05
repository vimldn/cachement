/**
 * Postcode utilities using postcodes.io API
 */

export interface PostcodeData {
  postcode: string
  lat: number
  lng: number
  ward: string
  district: string
  region: string
}

/**
 * Get coordinates and area info from postcode
 */
export async function getPostcodeCoords(postcode: string): Promise<PostcodeData | null> {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (!data.result) return null
    
    return {
      postcode: data.result.postcode,
      lat: data.result.latitude,
      lng: data.result.longitude,
      ward: data.result.admin_ward,
      district: data.result.admin_district,
      region: data.result.region
    }
  } catch (error) {
    console.error('Error fetching postcode:', error)
    return null
  }
}

/**
 * Validate postcode format
 */
export function isValidPostcode(postcode: string): boolean {
  // UK postcode regex (simplified)
  const regex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i
  return regex.test(postcode.trim())
}

/**
 * Format postcode with space
 */
export function formatPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  // Insert space before last 3 characters
  if (cleaned.length > 3) {
    return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3)
  }
  return cleaned
}

/**
 * Calculate distance between two coordinates (Haversine)
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Bulk lookup postcodes (max 100)
 */
export async function bulkLookupPostcodes(postcodes: string[]): Promise<PostcodeData[]> {
  try {
    const res = await fetch('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcodes: postcodes.slice(0, 100) })
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    
    return data.result
      .filter((r: any) => r.result)
      .map((r: any) => ({
        postcode: r.result.postcode,
        lat: r.result.latitude,
        lng: r.result.longitude,
        ward: r.result.admin_ward,
        district: r.result.admin_district,
        region: r.result.region
      }))
  } catch (error) {
    console.error('Error bulk looking up postcodes:', error)
    return []
  }
}
