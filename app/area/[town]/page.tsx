import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArea, AREAS } from '@/lib/areas'
import { getSchoolsInArea } from '@/lib/schools'
import { getAreaPrices } from '@/lib/prices'
import { SchoolCard } from '@/components/SchoolCard'
import { PostcodeSearch } from '@/components/PostcodeSearch'

interface Props {
  params: { town: string }
}

export async function generateStaticParams() {
  return AREAS.map(area => ({ town: area.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getArea(params.town)
  if (!area) return { title: 'Area not found' }
  
  return {
    title: `Best Schools in ${area.name} | Catchment Check`,
    description: `Find primary and secondary schools in ${area.name}. Compare Ofsted ratings, exam results, catchment areas and local house prices.`,
  }
}

export default async function AreaPage({ params }: Props) {
  const area = getArea(params.town)
  if (!area) notFound()
  
  const schools = await getSchoolsInArea(area.slug)
  const prices = await getAreaPrices(area.slug)
  
  const primarySchools = schools.filter(s => s.phase === 'primary')
  const secondarySchools = schools.filter(s => s.phase === 'secondary')
  
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Schools in {area.name}</h1>
        <p className="text-gray-600">
          {schools.length} schools • {primarySchools.length} primary, {secondarySchools.length} secondary
        </p>
      </header>
      
      {/* Area overview */}
      <section className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {schools.filter(s => s.ofsted_rating === 1).length}
            </div>
            <div className="text-sm text-gray-600">Outstanding schools</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {schools.filter(s => s.ofsted_rating === 2).length}
            </div>
            <div className="text-sm text-gray-600">Good schools</div>
          </div>
          {prices && (
            <div>
              <div className="text-3xl font-bold text-gray-900">
                £{Math.round(prices.avg / 1000)}k
              </div>
              <div className="text-sm text-gray-600">Avg house price</div>
            </div>
          )}
        </div>
      </section>
      
      {/* Search */}
      <section className="mb-12">
        <h2 className="font-semibold mb-4">Search a specific address</h2>
        <PostcodeSearch placeholder={`Enter a postcode in ${area.name}...`} />
      </section>
      
      {/* Secondary schools */}
      {secondarySchools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Secondary schools</h2>
          <div className="space-y-4">
            {secondarySchools
              .sort((a, b) => (a.ofsted_rating || 5) - (b.ofsted_rating || 5))
              .map(school => (
                <SchoolCard key={school.urn} school={school} showDistance={false} />
              ))}
          </div>
        </section>
      )}
      
      {/* Primary schools */}
      {primarySchools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Primary schools</h2>
          <div className="space-y-4">
            {primarySchools
              .sort((a, b) => (a.ofsted_rating || 5) - (b.ofsted_rating || 5))
              .map(school => (
                <SchoolCard key={school.urn} school={school} showDistance={false} />
              ))}
          </div>
        </section>
      )}
      
      {/* SEO content */}
      <section className="prose prose-gray max-w-none mt-12">
        <h2>About schools in {area.name}</h2>
        <p>
          {area.name} has {schools.length} state and independent schools, including {primarySchools.length} primary 
          schools and {secondarySchools.length} secondary schools. 
          {schools.filter(s => s.ofsted_rating === 1 || s.ofsted_rating === 2).length} schools are rated 
          Good or Outstanding by Ofsted.
        </p>
        <p>
          School admissions in {area.name} are managed by {area.council || 'the local council'}. Most schools 
          use distance-based admissions criteria, meaning families living closer to the school have priority 
          for places.
        </p>
        {prices && (
          <p>
            The average house price in {area.name} is £{prices.avg.toLocaleString()}, with properties 
            ranging from £{prices.min.toLocaleString()} to £{prices.max.toLocaleString()}.
          </p>
        )}
      </section>
    </main>
  )
}
