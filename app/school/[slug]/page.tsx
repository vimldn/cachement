import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchoolBySlug, getSimilarSchools } from '@/lib/schools'
import { getResults } from '@/lib/results'
import { getAdmissionsData } from '@/lib/admissions'
import { getNearbyPrices } from '@/lib/prices'
import { getOfstedUrl } from '@/lib/ofsted'
import { OfstedBadge } from '@/components/OfstedBadge'
import { QuickStats } from '@/components/QuickStats'
import { ResultsSection } from '@/components/ResultsSection'
import { AdmissionsSection } from '@/components/AdmissionsSection'
import { PricesCard } from '@/components/PricesCard'
import { SimilarSchoolsCard } from '@/components/SimilarSchoolsCard'
import { SchoolMap } from '@/components/SchoolMap'
import { SchoolJsonLd } from '@/components/SchoolJsonLd'

const OFSTED_LABELS: Record<number, string> = {
  1: 'Outstanding',
  2: 'Good',
  3: 'Requires Improvement',
  4: 'Inadequate'
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = await getSchoolBySlug(params.slug)
  if (!school) return { title: 'School not found' }
  
  const ofstedText = school.ofsted_rating 
    ? `Ofsted: ${OFSTED_LABELS[school.ofsted_rating]}.` 
    : ''
  
  return {
    title: `${school.name} | ${school.town} | Catchment Check`,
    description: `${school.name} is a ${school.phase} school in ${school.town}. ${ofstedText} See exam results, catchment info and local house prices.`,
  }
}

export default async function SchoolProfilePage({ params }: Props) {
  const school = await getSchoolBySlug(params.slug)
  if (!school) notFound()
  
  // Fetch all related data in parallel
  const [results, admissions, prices, similar] = await Promise.all([
    getResults(school.urn, school.phase),
    getAdmissionsData(school.urn),
    getNearbyPrices(school.lat, school.lng, 1),
    getSimilarSchools(school)
  ])
  
  const ofstedUrl = getOfstedUrl(school.urn, school.phase, school.type === 'Independent school')
  
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <SchoolJsonLd school={school} results={results} />
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{school.name}</h1>
            <p className="text-gray-600 mt-1">
              {capitalise(school.phase)} school • Ages {school.age_low}-{school.age_high}
              {school.pupils && ` • ${school.pupils.toLocaleString()} pupils`}
            </p>
            <p className="text-gray-600">
              {school.street}, {school.town}, {school.postcode}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {school.type}
            </p>
          </div>
          
          {school.ofsted_rating && (
            <OfstedBadge 
              rating={school.ofsted_rating} 
              date={school.ofsted_date} 
            />
          )}
        </div>
      </header>
      
      {/* Quick stats */}
      <QuickStats school={school} results={results} admissions={admissions} />
      
      {/* Main content grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {/* Main column */}
        <div className="md:col-span-2 space-y-10">
          {/* Admissions / Catchment */}
          <AdmissionsSection 
            admissions={admissions} 
            schoolName={school.name}
            phase={school.phase}
          />
          
          {/* Exam results */}
          <ResultsSection results={results} phase={school.phase} />
          
          {/* Ofsted */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Ofsted inspection</h2>
            {school.ofsted_rating ? (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-medium">{OFSTED_LABELS[school.ofsted_rating]}</span>
                    {school.ofsted_date && (
                      <span className="text-gray-600 ml-2">
                        (inspected {formatDate(school.ofsted_date)})
                      </span>
                    )}
                  </div>
                </div>
                <a 
                  href={ofstedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Read full Ofsted report →
                </a>
              </div>
            ) : (
              <p className="text-gray-600">No Ofsted inspection data available.</p>
            )}
          </section>
          
          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <SchoolMap 
              lat={school.lat} 
              lng={school.lng} 
              name={school.name}
              catchmentRadius={admissions?.lastDistanceMetres}
            />
            <p className="text-sm text-gray-600 mt-2">
              {school.street}, {school.town}, {school.postcode}
            </p>
          </section>
        </div>
        
        {/* Sidebar */}
        <aside className="space-y-6">
          <PricesCard prices={prices} postcode={school.postcode} />
          <SimilarSchoolsCard schools={similar} />
          
          {/* Quick links */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Quick links</h3>
            <ul className="space-y-2 text-sm">
              {school.website && (
                <li>
                  <a 
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    School website →
                  </a>
                </li>
              )}
              <li>
                <a 
                  href={ofstedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ofsted report →
                </a>
              </li>
              <li>
                <a 
                  href={`https://www.compare-school-performance.service.gov.uk/school/${school.urn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  DfE performance data →
                </a>
              </li>
              <li>
                <a 
                  href={`/schools-near/${school.postcode.replace(' ', '')}`}
                  className="text-blue-600 hover:underline"
                >
                  Other schools nearby →
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  })
}
