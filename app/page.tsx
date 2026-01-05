import { PostcodeSearch } from '@/components/PostcodeSearch'
import { PopularAreas } from '@/components/PopularAreas'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find the right school for your family
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Search any UK postcode to see nearby schools, Ofsted ratings, exam results, 
            catchment distances and local house prices.
          </p>
          <PostcodeSearch />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🏫"
              title="Every UK school"
              description="Primary, secondary, and independent schools with up-to-date Ofsted ratings."
            />
            <FeatureCard 
              icon="📊"
              title="Exam results"
              description="SATs and GCSE performance data including Progress 8 and Attainment 8 scores."
            />
            <FeatureCard 
              icon="🏠"
              title="House prices"
              description="See average property prices near each school from Land Registry data."
            />
          </div>
        </div>
      </section>

      {/* Catchment info */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Understanding school catchments</h2>
          <div className="prose prose-gray mx-auto">
            <p>
              Most state schools in England use distance-based admissions for oversubscribed places. 
              After priority groups (looked-after children, siblings, etc.), places typically go to 
              families living closest to the school.
            </p>
            <p>
              The <strong>last distance offered</strong> tells you how far away the furthest admitted 
              child lived in previous years. If you're within this distance, you have a reasonable 
              chance of getting a place—though it varies year to year.
            </p>
            <p>
              We compile this data from council admissions booklets to help you understand your 
              realistic options before you start house hunting.
            </p>
          </div>
        </div>
      </section>

      {/* Popular areas */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Popular areas</h2>
          <PopularAreas />
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
