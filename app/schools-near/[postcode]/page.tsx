import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostcodeCoords, formatPostcode } from '@/lib/postcodes'
import { getNearbySchools } from '@/lib/schools'
import { getPostcodePrices } from '@/lib/prices'
import { SchoolCard } from '@/components/SchoolCard'
import { SchoolFilters } from '@/components/SchoolFilters'
import { PricesSummary } from '@/components/PricesSummary'
import { PostcodeSearch } from '@/components/PostcodeSearch'

interface Props {
  params: { postcode: string }
  searchParams: { phase?: string; ofsted?: string; radius?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const formatted = formatPostcode(params.postcode)
  return {
    title: `Schools near ${formatted} | Catchment Check`,
    description: `Find primary and secondary schools near ${formatted}. See Ofsted ratings, exam results, catchment distances and local house prices.`,
  }
}

export default async function SchoolsNearPage({ params, searchParams }: Props) {
  const { postcode } = params
  
  // Get coordinates from postcode
  const coords = await getPostcodeCoords(postcode)
  if (!coords) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Postcode not found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the postcode "{postcode}". Please check and try again.
        </p>
        <PostcodeSearch />
      </main>
    )
  }
  
  // Parse filters
  const radius = parseFloat(searchParams.radius || '3')
  const phaseFilter = searchParams.phase || 'all'
  const ofstedFilter = searchParams.ofsted ? parseInt(searchParams.ofsted) : null
  
  // Fetch schools
  let schools = await getNearbySchools(coords.lat, coords.lng, radius)
  
  // Apply filters
  if (phaseFilter !== 'all') {
    schools = schools.filter(s => s.phase === phaseFilter)
  }
  if (ofstedFilter) {
    schools = schools.filter(s => s.ofsted_rating === ofstedFilter)
  }
  
  // Get local house prices
  const prices = await getPostcodePrices(postcode)
  
  const formatted = formatPostcode(postcode)
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Schools near {formatted}</h1>
        <p className="text-gray-600">
          {schools.length} school{schools.length !== 1 ? 's' : ''} within {radius}km
          {coords.ward && ` • ${coords.ward}, ${coords.district}`}
        </p>
      </div>
      
      {/* Price context */}
      {prices && <PricesSummary prices={prices} className="mb-8" />}
      
      {/* Filters */}
      <SchoolFilters 
        currentPhase={phaseFilter}
        currentOfsted={ofstedFilter}
        currentRadius={radius}
      />
      
      {/* Results */}
      {schools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No schools found matching your filters.</p>
          <a href={`/schools-near/${postcode}`} className="text-blue-600 hover:underline">
            Clear filters
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {schools.map(school => (
            <SchoolCard key={school.urn} school={school} />
          ))}
        </div>
      )}
      
      {/* Search again */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4">Search another location</h2>
        <PostcodeSearch />
      </div>
    </main>
  )
}
