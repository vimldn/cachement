/**
 * Ofsted report URL utilities
 */

// Ofsted provider type codes
const PHASE_TO_OFSTED_TYPE: Record<string, number> = {
  'primary': 21,
  'secondary': 22,
  'all-through': 22,
}

/**
 * Generate Ofsted report URL for a school
 */
export function getOfstedUrl(
  urn: string, 
  phase: string, 
  isIndependent: boolean
): string {
  if (isIndependent) {
    return `https://reports.ofsted.gov.uk/provider/23/${urn}`
  }
  const type = PHASE_TO_OFSTED_TYPE[phase] || 22
  return `https://reports.ofsted.gov.uk/provider/${type}/${urn}`
}

/**
 * Ofsted rating labels
 */
export const OFSTED_LABELS: Record<number, string> = {
  1: 'Outstanding',
  2: 'Good',
  3: 'Requires Improvement',
  4: 'Inadequate'
}

/**
 * Ofsted rating colors (Tailwind classes)
 */
export const OFSTED_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-green-600', text: 'text-green-600' },
  2: { bg: 'bg-blue-600', text: 'text-blue-600' },
  3: { bg: 'bg-yellow-500', text: 'text-yellow-600' },
  4: { bg: 'bg-red-600', text: 'text-red-600' }
}

/**
 * Short Ofsted labels
 */
export const OFSTED_SHORT: Record<number, string> = {
  1: 'Outstanding',
  2: 'Good',
  3: 'RI',
  4: 'Inadequate'
}
