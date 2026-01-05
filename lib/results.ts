import { supabase } from './supabase'

/**
 * KS2 (Primary) results
 */
export interface KS2Results {
  urn: string
  year: number
  readingExpected: number | null    // % meeting expected standard
  writingExpected: number | null
  mathsExpected: number | null
  combinedExpected: number | null   // reading + writing + maths
  readingHigher: number | null      // % achieving higher standard
  writingHigher: number | null
  mathsHigher: number | null
  progressReading: number | null    // progress score (-ve to +ve)
  progressWriting: number | null
  progressMaths: number | null
}

/**
 * KS4 (Secondary/GCSE) results
 */
export interface KS4Results {
  urn: string
  year: number
  attainment8: number | null        // avg Attainment 8 score
  progress8: number | null          // progress vs national avg
  basics94: number | null           // % grade 9-4 in English & Maths
  basics95: number | null           // % grade 9-5 in English & Maths
  ebacc: number | null              // % entering EBacc
  ebaccAvgPoints: number | null
  staying: number | null            // % staying in education/employment
}

export type Results = KS2Results | KS4Results

/**
 * Get results for a school
 * Returns last 3 years for trend display
 */
export async function getResults(
  urn: string, 
  phase: string
): Promise<Results[]> {
  const table = phase === 'primary' ? 'ks2_results' : 'ks4_results'
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('urn', urn)
    .order('year', { ascending: false })
    .limit(3)
  
  if (error || !data) return []
  return data as Results[]
}

/**
 * National averages for comparison
 */
export const NATIONAL_AVERAGES = {
  ks4: {
    attainment8: 46.3,
    progress8: 0,
    basics94: 65,
    basics95: 45,
    ebacc: 39
  },
  ks2: {
    readingExpected: 73,
    writingExpected: 71,
    mathsExpected: 73,
    combinedExpected: 60,
    progressReading: 0,
    progressWriting: 0,
    progressMaths: 0
  }
}

/**
 * Format progress score with + sign
 */
export function formatProgress(value: number | null): string {
  if (value === null || value === undefined) return 'N/A'
  const formatted = value.toFixed(2)
  return value > 0 ? `+${formatted}` : formatted
}

/**
 * Get performance label based on progress score
 */
export function getProgressLabel(progress: number): string {
  if (progress > 0.5) return 'Well above average'
  if (progress > 0) return 'Above average'
  if (progress === 0) return 'Average'
  if (progress > -0.5) return 'Below average'
  return 'Well below average'
}

/**
 * Compare to national average
 */
export function compareToNational(value: number, national: number): 'above' | 'average' | 'below' {
  const diff = value - national
  if (Math.abs(diff) < 2) return 'average'
  return diff > 0 ? 'above' : 'below'
}
