import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Database types
 */
export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          urn: string
          name: string
          slug: string
          phase: string
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
          website: string | null
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'slug'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      ks2_results: {
        Row: {
          urn: string
          year: number
          reading_expected: number | null
          writing_expected: number | null
          maths_expected: number | null
          combined_expected: number | null
          reading_higher: number | null
          writing_higher: number | null
          maths_higher: number | null
          progress_reading: number | null
          progress_writing: number | null
          progress_maths: number | null
        }
      }
      ks4_results: {
        Row: {
          urn: string
          year: number
          attainment8: number | null
          progress8: number | null
          basics_9_4: number | null
          basics_9_5: number | null
          ebacc_entry: number | null
          ebacc_avg_points: number | null
        }
      }
      admissions: {
        Row: {
          urn: string
          year: number
          pan: number
          applications: number
          offers: number
          last_distance_metres: number | null
          offers_looked_after: number | null
          offers_siblings: number | null
          offers_distance: number | null
          source: string
          source_url: string | null
        }
      }
      postcode_prices: {
        Row: {
          postcode: string
          lat: number
          lng: number
          median_price: number
          avg_price: number
          min_price: number
          max_price: number
          sales_count: number
          last_updated: string
        }
      }
    }
  }
}
